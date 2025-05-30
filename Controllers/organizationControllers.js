import Organization  from'../models/organizationmodel.js';  // Adjust path as needed
import axios from 'axios';
import { bucketsAPI , influxDB } from '../db/influxDB/influx.js';

// Create new organization
export const createOrganization = async (req, res) => {
    try {
    const { name, address, noOfShifts, shiftTimings, orgInfo, uploadedImage } = req.body;

    // Validate shiftTimings
    if (shiftTimings && shiftTimings.length > 5) {
        return res.status(400).json({ message: 'Shift timings cannot exceed 5 entries.' });
    }
    
    // Validate orgInfo
    if (orgInfo) {
        for (const info of orgInfo) {
            const { unit, department, designation } = info;
            if (!unit || !department || !designation) {
                return res.status(400).json({ message: 'Each orgInfo must have unit, department, and designation.' });
            }
        }
    }
        // Create organization document in MongoDB
        const organization = new Organization({
            name,
            address,
            noOfShifts,
            shiftTimings,
            orgInfo,
            uploadedImage
        });

        const savedOrganization = await organization.save();
        // Create organization in InfluxDB
        const influxData = { name: name };

        try {
            const influxResponse = await axios.post(`${process.env.INFLUX_URL}/api/v2/orgs`, influxData, {
                headers: {
                    Authorization: `Token ${process.env.INFLUXDB_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            // console.log(influxResponse)

            if (influxResponse.status === 201) {
                // Update MongoDB document with InfluxDB ID
                const influxOrgId = influxResponse.data.id;
                savedOrganization.influxOrgId = influxOrgId;
                await savedOrganization.save();
                return  res.status(201).json({
                    message: 'Organization created successfully in MongoDB and InfluxDB!',
                    organization: savedOrganization,
                    influxOrg: influxResponse.data
                });
            } else {
                await Organization.findByIdAndDelete(savedOrganization._id);
                res.status(500).json({ message: 'Failed to create organization in InfluxDB. Organization was rolled back from MongoDB.' });
            }
        } catch (influxErr) {
            await Organization.findByIdAndDelete(savedOrganization._id);
            // Handle specific InfluxDB errors
            if (influxErr.response?.status === 422) {
               return res.status(422).json({
                    message: 'Organization with the same name already exists in InfluxDB.',
                });
            }

          res.status(500).json({
                message: 'Failed to connect to InfluxDB.',
              influxErrmessage :influxErr.message
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
}
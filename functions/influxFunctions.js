const { InfluxDB } = require('@influxdata/influxdb-client');
require('dotenv').config();

/**
 * Checks if the connection to InfluxDB is working
 * @param {string} [url] InfluxDB server URL (defaults to process.env.INFLUX_URL)
 * @param {string} [token] InfluxDB authentication token (defaults to process.env.INFLUXDB_TOKEN)
 * @returns {Promise<boolean>} - true if connected, false if connection failed
 */
async function checkInfluxDBConnection(url, token) {
  url = url || process.env.INFLUX_URL;
  token = token || process.env.INFLUXDB_TOKEN;

  try {
    const influxDB = new InfluxDB({ url, token });
    
    // The ping() endpoint is available without organization or bucket context
    const health = await influxDB.ping();
    
    // Check if we got a valid response
    if (health && (health.status === 'ready' || health.status === 'pass')) {
      console.log('✅ Successfully connected to InfluxDB');
      console.log(`InfluxDB version: ${health.version}`);
      return true;
    }
    
    console.warn('⚠️ InfluxDB connection check returned unexpected status:', health);
    return false;
  } catch (error) {
    console.error('❌ Failed to connect to InfluxDB:', error.message);
    return false;
  }
}

// Usage example
// checkInfluxDBConnection().then(isConnected => {
//   console.log('Connection status:', isConnected);
// });

module.exports = { checkInfluxDBConnection };
const { getRole } = require("../functions/userFunctions");
    
const isSignedIn = async (req, res, next) => {
  const authToken = req.cookies.authToken;
  

  if (!authToken) {
    return res.status(401).json({ message: "User not signed in" });
  }

  try {
    const data = await getRole(authToken);

    if (!data || !data.role) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Optionally attach user info to request for downstream use
    req.user = data;

    next();
  } catch (err) {
    console.error("Invalid auth token:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};


const isSuperAdmin = async (req, res, next) => {
    try {
        const authToken=req.cookies.authToken

        if (!authToken) {
            return res.status(401).json({ message: "No auth token provided" });
        }

        const data = await getRole(authToken); // Await if it's an async function

        if (data?.role === "SuperAdmin") {
            return next();
        } else {
            return res.status(403).json({ message: "Access denied. Not a SuperAdmin" });
        }
    } catch (e) {
        console.error("Middleware error:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const isAdmin = async (req, res, next) => {
    try {
        const authToken=req.cookies.authToken

        if (!authToken) {
            return res.status(401).json({ message: "No auth token provided" });
        }

        const data = await getRole(authToken); // Await if it's an async function

        if (data?.role === "Admin") {
            return next();
        } else {
            return res.status(403).json({ message: "Access denied. Not a SuperAdmin" });
        }
    } catch (e) {
        console.error("Middleware error:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
};



const isSuperUser = async (req, res, next) => {
    try {
        const authToken=req.cookies.authToken

        if (!authToken) {
            return res.status(401).json({ message: "No auth token provided" });
        }

        const data = await getRole(authToken); // Await if it's an async function

        if (data?.role === "SuperUser") {
            return next();
        } else {
            return res.status(403).json({ message: "Access denied. Not a Super User" });
        }
    } catch (e) {
        console.error("Middleware error:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const isCheckSheetUser = async (req, res, next) => {
    try {
        const authToken=req.cookies.authToken

        if (!authToken) {
            return res.status(401).json({ message: "No auth token provided" });
        }

        const data = await getRole(authToken); // Await if it's an async function

        if (data?.role === "CheckSheetUser") {
            return next();
        } else {
            return res.status(403).json({ message: "Access denied. Not a CheckSheet User" });
        }
    } catch (e) {
        console.error("Middleware error:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports={isSignedIn,isSuperAdmin,isCheckSheetUser,isSuperUser,isAdmin}
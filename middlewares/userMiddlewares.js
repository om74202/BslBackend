const { getRole } = require("../functions/userFunctions");

const extractAuthToken = (req) => {
  const authHeader = (req.headers.authorization || "").trim();

  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      return authHeader.slice(7).trim();
    }

    return authHeader;
  }

  return req.cookies?.authToken || null;
};

const authenticate = async (req, res, next) => {
  const authToken = extractAuthToken(req);

  if (!authToken) {
    return res.status(401).json({ message: "No auth token provided" });
  }

  try {
    const data = await getRole(authToken);

    if (!data || !data.role) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = data;
    req.authToken = authToken;

    return next();
  } catch (err) {
    console.error("Invalid auth token:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access denied. Not a ${role}` });
    }

    return next();
  };
};

const isSignedIn = authenticate;
const isSuperAdmin = [authenticate, requireRole("SuperAdmin")];
const isAdmin = [authenticate, requireRole("Admin")];
const isSuperUser = [authenticate, requireRole("SuperUser")];
const isCheckSheetUser = [authenticate, requireRole("CheckSheetUser")];

module.exports = {
  authenticate,
  extractAuthToken,
  requireRole,
  isSignedIn,
  isSuperAdmin,
  isCheckSheetUser,
  isSuperUser,
  isAdmin,
};

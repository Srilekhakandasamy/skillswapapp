const jwt = require("jsonwebtoken");

// =======================
// 🔐 AUTH MIDDLEWARE
// =======================
module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // Basic request info for tracing
    console.log(`Auth middleware: ${req.method} ${req.originalUrl}`);
    // Raw headers array (as Node received them) and parsed headers
    console.log("Raw headers:", req.rawHeaders);
    console.log("Headers:", JSON.stringify(req.headers));
    console.log("Auth header:", authHeader);

    // ❌ No header
    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // ❌ Must be "Bearer token"
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    const token = parts[1];

    // 🔐 Verify token
    console.log("JWT secret present:", !!process.env.JWT_SECRET);
    // show only length to avoid leaking secret in logs
    console.log("JWT secret length:", process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👤 Attach user safely
    req.user = {
      id: decoded.id,
    };

    next();
  } catch (err) {
    console.log("🔥 Auth Middleware Error:", err);
    console.log(err && err.stack);

    return res.status(401).json({
      message: "Authentication failed or token expired",
    });
  }
};
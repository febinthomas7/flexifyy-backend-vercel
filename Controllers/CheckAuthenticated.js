const jwt = require("jsonwebtoken");
const CheckAuthenticated = (req, res) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res
      .status(403)
      .json({ message: "Unauthorized ,JWT token required", success: false });
  }
  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;

    return res.status(200).json({ message: "success", success: true });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid JWT token or expired token", success: false });
  }
};

module.exports = CheckAuthenticated;

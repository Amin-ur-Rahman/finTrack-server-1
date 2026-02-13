const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  console.log("toekn from middleware", token);

  if (!token) return res.status(401).send({ message: "Unauthorized Request" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).send({ message: "Forbidden Request" });
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;

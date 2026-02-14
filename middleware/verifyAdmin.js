const verifyAdmin = (req, res, next) => {
  console.log("user role", req.user.role);

  if (req.user?.role !== "admin") {
    return res.status(403).send({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = verifyAdmin;

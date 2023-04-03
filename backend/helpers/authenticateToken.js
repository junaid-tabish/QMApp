const jwt = require("jsonwebtoken");
const jwtSecret = "asdsahdhasdvh242143hjbhasdf3wq";
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = (await authHeader) && authHeader.split(" ")[1];
  if (token == null) {
    res.json({ err: 1, msg: "Token not matched" });
  } else {
    jwt.verify(token, jwtSecret, (err, data) => {
      if (err) {
        res.json({ err: 1, msg: "Token incorrect" });
      } else {
        next();
      }
    });
  }
}
module.exports = { authenticateToken };

const { query } = require("../models/db");
const jwt = require("jsonwebtoken");
const getPrincipalData = async (req, res) => {
  const { userName, password } = req.body;
  console.log(userName, password);
  try {
    const result = await query(
      "SELECT * FROM principal WHERE username=? AND password=? ",
      [userName, password]
    );
    const token = jwt.sign(
      { userId: userName, role: "principal" },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );
    console.log(result);
    if (result.length >= 1) {
      res
        .status(201)
        .json({
          message: "Login successful",
          userData: result[0],
          token: token,
        });
    } else {
      res
        .status(401)
        .json({ message: "User does not exist or wrong password" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

module.exports = { getPrincipalData };

const { query } = require("../models/db");
const jwt = require("jsonwebtoken");

const getTeacherData = async (req, res) => {
  const { userName, password } = req.body;
  console.log(userName, password);
  try {
    const result = await query(
      "SELECT * FROM teachers WHERE username=? and password=? AND allow=?", // Corrected table name to 'user'
      [userName, password, "yes"] // Values to be inserted
    );
    const token = jwt.sign(
      { userId: userName, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );
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
    } // Send a success response
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" }); // Send an error response
  }
};

//get teachers data pending to allow
const getTeachersPendingToAllow = async (req, res) => {
  try {
    const result = await query("SELECT * FROM teachers where allow=?", ["no"]);
    res.status(201).json({ teachersData: result });
  } catch (error) {
    res.status(500).json({ message: "error occured", error });
  }
};

//update allow for teachers
const updateTeacherAllow = async (req, res) => {
  console.log("getTeachersPendingToAllow");

  const { teacherId, allow } = req.body;
  console.log(teacherId, allow);
  try {
    let result;
    if (allow === "yes") {
      result = await query(
        "UPDATE teachers SET allow = ? WHERE teacher_id = ?",
        [allow, teacherId]
      );
      res.status(200).json({ message: "Teacher updated", result });
    } else {
      result = await query("DELETE FROM teachers WHERE teacher_id = ?", [
        teacherId,
      ]);
      res.status(200).json({ message: "Teacher deleted", result });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred", error });
  }
};

const insertTeacherData = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    password,
    email,
    subject,
    age,
    salary,
    gender,
  } = req.body;
  console.log(
    firstName,
    lastName,
    username,
    password,
    email,
    subject,
    age,
    salary,
    gender
  );
  try {
    const result = await query(
      "INSERT INTO teachers (first_name,last_name,username,password,email,subject,age, salary,gender) VALUES (?, ?,?, ?,?, ?,?, ?,?)", // Corrected table name to 'user'
      [
        firstName,
        lastName,
        username,
        password,
        email,
        subject,
        age,
        salary,
        gender,
      ] // Values to be inserted
    );
    res.status(201).json({
      message: "Teacher data created successfully",
      data: result,
    }); // Send a success response
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error }); // Send an error response
  }
};

module.exports = {
  insertTeacherData,
  getTeacherData,
  updateTeacherAllow,
  getTeachersPendingToAllow,
};

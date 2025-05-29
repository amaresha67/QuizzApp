const { query } = require("../models/db");

const getStudentData = async (req, res) => {
  const { userName, password } = req.body;
  console.log(userName, password);
  try {
    const result = await query(
      "SELECT * FROM students WHERE username=? AND password=? AND allow=?",
      [userName, password, "yes"]
    );
    console.log(result);
    if (result.length >= 1) {
      res
        .status(201)
        .json({ message: "Login successful", userData: result[0] });
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

//get students that are needed to allow in by teacher
const getStudentsPendingToAllow = async (req, res) => {
  console.log("students");

  try {
    const result = await query("SELECT * FROM students where allow=?", ["no"]);
    console.log(result);
    res.status(200).json({ studentsData: result });
  } catch (error) {
    res.status(500).json({ message: "error occured", error });
  }
};
//update student allow status
const updateStudentAllow = async (req, res) => {
  const { studentId, allow } = req.body;
  console.log(studentId, allow);
  try {
    let result;
    if (allow === "yes") {
      result = await query(
        "UPDATE students SET allow = ? WHERE roll_number = ?",
        [allow, studentId]
      );
      res.status(200).json({ message: "student updated", result });
    } else {
      result = await query("DELETE FROM students WHERE roll_number= ?", [
        studentId,
      ]);
      res.status(200).json({ message: "student deleted", result });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred", error });
  }
};
//insert student data
const insertStudentData = async (req, res) => {
  const {
    rollNumber,
    firstName,
    lastName,
    userName,
    password,
    studentClass,
    email,
    phoneNumber,
    fatherName,
  } = req.body;
  console.log(
    rollNumber,
    firstName,
    lastName,
    studentClass,
    email,
    phoneNumber,
    fatherName,
    userName,
    password
  );
  try {
    const result = await query(
      "INSERT INTO students (roll_number,first_name,last_name,class,email,phone_number,father_name,username,password) VALUES (?,?,?,?,?,?,?,?,?)", // Corrected table name to 'user'
      [
        rollNumber,
        firstName,
        lastName,
        studentClass,
        email,
        phoneNumber,
        fatherName,
        userName,
        password,
      ] // Values to be inserted
    );
    res.status(201).json({
      message: "Student data inserted successfully",
      rollNumber: result.rool_number,
    }); // Send a success response
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to insert student data" }); // Send an error response
  }
};

module.exports = {
  insertStudentData,
  getStudentData,
  getStudentsPendingToAllow,
  updateStudentAllow,
};

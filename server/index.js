const express = require("express");
require("./initDb");
require("dotenv").config(); // This line must come before using process.env.*
const verifyToken = require("./middleware/auth");
const app = express();
const port = process.env.DB_PORT || 3001;
const cors = require("cors");
const {
  insertStudentData,
  getStudentData,
  getStudentsPendingToAllow,
  updateStudentAllow,
} = require("./routes/studentRoutes");
const {
  insertTeacherData,
  getTeacherData,
  getTeachersPendingToAllow,
  updateTeacherAllow,
} = require("./routes/teacherRoutes");
const { getPrincipalData } = require("./routes/principalRoutes");
const {
  addTest,
  getTests,
  deleteTest,
  getTest,
  updateTest,
  getTestsOfStudent,
} = require("./routes/testRoutes");
const { insertScore, getStudentScores } = require("./routes/scoreRoutes");

app.use(cors());
app.use(express.json());

app.post("/api/principal/login", getPrincipalData);

app.post("/api/students",  insertStudentData);
app.post("/api/students/login", getStudentData);
app.get("/api/students/pending", verifyToken, getStudentsPendingToAllow);
app.post("/api/student/updateAllow", verifyToken, updateStudentAllow);

app.post("/api/teachers", insertTeacherData);
app.post("/api/teachers/login", getTeacherData);
app.get("/api/teachers/pending", verifyToken, getTeachersPendingToAllow);
app.post("/api/teachers/updateAllow", verifyToken, updateTeacherAllow);

app.post("/api/tests/addTest", addTest);
app.delete("/api/tests/deleteTest/:test_id", verifyToken, deleteTest);
app.post("/api/tests/updateTest/:test_id", verifyToken, updateTest);
app.get("/api/tests/getTest/:test_id", verifyToken, getTest);
app.get("/api/tests/getTests", verifyToken, getTests);
app.get("/api/tests/getTests/:student_id", verifyToken, getTestsOfStudent);

app.post("/api/Score/insertScore", verifyToken, insertScore);
app.post("/api/Score/getScores", verifyToken, getStudentScores);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

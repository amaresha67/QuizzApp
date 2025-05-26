const { query } = require("../models/db");

const insertScore = async (req, res) => {
  const { test_id, student_id, score } = req.body;
  console.log(test_id, student_id, score);
  try {
    const result = await query(
      "INSERT INTO score (test_id,student_id,score) VALUES (?,?,?)",
      [test_id, student_id, score]
    );
    console.log(result);

    res.status(200).json({ message: "inserted successful" });
  } catch (error) {
    console.error("error while inserting:", error);
    res.status(500).json({ error: "Failed to insert score" });
  }
};

//get all students scores filterd by class, subject, and testname
const getStudentScores = async (req, res) => {
  const { class: className, testName, subject } = req.body;
  console.log(className, testName, subject);
  try {
    const results = await query(
      `SELECT st.roll_number, st.first_name, st.last_name, sc.score, t.title, t.subject, t.scheduled_at
       FROM score AS sc
       INNER JOIN students AS st ON sc.student_id = st.roll_number
       INNER JOIN tests AS t ON sc.test_id = t.test_id
       WHERE st.class = ? AND t.title = ? AND t.subject = ?`,
      [className, testName, subject]
    );
    console.log(results);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching student scores:", error);
    res.status(500).json({ error: "Failed to retrieve scores" });
  }
};

module.exports = { insertScore, getStudentScores };

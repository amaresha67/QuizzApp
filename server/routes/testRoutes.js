const { query } = require("../models/db");

// Mock request and response objects
// const mockReq = {
//   body: {
//     key1: "value1",
//     key2: "value2",
//   },
// };

// const mockRes = {
//   status: (code) => ({
//     json: (data) => console.log("Response:", code, data),
//   }),
// };

//get tests
const getTests = async (req, res) => {
  try {
    const result = await query("select * from tests");
    // console.log(result);
    res.status(200).json({ tests: result });
  } catch (error) {
    console.error("Error accessing test:", error);
    res.status(500).json({ error: error.message });
  }
};

//getTest
const getTest = async (req, res) => {
  const { test_id } = req.params;

  try {
    // Get test details
    const testResult = await query("SELECT * FROM tests WHERE test_id = ?", [
      test_id,
    ]);

    // Get all related questions
    const questionResult = await query(
      "SELECT * FROM questionanswers WHERE test_id = ?",
      [test_id]
    );
    console.log("testdetails", testResult);
    console.log(questionResult);
    res.status(200).json({
      testDetails: testResult[0], // assuming one test row per test_id
      questions: questionResult, // array of question-answer objects
    });
  } catch (error) {
    console.error("Error fetching test and questions:", error);
    res.status(500).json({ error: error.message });
  }
};

//delete test
const deleteTest = async (req, res) => {
  const { test_id } = req.params; // Usually test_id is passed via route params

  try {
    const result = await query("DELETE FROM tests WHERE test_id = ?", [
      test_id,
    ]);
    res.status(200).json({ message: "Test deleted successfully", result });
  } catch (error) {
    console.error("Error while deleting test:", error);
    res.status(500).json({ error: error.message });
  }
};

//update test
const updateTest = async (req, res) => {
  const { test_id } = req.params;
  let { testDetails, questions } = req.body;
  let {
    title,
    subject,
    class: testClass,
    duration,
    scheduled_at,
  } = testDetails;

  const formattedDate = new Date((scheduled_at += ":00"))
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    //delete test
    const result1 = await query("DELETE FROM tests WHERE test_id = ?", [
      test_id,
    ]);
    // Insert into test table
    const result = await query(
      "INSERT INTO tests (test_id,title, subject, class, duration, scheduled_at) VALUES (?, ?, ?, ?, ?,?)",
      [test_id, title, subject, testClass, duration, formattedDate]
    );

    const testId = result.insertId;

    // Insert questions
    if (questions && Array.isArray(questions)) {
      const questionValues = questions.map((q) => [
        testId,
        q.questionText,
        q.options[0],
        q.options[1],
        q.options[2],
        q.options[3],
        q.correctAnswerIndex,
      ]);

      await query(
        `INSERT INTO questionanswers 
     (test_id, question, option_1, option_2, option_3, option_4, answer) 
     VALUES ${questionValues.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ")}`,
        questionValues.flat()
      );
    }

    res.status(201).json({
      message: "Test and questions inserted successfully",
      testId: testId,
    });
  } catch (error) {
    console.error("Error inserting test or questions:", error);
    res.status(500).json({ error: error.message });
  }
};

// addtest
const addTest = async (req, res) => {
  let { testDetails, questions } = req.body;
  let {
    title,
    subject,
    class: testClass,
    duration,
    scheduled_at,
  } = testDetails;

  const formattedDate = new Date((scheduled_at += ":00"))
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    // Insert into test table
    const result = await query(
      "INSERT INTO tests (title, subject, class, duration, scheduled_at) VALUES (?, ?, ?, ?, ?)",
      [title, subject, testClass, duration, formattedDate]
    );

    const testId = result.insertId;

    // Insert questions
    if (questions && Array.isArray(questions)) {
      const questionValues = questions.map((q) => [
        testId,
        q.questionText,
        q.options[0],
        q.options[1],
        q.options[2],
        q.options[3],
        q.correctAnswerIndex,
      ]);

      await query(
        `INSERT INTO QuestionAnswers 
     (test_id, question, option_1, option_2, option_3, option_4, answer) 
     VALUES ${questionValues.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ")}`,
        questionValues.flat()
      );
    }

    res.status(201).json({
      message: "Test and questions inserted successfully",
      testId: testId,
    });
  } catch (error) {
    console.error("Error inserting test or questions:", error);
    res.status(500).json({ error: error.message });
  }
};

//get student tests
const getTestsOfStudent = async (req, res) => {
  const { student_id } = req.params;

  try {
    const completedTests = await query(
      "SELECT t.test_id, t.title, t.subject,t.class , t.duration,t.created_at,t.scheduled_at,s.score FROM tests AS t INNER JOIN score AS s ON t.test_id = s.test_id WHERE s.student_id =?",
      [student_id]
    );
    console.log("inside");
    console.log(completedTests);
    const unCompletedTests = await query(
      `SELECT t.test_id, t.title, t.subject, t.class, t.duration, t.created_at, t.scheduled_at
   FROM tests AS t
   JOIN students AS st ON t.class = st.class
   LEFT JOIN score AS s ON t.test_id = s.test_id AND s.student_id = st.roll_number
   WHERE st.roll_number = ? AND s.student_id IS NULL`,
      [student_id]
    );

    console.log(unCompletedTests);
    res.status(201).json({
      completedTests: completedTests,
      unCompletedTests: unCompletedTests,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addTest,
  getTests,
  deleteTest,
  getTest,
  updateTest,
  getTestsOfStudent,
};

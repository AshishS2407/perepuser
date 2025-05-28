import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebarLayout from "../components/AdminSidebarLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMockQuestionPage = () => {
  const { mockTestId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [questionText, setQuestionText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [subTests, setSubTests] = useState([]);
  const [subTestCategory, setSubTestCategory] = useState("");
  const [questions, setQuestions] = useState([]);

  // Fetch subtests for dropdown
  useEffect(() => {
    const fetchSubTests = async () => {
      try {
        const res = await axios.get("http://localhost:3000/tests/sub-tests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("SubTests response:", res.data);
        if (Array.isArray(res.data)) {
          setSubTests(res.data);
        } else {
          setSubTests([]);
          toast.error("Invalid subtests data from server");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch subtests");
      }
    };

    fetchSubTests();
  }, [token]);

  // Fetch existing questions of this mock test
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/mock/${mockTestId}/questions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Questions fetch response:", res.data);

        if (Array.isArray(res.data)) {
          setQuestions(res.data);
        } else if (res.data && Array.isArray(res.data.questions)) {
          setQuestions(res.data.questions);
        } else {
          setQuestions([]);
          toast.error("Invalid questions data from server");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch questions");
      }
    };

    fetchQuestions();
  }, [mockTestId, token]);

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    
    if (field === "isCorrect") {
      // For radio buttons, set all other options to false
      updated.forEach((opt, i) => {
        opt.isCorrect = i === index ? value : false;
      });
    } else {
      updated[index][field] = value.trimStart();
    }
    
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!questionText.trim() || options.some((opt) => !opt.text.trim())) {
      toast.error("All fields and options are required");
      return;
    }

    if (!subTestCategory) {
      toast.error("Please select a subtest category");
      return;
    }

    // Validation: Exactly one correct option must be selected
    const correctOptionsCount = options.filter(opt => opt.isCorrect).length;
    if (correctOptionsCount !== 1) {
      toast.error("Please select exactly one correct option");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/mock/${mockTestId}/add-question`,
        { questionText, options, explanation, subTestCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Question added successfully");
      // Reset form
      setQuestionText("");
      setExplanation("");
      setOptions([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      setSubTestCategory("");
      // Reload questions list by appending newly added question from response
      if (res.data?.question) {
        setQuestions((prev) => [...prev, res.data.question]);
      } else {
        // If no question returned, refetch list
        const listRes = await axios.get(
          `http://localhost:3000/mock/${mockTestId}/questions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (Array.isArray(listRes.data)) {
          setQuestions(listRes.data);
        } else if (listRes.data && Array.isArray(listRes.data.questions)) {
          setQuestions(listRes.data.questions);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add question");
    }
  };

  // Delete question handler
  const handleDelete = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`http://localhost:3000/mock/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Question deleted");
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete question");
    }
  };

  // Edit question - navigate to edit page
  const handleEdit = (questionId) => {
    navigate(`/admin/mockquestions/edit/${questionId}`);
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Question to Mock Test
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-1">Question Text</label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded"
              rows="4"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">
              Options (select one correct answer)
            </label>
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center mb-2 gap-2">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(idx, "text", e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder={`Option ${idx + 1}`}
                  required
                />
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={option.isCorrect}
                    onChange={(e) =>
                      handleOptionChange(idx, "isCorrect", e.target.checked)
                    }
                  />
                  Correct
                </label>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Explanation (optional)</label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded"
              rows="3"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Subtest Category</label>
            <select
              className="w-full border border-gray-300 p-2 rounded"
              value={subTestCategory}
              onChange={(e) => setSubTestCategory(e.target.value)}
              required
            >
              <option value="">-- Select Subtest Category --</option>
              {Array.isArray(subTests) &&
                subTests.map((test) => (
                  <option key={test._id} value={test.testTitle}>
                    {test.testTitle}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold rounded hover:opacity-90"
          >
            Submit Question
          </button>
        </form>

        {/* Existing Questions List */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Existing Questions</h3>
          {questions.length === 0 ? (
            <p>No questions added yet.</p>
          ) : (
            <ul>
              {questions.map((q) => (
                <li
                  key={q._id}
                  className="border p-3 mb-3 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{q.questionText}</p>
                    <small>Subtest: {q.subTestCategory || "N/A"}</small>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(q._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminSidebarLayout>
  );
};

export default AddMockQuestionPage;
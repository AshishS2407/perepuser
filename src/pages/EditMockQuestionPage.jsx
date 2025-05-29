import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebarLayout from "../components/AdminSidebarLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditMockQuestionPage = () => {
const { questionId, mockTestId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [explanation, setExplanation] = useState("");
  const [subTests, setSubTests] = useState([]);
  const [subTestCategory, setSubTestCategory] = useState("");

  // Fetch question data
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(
          `https://lumiprep10-production-e6da.up.railway.app/mock/questions/${questionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const q = res.data;

        setQuestionText(q.questionText || "");
        setExplanation(q.explanation || "");
        setSubTestCategory(q.subTestCategory || "");

        if (Array.isArray(q.options) && q.options.length === 4) {
          setOptions(q.options);
        } else {
          setOptions([
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load question data");
      }
    };

    // Fetch subtests for dropdown
    const fetchSubTests = async () => {
      try {
        const res = await axios.get("https://lumiprep10-production-e6da.up.railway.app/tests/sub-tests", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    fetchQuestion();
  }, [questionId, token]);

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
      await axios.put(
        `https://lumiprep10-production-e6da.up.railway.app/mock/questions/${questionId}`,
        {
          questionText,
          options,
          explanation,
          subTestCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Question updated successfully");
      setTimeout(() => {
        navigate(`/create-mock`);
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update question");
    }
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Question
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
            Update Question
          </button>
        </form>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminSidebarLayout>
  );
};

export default EditMockQuestionPage;
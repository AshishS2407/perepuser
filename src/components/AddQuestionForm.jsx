import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddQuestionForm = () => {
  const { id } = useParams(); // testId
  const token = localStorage.getItem('token');

  const [test, setTest] = useState(null);
  const navigate = useNavigate();
  const [questionText, setQuestionText] = useState('');
  const [questions, setQuestions] = useState([]); // ✅ Initialize as array
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`https://lumiprep10-production-e6da.up.railway.app/tests/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTest(res.data);
      } catch (err) {
        toast.error('Failed to fetch test details');
      }
    };

    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`https://lumiprep10-production-e6da.up.railway.app/tests/${id}/questions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestions(res.data.questions || res.data); // ✅ Ensure it's an array
      } catch (err) {
        toast.error('Failed to fetch questions');
      }
    };

    fetchTest();
    fetchQuestions();
  }, [id, token]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!questionText || options.some((opt) => opt.text.trim() === '')) {
      toast.error('Question and all options are required.');
      return;
    }

    const isAnyCorrect = options.some((opt) => opt.isCorrect);
    if (!isAnyCorrect) {
      toast.error('Please select a correct answer.');
      return;
    }

    try {
      const res = await axios.post(
        `https://lumiprep10-production-e6da.up.railway.app/tests/${id}/questions`,
        { questionText, options },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success(res.data.message || 'Question added successfully');
      setQuestionText('');
      setOptions([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
      // Refresh questions list
      const updated = await axios.get(`https://lumiprep10-production-e6da.up.railway.app/tests/${id}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(updated.data.questions || updated.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add question');
    }
  };

  const handleDelete = async (questionId) => {
    try {
      // Find the question to show in confirmation message
      const questionToDelete = questions.find(q => q._id === questionId);
      if (!questionToDelete) {
        toast.error('Question not found');
        return;
      }
  
      // Confirmation dialog
      const confirmDelete = window.confirm(
        `Are you sure you want to delete this question?\n\n"${questionToDelete.questionText}"`
      );
  
      if (!confirmDelete) return;
  
      // Show loading state
      toast.info('Deleting question...', { autoClose: false });
  
      await axios.delete(
        `https://lumiprep10-production-e6da.up.railway.app/tests/${id}/questions/${questionId}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
  
      // Remove the loading toast and show success
      toast.dismiss();
      toast.success('Question deleted successfully');
      
      // Update state
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    } catch (err) {
      toast.dismiss();
      toast.error(
        err.response?.data?.message || 
        'Failed to delete question. Please try again.'
      );
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (questionId) => {
    navigate(`/tests/${id}/questions/${questionId}/edit`);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 sm:p-10"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Add Question to: {test?.testTitle || 'Loading...'}
        </h1>

        <input
          type="text"
          placeholder="Enter question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border p-2 rounded mb-4 placeholder:text-gray-400 text-sm sm:text-base"
        />

        {options.map((opt, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3"
          >
            <input
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt.text}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="flex-1 border p-2 rounded placeholder:text-gray-400 w-full text-sm sm:text-base"
            />
            <div className="flex items-center gap-1 mt-1 sm:mt-0">
              <input
                type="radio"
                name="correctOption"
                checked={opt.isCorrect}
                onChange={() => handleCorrectChange(idx)}
              />
              <label className="text-sm">Correct</label>
            </div>
          </div>
        ))}

        <button
          className="mt-6 w-full sm:w-auto px-5 py-2 text-white font-medium rounded bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition"
          onClick={handleSubmit}
        >
          Submit Question
        </button>
      </motion.div>

{/* List of Existing Questions */}
<div className="w-full max-w-3xl mt-10">
  <h2 className="text-xl font-semibold mb-4">Existing Questions</h2>
  {questions.length === 0 ? (
    <p className="text-gray-500">No questions added yet.</p>
  ) : (
    questions.map((q, idx) => (
      <div key={q._id} className="border p-4 mb-4 rounded-lg shadow-sm bg-white">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-lg">
            {idx + 1}. {q.questionText}
          </h3>
          {q.addedBy && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              Added by: {q.addedBy.name || 'Admin'}
            </span>
          )}
        </div>
        
        <ul className="list-disc ml-6 mb-3 mt-2">
          {q.options.map((opt, i) => (
            <li 
              key={i} 
              className={opt.isCorrect ? 'text-green-600 font-semibold' : ''}
            >
              {opt.text}
            </li>
          ))}
        </ul>
        
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => handleEdit(q._id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(q._id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}
</div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddQuestionForm;

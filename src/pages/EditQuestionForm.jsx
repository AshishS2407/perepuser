import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminSidebarLayout from '../components/AdminSidebarLayout';

const EditQuestionForm = () => {
  const { testId, questionId } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(
          `https://lumiprep10-production-e6da.up.railway.app/tests/${testId}/questions/${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestionText(res.data.questionText);
        setOptions(res.data.options);
      } catch (err) {
        toast.error('Failed to load question');
      }
    };

    fetchQuestion();
  }, [testId, questionId, token]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleCorrectChange = (index) => {
    const updatedOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(updatedOptions);
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
      await axios.put(
        `https://lumiprep10-production-e6da.up.railway.app/tests/${testId}/questions/${questionId}`,
        { questionText, options },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Question updated successfully');
      navigate(`/add-question/${testId}`); // Redirect back to add-question page
    } catch (err) {
      toast.error('Failed to update question');
    }
  };

  return (
    <AdminSidebarLayout>
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Question</h2>
        <input
          type="text"
          placeholder="Enter question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center mb-2 gap-2">
            <input
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt.text}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            <input
              type="radio"
              name="correctOption"
              checked={opt.isCorrect}
              onChange={() => handleCorrectChange(idx)}
            />
            <label className="text-sm">Correct</label>
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Question
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </AdminSidebarLayout>
  );
};

export default EditQuestionForm;

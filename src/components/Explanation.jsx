import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Explanation = () => {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newExplanation, setNewExplanation] = useState('');
  const [visibleExplanationForm, setVisibleExplanationForm] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 2;

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`https://lumiprep10-production-e6da.up.railway.app/tests/${testId}/questions`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          withCredentials: false,
        });

        if (Array.isArray(res.data)) {
          setQuestions(res.data);
        } else if (Array.isArray(res.data.questions)) {
          setQuestions(res.data.questions);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch questions');
      }
    };

    fetchQuestions();
  }, [testId, token]);

  const handleAddExplanation = async (questionId) => {
    try {
      const res = await axios.put(
        `https://lumiprep10-production-e6da.up.railway.app/tests/${testId}/questions/${questionId}/explanation`,
        { explanation: newExplanation },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          withCredentials: false,
        }
      );
      setMessage(res.data.message);
      setNewExplanation('');
      setVisibleExplanationForm(null);

      const refresh = await axios.get(`https://lumiprep10-production-e6da.up.railway.app/tests/${testId}/questions`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        withCredentials: false,
      });
      setQuestions(refresh.data.questions || refresh.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update explanation');
    }
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Questions for Test</h2>

      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
      {message && <div className="text-green-600 mb-4 text-center">{message}</div>}

      {questions.length === 0 ? (
        <p className="text-gray-500 text-center">No questions found.</p>
      ) : (
        <>
          <div className="space-y-8">
            {currentQuestions.map((q) => (
              <div key={q._id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-lg font-semibold text-gray-700">{q.questionText}</p>
                <ul className="list-disc ml-6 mt-2 text-gray-600">
                  {q.options.map((opt, idx) => (
                    <li
                      key={idx}
                      className={opt.isCorrect ? 'text-green-600 font-semibold' : ''}
                    >
                      {opt.text}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-sm">
                  {q.explanation ? (
                    <span className="text-green-600">Explanation: {q.explanation}</span>
                  ) : (
                    <span className="text-red-500">No explanation added</span>
                  )}
                </p>

                {visibleExplanationForm === q._id ? (
                  <div className="mt-3">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      rows="3"
                      placeholder="Enter explanation"
                      value={newExplanation}
                      onChange={(e) => setNewExplanation(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        className="bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] text-white px-5 py-2 rounded hover:opacity-90 transition"
                        onClick={() => handleAddExplanation(q._id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition"
                        onClick={() => setVisibleExplanationForm(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="mt-2 text-sm text-blue-600 underline hover:text-blue-800 transition"
                    onClick={() => {
                      setVisibleExplanationForm(q._id);
                      setNewExplanation(q.explanation || '');
                    }}
                  >
                    {q.explanation ? 'Edit Explanation' : 'Add Explanation'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {questions.length > questionsPerPage && (
            <div className="mt-10 flex justify-center items-center gap-6">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full border ${
                  currentPage === 1
                    ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                    : 'text-gray-600 border-gray-400 hover:text-black hover:border-black'
                }`}
              >
                &lt;
              </button>

              <span className="text-gray-700 font-medium text-lg">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full border ${
                  currentPage === totalPages
                    ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                    : 'text-gray-600 border-gray-400 hover:text-black hover:border-black'
                }`}
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explanation;

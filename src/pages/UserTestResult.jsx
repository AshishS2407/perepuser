import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebarLayout from '../components/AdminSidebarLayout';

const UserTestResults = ({ userId }) => {
  const [results, setResults] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios.get(`http://localhost:3000/tests/user/${userId}/results`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setResults(res.data))
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      });
  }, [userId, navigate]);

  const toggleRow = (index) => {
    setExpandedRows(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <AdminSidebarLayout>
      <div className="p-4 overflow-x-auto w-full">
        <h2 className="text-xl font-bold mb-4">Test Results</h2>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                                <th className="border px-2 py-2 whitespace-nowrap">Main Test Title</th>

                <th className="border px-2 py-2 whitespace-nowrap">Test Title</th>
                <th className="border px-2 py-2 whitespace-nowrap">Description</th>
                <th className="border px-2 py-2 whitespace-nowrap">Submitted At</th>
                <th className="border px-2 py-2 whitespace-nowrap">Total Qs</th>
                <th className="border px-2 py-2 whitespace-nowrap">Correct</th>
                <th className="border px-2 py-2 whitespace-nowrap">Score %</th>
                <th className="border px-2 py-2 whitespace-nowrap">Details</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, i) => (
                <React.Fragment key={result._id}>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="border px-2 py-2">
                      {Array.isArray(result.parentTests) && result.parentTests.length > 0
                        ? result.parentTests.map((p) => p.testTitle).join(', ')
                        : '—'}
                    </td>
                    <td className="border px-2 py-2">{result.testTitle}</td>
                    <td className="border px-2 py-2">{result.testDescription}</td>
                    <td className="border px-2 py-2 whitespace-nowrap">{new Date(result.submittedAt).toLocaleString()}</td>
                    <td className="border px-2 py-2 text-center">{result.totalQuestions}</td>
                    <td className="border px-2 py-2 text-center">{result.correctAnswers}</td>
                    <td className="border px-2 py-2 font-semibold text-center">{result.scorePercentage}%</td>
                    <td
                      className="border px-2 py-2 text-center text-blue-600 cursor-pointer underline"
                      onClick={() => toggleRow(i)}
                    >
                      {expandedRows[i] ? 'Hide' : 'View'}
                    </td>
                  </tr>
                  {expandedRows[i] && (
                    <tr>
                      <td colSpan="8" className="border px-2 py-2 bg-gray-50">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border border-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="border px-2 py-1">Question</th>
                                <th className="border px-2 py-1 text-center">Selected</th>
                                <th className="border px-2 py-1 text-center">Correct</th>
                                <th className="border px-2 py-1 text-center">Correct?</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.details.map((q) => (
                                <tr key={q.questionId}>
                                  <td className="border px-2 py-1">{q.questionText}</td>
                                  <td className="border px-2 py-1 text-center">{q.selectedOptionIndex ?? 'N/A'}</td>
                                  <td className="border px-2 py-1 text-center">{q.correctOptionIndex}</td>
                                  <td className={`border px-2 py-1 text-center font-bold ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    {q.isCorrect ? 'Yes' : 'No'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminSidebarLayout>
  );
};

export default UserTestResults;

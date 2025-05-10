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
      navigate("/"); // redirect to login if token not found
      return;
    }

    axios.get(`https://lumiprep10-production-e6da.up.railway.app/tests/user/${userId}/results`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setResults(res.data))
      .catch(err => {
        console.error(err);
        // Handle unauthorized access
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
    <>
    <AdminSidebarLayout>
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">User Test Results</h2>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Test Title</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Submitted At</th>
            <th className="border px-4 py-2">Total Qs</th>
            <th className="border px-4 py-2">Correct</th>
            <th className="border px-4 py-2">Score %</th>
            <th className="border px-4 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, i) => (
            <React.Fragment key={result._id}>
              <tr className="bg-white hover:bg-gray-50">
                <td className="border px-4 py-2">{result.testTitle}</td>
                <td className="border px-4 py-2">{result.testDescription}</td>
                <td className="border px-4 py-2">{new Date(result.submittedAt).toLocaleString()}</td>
                <td className="border px-4 py-2">{result.totalQuestions}</td>
                <td className="border px-4 py-2">{result.correctAnswers}</td>
                <td className="border px-4 py-2 font-semibold">{result.scorePercentage}%</td>
                <td className="border px-4 py-2 text-blue-600 cursor-pointer underline" onClick={() => toggleRow(i)}>
                  {expandedRows[i] ? 'Hide' : 'View'}
                </td>
              </tr>
              {expandedRows[i] && (
                <tr>
                  <td colSpan="7" className="border px-4 py-2 bg-gray-50">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-2 py-1">Question</th>
                          <th className="border px-2 py-1">Selected</th>
                          <th className="border px-2 py-1">Correct</th>
                          <th className="border px-2 py-1">Correct?</th>
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
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    </AdminSidebarLayout>
    </>

  );
};

export default UserTestResults;

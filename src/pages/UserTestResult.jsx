import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebarLayout from '../components/AdminSidebarLayout';

const UserTestResults = ({ userId }) => {
  const [results, setResults] = useState([]);
  const [mockResults, setMockResults] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedMockRows, setExpandedMockRows] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Fetch Test Results
    axios.get(`https://lumiprep10-production-e6da.up.railway.app/tests/user/${userId}/results`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setResults(res.data))
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      });

    // Fetch Mock Test Results
    axios.get(`https://lumiprep10-production-e6da.up.railway.app/mock/results/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMockResults(res.data))
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      });
  }, [userId, navigate]);

  const toggleRow = (type, index) => {
    if (type === 'test') {
      setExpandedRows(prev => ({ ...prev, [index]: !prev[index] }));
    } else {
      setExpandedMockRows(prev => ({ ...prev, [index]: !prev[index] }));
    }
  };

  const renderTable = (data, type) => (
    <div className="w-full overflow-x-auto mt-6">
      <h2 className="text-lg font-semibold mb-2">
        {type === 'test' ? 'Test Results' : 'Mock Test Results'}
      </h2>
      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            {type === 'test' && (
              <th className="border px-2 py-2 whitespace-nowrap">Main Test Title</th>
            )}
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
          {data.map((result, i) => (
            <React.Fragment key={result._id}>
              <tr className="bg-white hover:bg-gray-50">
                {type === 'test' && (
                  <td className="border px-2 py-2">
                    {Array.isArray(result.parentTests) && result.parentTests.length > 0
                      ? result.parentTests.map((p) => p.testTitle).join(', ')
                      : '—'}
                  </td>
                )}
                <td className="border px-2 py-2">{result.testName || result.testTitle}</td>
                <td className="border px-2 py-2">{result.testDescription}</td>
                <td className="border px-2 py-2 whitespace-nowrap">{new Date(result.submittedAt).toLocaleString()}</td>
                <td className="border px-2 py-2 text-center">{result.totalQuestions}</td>
                <td className="border px-2 py-2 text-center">{result.correctAnswers}</td>
                <td className="border px-2 py-2 font-semibold text-center">{result.scorePercentage}%</td>
                <td
                  className="border px-2 py-2 text-center text-blue-600 cursor-pointer underline"
                  onClick={() => toggleRow(type, i)}
                >
                  {(type === 'test' ? expandedRows[i] : expandedMockRows[i]) ? 'Hide' : 'View'}
                </td>
              </tr>
              {(type === 'test' ? expandedRows[i] : expandedMockRows[i]) && (
                <tr>
                  <td colSpan={type === 'test' ? 8 : 7} className="border px-2 py-2 bg-gray-50">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border border-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="border px-2 py-1">Question</th>
                            {type === 'mock' && (
                              <th className="border px-2 py-1 text-center">Subcategory</th>
                            )}

                            <th className="border px-2 py-1 text-center">Selected</th>
                            <th className="border px-2 py-1 text-center">Correct</th>
                            <th className="border px-2 py-1 text-center">Correct?</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.details.map((q) => (
                            <tr key={q.questionId}>
                              <td className="border px-2 py-1">{q.questionText}</td>
                              {type === 'mock' && (
                                <td className="border px-2 py-1 text-center">{q.subTestCategory || '—'}</td>
                              )}
                              <td className="border px-2 py-1 text-center">{q.selectedOptionText ?? 'N/A'}</td>
                              <td className="border px-2 py-1 text-center">{q.correctOptionText}</td>
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
  );


  return (
    <AdminSidebarLayout>
      <div className="p-4 overflow-x-auto w-full">
        {renderTable(results, 'test')}
        {renderTable(mockResults, 'mock')}
      </div>
    </AdminSidebarLayout>
  );
};

export default UserTestResults;

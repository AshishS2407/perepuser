import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddQuestion = () => {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage, setTestsPerPage] = useState(9); // Will adjust based on screen size
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // Mobile
        setTestsPerPage(3);
      } else if (window.innerWidth < 768) { // Small tablet
        setTestsPerPage(6);
      } else if (window.innerWidth < 1024) { // Large tablet
        setTestsPerPage(8);
      } else { // Desktop
        setTestsPerPage(9);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get('https://lumiprep10-production-e6da.up.railway.app/tests/sub-tests', {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          withCredentials: false,
        });
        setTests(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tests');
      }
    };
    fetchTests();
  }, [token]);

  const handleAddQuestion = (testId) => {
    navigate(`/add-question/${testId}`);
  };

  // Pagination logic
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = tests.slice(indexOfFirstTest, indexOfLastTest);
  const totalPages = Math.ceil(tests.length / testsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6 sm:mt-10 p-4 sm:p-6 bg-white rounded-lg shadow">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Select Test to Add Questions</h1>

      {error && <div className="text-red-600 mb-4 text-center text-sm sm:text-base">{error}</div>}

      {tests.length === 0 && !error && (
        <p className="text-gray-600 text-center text-sm sm:text-base">No tests available.</p>
      )}

      {/* Grid of test cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
        {currentTests.map((test) => (
          <div
            key={test._id}
            className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
          >
            <h3 className="font-semibold text-base sm:text-lg text-center line-clamp-2">{test.testTitle}</h3>
            <p className="text-xs sm:text-sm text-gray-600 text-center mt-1 line-clamp-1">Company: {test.companyName}</p>
            <button
              className="mt-3 sm:mt-4 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-white rounded bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300 w-full max-w-[180px]"
              onClick={() => handleAddQuestion(test._id)}
            >
              Add Question
            </button>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {tests.length > testsPerPage && (
        <div className="mt-6 sm:mt-8 flex justify-center items-center space-x-4 sm:space-x-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-2 sm:px-3 py-1 text-sm sm:text-base rounded transition duration-300 ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] text-white hover:opacity-90'
            }`}
          >
            &lt;
          </button>

          <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-2 sm:px-3 py-1 text-sm sm:text-base rounded transition duration-300 ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] text-white hover:opacity-90'
            }`}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default AddQuestion;
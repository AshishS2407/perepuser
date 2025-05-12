import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FetchTest = () => {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [testsPerPage, setTestsPerPage] = useState(4); // Will adjust based on screen size

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // Mobile
        setTestsPerPage(2);
      } else if (window.innerWidth < 768) { // Tablet
        setTestsPerPage(3);
      } else { // Desktop
        setTestsPerPage(4);
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
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }
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
  }, []);

  const handleUpdate = (testId) => {
    navigate(`/tests/update/${testId}`);
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

  // Function to handle direct page click
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get page numbers to display (with ellipsis for many pages)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftBound = Math.max(1, currentPage - 2);
      const rightBound = Math.min(totalPages, currentPage + 2);
      
      if (leftBound > 1) pageNumbers.push(1, '...');
      for (let i = leftBound; i <= rightBound; i++) {
        pageNumbers.push(i);
      }
      if (rightBound < totalPages) pageNumbers.push('...', totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-10 md:mt-20 bg-white shadow-lg rounded-xl p-4 md:p-8">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center"
      >
        All Tests
      </motion.h2>

      {error && <div className="text-red-600 mb-4 text-center text-sm sm:text-base">{error}</div>}

      {tests.length === 0 && !error ? (
        <p className="text-gray-600 text-center text-sm sm:text-base">No tests available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
            {currentTests.map((test) => (
              <motion.div
                key={test._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-lg shadow hover:shadow-md"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-center sm:text-left">{test.testTitle}</h3>
                <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">{test.companyName}</p>
                <p className="text-xs sm:text-sm text-gray-700 mt-1 line-clamp-2">{test.description}</p>
                <p className="text-xs sm:text-sm mt-2 text-blue-600 font-medium">Status: {test.status}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Valid Till: {test.validTill ? new Date(test.validTill).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">Duration: {test.duration} mins</p>

                <button
                  onClick={() => handleUpdate(test._id)}
                  className="mt-3 sm:mt-4 px-3 sm:px-4 py-1 sm:py-2 rounded text-white text-xs sm:text-sm bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300"
                >
                  Update
                </button>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Pagination Controls */}
          {tests.length > testsPerPage && (
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-gray-500">
                Showing {indexOfFirstTest + 1}-{Math.min(indexOfLastTest, tests.length)} of {tests.length} tests
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full border text-sm sm:text-base flex items-center
                    ${
                      currentPage === 1
                        ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                        : 'text-gray-600 border-gray-400 hover:text-black hover:border-black'
                    }`}
                >
                  &lt;
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
                  {getPageNumbers().map((number, index) => (
                    number === '...' ? (
                      <span key={index} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={index}
                        onClick={() => handlePageClick(number)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm sm:text-base
                          ${
                            currentPage === number
                              ? 'bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] text-white'
                              : 'border border-gray-300 text-gray-600 hover:border-gray-400'
                          }`}
                      >
                        {number}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full border text-sm sm:text-base flex items-center
                    ${
                      currentPage === totalPages
                        ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                        : 'text-gray-600 border-gray-400 hover:text-black hover:border-black'
                    }`}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FetchTest;
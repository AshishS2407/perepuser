import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebarLayout from "../components/AdminSidebarLayout";

const MainTestList = () => {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMainTests = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        return;
      }

      try {
        const response = await axios.get("https://lumiprep10-production-e6da.up.railway.app/tests/main-tests", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setTests(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch main tests");
      }
    };

    fetchMainTests();
  }, []);

  const handleAssignSubtest = (testId) => {
    navigate(`/assign-subtest/${testId}`);
  };

  return (
    <AdminSidebarLayout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-6 sm:mt-10">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center text-gray-800">
          Main Tests
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {tests.length === 0 && !error ? (
          <p className="text-gray-500 text-center">No main tests found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {tests.map((test) => (
              <div
                key={test._id}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition duration-300 bg-gray-50"
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">{test.testTitle}</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-1">{test.description}</p>

                <button
                  onClick={() => handleAssignSubtest(test._id)}
                  className="mt-4 w-30 py-2 bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 text-white rounded-md text-sm sm:text-base transition"
                >
                  Assign Subtest
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminSidebarLayout>
  );
};

export default MainTestList;

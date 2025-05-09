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
        const response = await axios.get("http://localhost:3000/tests/main-tests", {
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

    <>
    <AdminSidebarLayout>
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-center">Main Tests</h2>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {tests.length === 0 && !error ? (
        <p className="text-gray-500 text-center">No main tests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tests.map((test) => (
            <div key={test._id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-800">{test.testTitle}</h3>
              <p className="text-gray-600 mt-1">{test.description}</p>

              <button
                onClick={() => handleAssignSubtest(test._id)}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Assign Subtest
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </AdminSidebarLayout>
    </>

  );
};

export default MainTestList;

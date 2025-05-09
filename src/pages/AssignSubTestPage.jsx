import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AdminSidebarLayout from "../components/AdminSidebarLayout";

const AssignSubTestPage = () => {
  const { testId: mainTestId } = useParams();
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedSubTest, setSelectedSubTest] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUnassignedTests = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:3000/tests/sub-tests", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Filter out subtests that are already assigned to this mainTestId
        const filtered = res.data.filter(
          (test) =>
            !test.parentTestIds || !test.parentTestIds.includes(mainTestId)
        );

        setAvailableTests(filtered);
      } catch (err) {
        setError("Failed to fetch available subtests.");
      }
    };

    fetchUnassignedTests();
  }, [mainTestId]);

  const handleAssign = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "http://localhost:3000/tests/assign-sub-test",
        {
          subTestId: selectedSubTest,
          mainTestId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Subtest assigned successfully!");
      setError("");
      setSelectedSubTest("");

      // Refresh the available subtests after assignment
      const res = await axios.get("http://localhost:3000/tests/sub-tests", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const filtered = res.data.filter(
        (test) =>
          !test.parentTestIds || !test.parentTestIds.includes(mainTestId)
      );
      setAvailableTests(filtered);
    } catch (err) {
      setError(err.response?.data?.message || "Assignment failed.");
      setMessage("");
    }
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Assign Subtest</h2>

        {message && <div className="text-green-600 mb-4">{message}</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Select Subtest:</label>
          <select
            value={selectedSubTest}
            onChange={(e) => setSelectedSubTest(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">-- Select a subtest --</option>
            {availableTests.map((test) => (
              <option key={test._id} value={test._id}>
                {test.testTitle}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssign}
          disabled={!selectedSubTest}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Assign Subtest
        </button>
      </div>
    </AdminSidebarLayout>
  );
};

export default AssignSubTestPage;

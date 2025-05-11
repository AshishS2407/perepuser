import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebarLayout from "../components/AdminSidebarLayout";

const AssignSubTestToMain = () => {
  const [mainTests, setMainTests] = useState([]);
  const [subTests, setSubTests] = useState([]);
  const [mainTestId, setMainTestId] = useState("");
  const [subTestId, setSubTestId] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const [mainRes, subRes] = await Promise.all([
          axios.get("https://lumiprep10-production-e6da.up.railway.app/tests/main-tests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://lumiprep10-production-e6da.up.railway.app/tests/sub-tests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setMainTests(mainRes.data);
        setSubTests(subRes.data);
      } catch (err) {
        console.error("Error fetching tests", err);
        setError("Failed to load test data.");
      }
    };

    fetchTests();
  }, [token]);

  const handleAssign = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await axios.post(
        "https://lumiprep10-production-e6da.up.railway.app/tests/assign-subtest",
        { subTestId, mainTestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage(res.data.message || "Sub test assigned successfully!");
      setSubTestId("");
      setMainTestId("");
    } catch (err) {
      console.error("Error assigning sub test:", err);
      setError(err.response?.data?.message || "Failed to assign sub test.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
          Assign Sub Test to Main Test
        </h2>

        <form onSubmit={handleAssign} className="space-y-6">
          <div>
            <label htmlFor="subTest" className="block text-base sm:text-lg font-medium text-gray-700">
              Select Sub Test
            </label>
            <select
              id="subTest"
              value={subTestId}
              onChange={(e) => setSubTestId(e.target.value)}
              required
              className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
            >
              <option value="">-- Select Sub Test --</option>
              {subTests.map((test) => (
                <option key={test._id} value={test._id}>
                  {test.testTitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mainTest" className="block text-base sm:text-lg font-medium text-gray-700">
              Select Main Test
            </label>
            <select
              id="mainTest"
              value={mainTestId}
              onChange={(e) => setMainTestId(e.target.value)}
              required
              className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
            >
              <option value="">-- Select Main Test --</option>
              {mainTests.map((test) => (
                <option key={test._id} value={test._id}>
                  {test.testTitle}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300 text-white font-semibold rounded-md disabled:opacity-50 transition-all duration-200"
          >
            {loading ? "Assigning..." : "Assign Sub Test"}
          </button>
        </form>
      </div>
    </AdminSidebarLayout>
  );
};

export default AssignSubTestToMain;

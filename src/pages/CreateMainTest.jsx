import React, { useState } from "react";
import axios from "axios";
import AdminSidebarLayout from "../components/AdminSidebarLayout";

const CreateMainTest = () => {
  const [testTitle, setTestTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await axios.post(
        "https://lumiprep10-production-e6da.up.railway.app/tests/main",
        { testTitle, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage(res.data.message || "Main test created successfully!");
      setTestTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating test:", err);
      if (err.response) {
        setError(err.response.data.message || "Error creating test");
      } else if (err.request) {
        setError("No response received from the server");
      } else {
        setError("Error creating test");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">
          Create Main Test
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="testTitle" className="block text-base sm:text-lg font-medium text-gray-700">
              Test Title
            </label>
            <input
              type="text"
              id="testTitle"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              required
              className="w-full p-2 sm:p-3 mt-2 border border-gray-300 rounded-md text-sm sm:text-base"
              placeholder="Enter test title"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-base sm:text-lg font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="5"
              className="w-full p-2 sm:p-3 mt-2 border border-gray-300 rounded-md text-sm sm:text-base"
              placeholder="Enter test description"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 sm:py-3 bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300 text-white font-semibold rounded-md disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? "Creating..." : "Create Test"}
          </button>
        </form>
      </div>
    </AdminSidebarLayout>
  );
};

export default CreateMainTest;

import React, { useState } from "react";
import axios from "axios";
import AdminSidebarLayout from "../components/AdminSidebarLayout"; // Ensure the path is correct

const CreateMainTest = () => {
  const [testTitle, setTestTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Get the token from localStorage (or wherever you're storing it)
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages on new submit
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await axios.post(
        "http://localhost:3000/tests/main", // Ensure this is the correct endpoint
        { testTitle, description },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is being sent
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Main test created successfully!");
      setTestTitle("");
      setDescription("");
    } catch (err) {
      // Log the error to the console for debugging
      console.error("Error creating test:", err);

      if (err.response) {
        console.error("Error response:", err.response);
        setError(err.response.data.message || "Error creating test");
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response received from the server");
      } else {
        console.error("Error message:", err.message);
        setError("Error creating test");
      }
    }
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Create Main Test</h2>

        {/* Form for creating main test */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="testTitle" className="block text-lg font-medium text-gray-700">
              Test Title
            </label>
            <input
              type="text"
              id="testTitle"
              name="testTitle"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter test title"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-lg font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="5"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter test description"
            />
          </div>

          {/* Error and success messages */}
          {error && (
            <div className="text-red-500 text-sm mb-4">
              <strong>{error}</strong>
            </div>
          )}
          {successMessage && (
            <div className="text-green-500 text-sm mb-4">
              <strong>{successMessage}</strong>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#a14bf4] text-white font-semibold rounded-md hover:bg-[#9a42d7]"
          >
            Create Test
          </button>
        </form>
      </div>
    </AdminSidebarLayout>
  );
};

export default CreateMainTest;

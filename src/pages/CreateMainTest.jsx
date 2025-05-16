import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebarLayout from "../components/AdminSidebarLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // ✅ Import CSS

const CreateMainTest = () => {
  const [testTitle, setTestTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tests, setTests] = useState([]);
  const [editingTestId, setEditingTestId] = useState(null);

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchTests = async () => {
    try {
      const res = await axios.get("https://lumiprep10-production-e6da.up.railway.app/tests/main-tests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(res.data || []);
    } catch (err) {
      console.error("Error fetching tests:", err);
      toast.error("Failed to fetch tests"); // ✅ Show error toast if fetch fails
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (editingTestId) {
        await axios.put(
          `https://lumiprep10-production-e6da.up.railway.app/tests/main/${editingTestId}`,
          { testTitle, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Test updated successfully");
        setEditingTestId(null);
      } else {
        await axios.post(
          "https://lumiprep10-production-e6da.up.railway.app/tests/main",
          { testTitle, description },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Test created successfully!");
      }

      setTestTitle("");
      setDescription("");
      fetchTests();
    } catch (err) {
      console.error("Error submitting test:", err);
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (test) => {
    navigate(`/edit-main-test/${test._id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      try {
        await axios.delete(`https://lumiprep10-production-e6da.up.railway.app/tests/main/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Test deleted successfully");
        fetchTests();
      } catch (err) {
        console.error("Error deleting test:", err);
        toast.error("Failed to delete test");
      }
    }
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">
          {editingTestId ? "Edit Main Test" : "Create Main Test"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="testTitle" className="block text-base font-medium text-gray-700">
              Test Title
            </label>
            <input
              type="text"
              id="testTitle"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              required
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter test title"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-base font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="5"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter test description"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300 text-white font-semibold rounded-md disabled:opacity-50"
          >
            {loading ? (editingTestId ? "Updating..." : "Creating...") : editingTestId ? "Update Test" : "Create Test"}
          </button>
        </form>
      </div>

      <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Main Tests</h3>
        {tests.length === 0 ? (
          <p className="text-gray-500">No main tests available.</p>
        ) : (
          <ul className="space-y-4">
            {tests.map((test) => (
              <li key={test._id} className="border p-4 rounded-md">
                <h4 className="text-lg font-semibold text-gray-800">{test.testTitle}</h4>
                <p className="text-gray-600 mb-2">{test.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(test)}
                    className="px-4 py-1 bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(test._id)}
                    className="px-4 py-1 bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition duration-300 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ Toast container */}
    </AdminSidebarLayout>
  );
};

export default CreateMainTest;

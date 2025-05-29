import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebarLayout from "../components/AdminSidebarLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MockTestManager = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tests, setTests] = useState([]);
  const [editingTestId, setEditingTestId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchTests = async () => {
    try {
      const res = await axios.get("https://lumiprep10-production-e6da.up.railway.app/mock/get-mocks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch mock tests");
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingTestId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error("Name and description are required");
      return;
    }

    setLoading(true);
    try {
      if (editingTestId) {
        await axios.put(
          `https://lumiprep10-production-e6da.up.railway.app/mock/${editingTestId}`,
          { name, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Mock test updated successfully");
      } else {
        await axios.post(
          "https://lumiprep10-production-e6da.up.railway.app/mock/create-mocktest",
          { name, description },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Mock test created successfully");
      }
      resetForm();
      fetchTests();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (test) => {
  navigate(`/admin/mocktests/${test._id}/edit`);
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mock test?")) return;
    try {
      await axios.delete(`https://lumiprep10-production-e6da.up.railway.applumiprep10-production-e6da.up.railway.app/mock/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Mock test deleted successfully");
      if (editingTestId === id) resetForm();
      fetchTests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete mock test");
    }
  };

  const handleAddQuestion = (testId) => {
    navigate(`/admin/mocktests/${testId}/add-question`);
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {editingTestId ? "Edit Mock Test" : "Create Mock Test"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-base font-medium text-gray-700">
              Test Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter test name"
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
              rows="4"
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
          {editingTestId && (
            <button
              type="button"
              onClick={resetForm}
              className="mt-3 w-full py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Mock Tests</h3>
        {tests.length === 0 ? (
          <p className="text-gray-500">No mock tests available.</p>
        ) : (
          <ul className="space-y-4">
            {tests.map((test) => (
              <li key={test._id} className="border p-4 rounded-md">
                <h4 className="text-lg font-semibold text-gray-800">{test.name}</h4>
                <p className="text-gray-600 mb-2">{test.description}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(test)}
                    className="px-4 py-1 bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300 text-white rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(test._id)}
                    className="px-4 py-1 bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition duration-300 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleAddQuestion(test._id)}
                    className="px-4 py-1 bg-gradient-to-r from-green-500 to-green-700 hover:opacity-90 transition duration-300 text-white rounded text-sm"
                  >
                    Add Question
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </AdminSidebarLayout>
  );
};

export default MockTestManager;

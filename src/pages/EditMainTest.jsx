import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebarLayout from "../components/AdminSidebarLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditMainTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testTitle, setTestTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get("https://lumiprep10-production-e6da.up.railway.app/tests/main-tests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const test = res.data.find((t) => t._id === id);
        if (!test) {
          toast.error("Test not found");
          return;
        }
        setTestTitle(test.testTitle);
        setDescription(test.description);
      } catch (err) {
        toast.error("Failed to load test");
        console.error(err);
      }
    };

    fetchTest();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `https://lumiprep10-production-e6da.up.railway.app/tests/main/${id}`,
        { testTitle, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Test updated successfully!");
      setTimeout(() => navigate("/admin/create-main-test"), 2000);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Main Test</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-base font-medium text-gray-700">Test Title</label>
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              required
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-base font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="5"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] text-white font-semibold rounded-md disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Test"}
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </AdminSidebarLayout>
  );
};

export default EditMainTest;

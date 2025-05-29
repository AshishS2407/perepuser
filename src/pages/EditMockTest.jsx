import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import AdminSidebarLayout from "../components/AdminSidebarLayout";

const EditMockTest = () => {
  const { testId } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`https://lumiprep10-production-e6da.up.railway.app/mock/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name);
        setDescription(res.data.description);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load mock test");
      }
    };
    fetchTest();
  }, [testId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `https://lumiprep10-production-e6da.up.railway.app/mock/${testId}`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Mock test updated successfully");
      navigate("/create-mock");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update mock test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Edit Mock Test
        </h2>
        <form onSubmit={handleUpdate}>
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
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300 text-white font-semibold rounded-md disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Test"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </AdminSidebarLayout>
  );
};

export default EditMockTest;

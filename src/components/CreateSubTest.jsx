import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebarLayout from "../components/AdminSidebarLayout";

const CreateSubTestPage = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    testTitle: "",
    description: "",
    validTill: "",
    duration: "",
    parentTestIds: [],
  });

  const [mainTests, setMainTests] = useState([]);
  const [subTests, setSubTests] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const mainRes = await axios.get("https://lumiprep10-production-e6da.up.railway.app/tests/main-tests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMainTests(mainRes.data);

      const subRes = await axios.get("https://lumiprep10-production-e6da.up.railway.app/tests/sub-tests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubTests(subRes.data);
    } catch (err) {
      toast.error("Error fetching tests.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (id) => {
    setFormData((prev) => {
      const newIds = prev.parentTestIds.includes(id)
        ? prev.parentTestIds.filter((item) => item !== id)
        : [...prev.parentTestIds, id];
      return { ...prev, parentTestIds: newIds };
    });
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({
      ...prev,
      parentTestIds: selectedOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode) {
        await axios.put(`https://lumiprep10-production-e6da.up.railway.app/tests/sub/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Sub test updated successfully!");
      } else {
        await axios.post("https://lumiprep10-production-e6da.up.railway.app/tests/sub", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Sub test created successfully!");
      }

      setFormData({
        companyName: "",
        testTitle: "",
        description: "",
        validTill: "",
        duration: "",
        parentTestIds: [],
      });
      setEditMode(false);
      setEditId(null);
      fetchTests();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this sub test?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://lumiprep10-production-e6da.up.railway.app/tests/sub/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully!");
      fetchTests();
    } catch {
      toast.error("Error deleting sub test.");
    }
  };

  const handleEdit = (test) => {
    setFormData({
      companyName: test.companyName,
      testTitle: test.testTitle,
      description: test.description,
      validTill: test.validTill?.substring(0, 10),
      duration: test.duration,
      parentTestIds: test.parentTestIds || [],
    });
    setEditId(test._id);
    setEditMode(true);
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center sm:text-left">
          {editMode ? "Edit Sub Test" : "Create Sub Test"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-base font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700">Test Title</label>
            <input
              type="text"
              name="testTitle"
              value={formData.testTitle}
              onChange={handleChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700">Valid Till</label>
            <input
              type="date"
              name="validTill"
              value={formData.validTill}
              onChange={handleChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">Parent Main Tests</label>
            
            {/* Mobile view - select dropdown */}
            <div className="sm:hidden">
              <select
                multiple
                onChange={handleSelectChange}
                className="w-full border px-3 py-2 rounded h-32"
                value={formData.parentTestIds}
              >
                {mainTests.map((test) => (
                  <option key={test._id} value={test._id}>
                    {test.testTitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop view - checkboxes */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {mainTests.map((test) => (
                <label key={test._id} className="flex items-center space-x-2 border p-2 rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    value={test._id}
                    checked={formData.parentTestIds.includes(test._id)}
                    onChange={() => handleCheckboxChange(test._id)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm">{test.testTitle}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300 text-white font-semibold rounded-md disabled:opacity-50"
          >
            {loading ? (editMode ? "Updating..." : "Creating...") : editMode ? "Update Test" : "Create Test"}
          </button>
        </form>
      </div>

      <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Sub Tests</h3>
        {subTests.length === 0 ? (
          <p className="text-gray-500">No sub tests available.</p>
        ) : (
          <ul className="space-y-4">
            {subTests.map((test) => (
              <li key={test._id} className="border p-4 rounded-md">
                <h4 className="text-lg font-semibold text-gray-800">{test.testTitle}</h4>
                <p className="text-gray-600 mb-1">Company: {test.companyName}</p>
                <p className="text-gray-600 mb-1">Duration: {test.duration} minutes</p>
                <p className="text-gray-600 mb-2">Valid Till: {test.validTill?.substring(0, 10) || "N/A"}</p>
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

      <ToastContainer position="top-right" autoClose={3000} />
    </AdminSidebarLayout>
  );
};

export default CreateSubTestPage;
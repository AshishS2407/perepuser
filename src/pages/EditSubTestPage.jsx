



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebarLayout from '../components/AdminSidebarLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditSubTestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    testTitle: '',
    description: '',
    validTill: '',
    duration: '',
    parentTestIds: [],
  });
  const [mainTests, setMainTests] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTest();
    fetchMainTests();
  }, []);

  const fetchMainTests = async () => {
    try {
      const res = await axios.get('https://lumiprep10-production-e6da.up.railway.app/tests/main-tests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMainTests(res.data);
    } catch (error) {
      toast.error("Error fetching main tests");
    }
  };

  const fetchTest = async () => {
    try {
      const res = await axios.get(`https://lumiprep10-production-e6da.up.railway.app/tests/sub-tests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allTests = res.data;
      const test = allTests.find((t) => t._id === id);
      if (!test) {
        toast.error("Sub test not found");
        return;
      }
      setFormData({
        companyName: test.companyName,
        testTitle: test.testTitle,
        description: test.description,
        validTill: test.validTill?.substring(0, 10),
        duration: test.duration,
        parentTestIds: test.parentTestIds || [],
      });
    } catch (err) {
      toast.error("Failed to load sub test");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({
      ...prev,
      parentTestIds: selectedOptions,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://lumiprep10-production-e6da.up.railway.app/tests/sub/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Sub test updated successfully!");
      setTimeout(() => navigate('/admin/create-test'), 2000);
    } catch (err) {
      toast.error("Error updating sub test");
    }
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Sub Test</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="testTitle"
            placeholder="Test Title"
            value={formData.testTitle}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="date"
            name="validTill"
            value={formData.validTill}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1">Select Parent Main Tests:</label>
            <div className="hidden sm:grid grid-cols-2 gap-2">
              {mainTests.map((test) => (
                <label key={test._id} className="flex items-center space-x-2 border p-2 rounded">
                  <input
                    type="checkbox"
                    value={test._id}
                    checked={formData.parentTestIds.includes(test._id)}
                    onChange={() => handleCheckboxChange(test._id)}
                  />
                  <span>{test.testTitle}</span>
                </label>
              ))}
            </div>
            <div className="sm:hidden">
              <select
                multiple
                value={formData.parentTestIds}
                onChange={handleSelectChange}
                className="w-full border px-3 py-2 rounded h-32"
              >
                {mainTests.map((test) => (
                  <option key={test._id} value={test._id}>
                    {test.testTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] hover:opacity-90 transition duration-300 text-white px-4 py-2 rounded hover:bg-blue-700 w-full "
          >
            Update Test
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminSidebarLayout>
  );
};

export default EditSubTestPage;

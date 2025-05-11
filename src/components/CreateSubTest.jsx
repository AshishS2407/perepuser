import React, { useState, useEffect } from "react";
import axios from 'axios';

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
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMainTests = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("https://lumiprep10-production-e6da.up.railway.app/tests/main-tests", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          withCredentials: false,
        });

        setMainTests(res.data);
      } catch (err) {
        setMessage("Error fetching main tests");
      }
    };

    fetchMainTests();
  }, []);

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
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in as an admin.");
      return;
    }

    try {
      const response = await fetch("https://lumiprep10-production-e6da.up.railway.app/tests/sub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create sub test.");
      } else {
        setMessage("Sub test created successfully!");
        setFormData({
          companyName: "",
          testTitle: "",
          description: "",
          validTill: "",
          duration: "",
          parentTestIds: [],
        });
      }
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 sm:p-6 md:p-10 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Create Sub Test</h1>
      {message && <div className="mb-4 text-sm text-red-600">{message}</div>}
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
          placeholder="Duration (in minutes)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <div>
          <label className="block text-sm font-medium mb-1">Select Parent Main Tests:</label>

          {/* Mobile: native multi-select */}
          <div className="sm:hidden">
            <select
              multiple
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

          {/* Desktop: checkbox-style list */}
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
        >
          Create Sub Test
        </button>
      </form>
    </div>
  );
};

export default CreateSubTestPage;

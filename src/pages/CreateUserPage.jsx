import React, { useState } from "react";
import axios from "axios";
import AdminSidebarLayout from "../components/AdminSidebarLayout";

const CreateUserPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [messageData, setMessageData] = useState(null);
  const token = localStorage.getItem("token"); // Get token from localStorage

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/create-user",
        { name, password},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the header
            "Content-Type": "application/json",
          },
        }
      );
      setMessageData(res.data);
      setName("");
      setPassword("");
    } catch (error) {
      setMessageData({
        error: error.response?.data?.message || "Failed to create user",
      });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AdminSidebarLayout>
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Create New User</h2>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#a14bf4] text-white py-2 rounded hover:bg-[#8e3de3]"
          >
            Create User
          </button>
        </form>

        {messageData && (
          <div className="mt-6 bg-gray-50 p-4 rounded border">
            {messageData.error ? (
              <p className="text-red-600 text-center">{messageData.error}</p>
            ) : (
              <>
                <p className="text-green-600 font-semibold text-center mb-2">
                  User Created Successfully
                </p>
                <div className="space-y-2">
                  {["lumiId", "name", "password"].map((field) => (
                    <div
                      key={field}
                      className="flex items-center justify-between border px-3 py-2 rounded"
                    >
                      <span className="font-medium capitalize">{field}: </span>
                      <span className="text-gray-700 font-mono truncate">
                        {messageData[field]}
                      </span>
                      <button
                        onClick={() => handleCopy(messageData[field])}
                        className="text-sm text-blue-600 hover:underline ml-2"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </AdminSidebarLayout>
  );
};

export default CreateUserPage;

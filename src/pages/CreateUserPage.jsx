import React, { useState } from "react";
import axios from "axios";
import AdminSidebarLayout from "../components/AdminSidebarLayout";

const CreateUserPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [lumiId, setLumiId] = useState("");
  const [messageData, setMessageData] = useState(null);
  const token = localStorage.getItem("token");

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://lumiprep10-production-e6da.up.railway.app/auth/create-user",
        { name, password, lumiId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessageData(res.data);
      setName("");
      setPassword("");
      setLumiId("");
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
      <div className="max-w-xl w-full mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl sm:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create New User</h2>
        <form onSubmit={handleCreateUser} className="space-y-5">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#a14bf4]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#a14bf4]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Lumi ID (e.g., KN2024ABCD)"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#a14bf4]"
            value={lumiId}
            onChange={(e) => setLumiId(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] text-white py-2 rounded-md hover:opacity-90 transition duration-300"
          >
            Create User
          </button>
        </form>

        {messageData && (
          <div className="mt-8 bg-gray-50 p-4 rounded border border-gray-200">
            {messageData.error ? (
              <p className="text-red-600 text-center font-medium">{messageData.error}</p>
            ) : (
              <>
                <p className="text-green-600 font-semibold text-center mb-3">
                  User Created Successfully
                </p>
                <div className="space-y-3">
                  {["lumiId", "name", "password"].map((field) => (
                    <div
                      key={field}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border px-4 py-2 rounded bg-white shadow-sm"
                    >
                      <span className="font-medium capitalize">{field}:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-mono truncate max-w-xs">{messageData[field]}</span>
                        <button
                          onClick={() => handleCopy(messageData[field])}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Copy
                        </button>
                      </div>
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebarLayout from "../components/AdminSidebarLayout";

const CreateAdminPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // default role
  const [messageData, setMessageData] = useState(null);
  const [userRole, setUserRole] = useState(null); // To hold the current user's role
  const token = localStorage.getItem("token");

  // Check the current user's role on page load
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await axios.get("http://localhost:3000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserRole(res.data.role); // Store the current user's role
      } catch (error) {
        console.error("Error fetching user role", error);
      }
    };

    if (token) {
      fetchUserRole();
    }
  }, [token]);

  // Handle form submission
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      // Make the POST request to the backend
      const res = await axios.post(
        "https://lumiprep10-production-e6da.up.railway.app/auth/create-admin", // Update with the correct backend URL
        { email, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessageData(res.data); // Set response data for success
      setEmail("");
      setPassword("");
      setRole("admin");
    } catch (error) {
      setMessageData({
        error: error.response?.data?.message || "Failed to create user",
      });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Restrict form submission if the user is a mentor
  if (userRole === "mentor") {
    return (
      <AdminSidebarLayout>
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
          <p className="text-center text-red-600">You do not have permission to create new admins.</p>
        </div>
      </AdminSidebarLayout>
    );
  }

  return (
    <AdminSidebarLayout>
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Create New Admin</h2>
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
            <option value="mentor">Mentor</option>
          </select>
          <button
            type="submit"
            className="w-full bg-[#a14bf4] text-white py-2 rounded hover:bg-[#8e3de3]"
          >
            Create Admin
          </button>
        </form>

        {messageData && (
          <div className="mt-6 bg-gray-50 p-4 rounded border">
            {messageData.error ? (
              <p className="text-red-600 text-center">{messageData.error}</p>
            ) : (
              <>
                <p className="text-green-600 font-semibold text-center mb-2">
                  {role.charAt(0).toUpperCase() + role.slice(1)} Created Successfully
                </p>
                <div className="space-y-2">
                  {["email", "role"].map((field) => (
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

export default CreateAdminPage;

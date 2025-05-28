import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebarLayout from "../components/AdminSidebarLayout";

const CreateAdminPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [messageData, setMessageData] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await axios.get("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(res.data.role);
      } catch (error) {
        console.error("Error fetching user role", error);
      }
    };

    if (token) fetchUserRole();
  }, [token]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/create-admin",
        { name, email, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessageData(res.data);
      setName("");
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

  if (userRole === "mentor") {
    return (
      <AdminSidebarLayout>
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 my-6 sm:my-10">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Access Denied</h2>
          <p className="text-center text-red-600">You do not have permission to create new admins.</p>
        </div>
      </AdminSidebarLayout>
    );
  }

  return (
    <AdminSidebarLayout>
      <div className="w-full max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 my-6 sm:my-10">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Create New Admin</h2>

        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm sm:text-base"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm sm:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm sm:text-base"
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
            className="w-full bg-gradient-to-r from-[#B23DEB] to-[#DE8FFF] text-white px-4 py-3 rounded-md hover:opacity-90 transition duration-300 text-sm sm:text-base"
          >
            Create Admin
          </button>
        </form>

        {messageData && (
          <div className="mt-6 bg-gray-50 p-4 rounded border text-sm sm:text-base">
            {messageData.error ? (
              <p className="text-red-600 text-center">{messageData.error}</p>
            ) : (
              <>
                <p className="text-green-600 font-semibold text-center mb-2">
                  {role.charAt(0).toUpperCase() + role.slice(1)} Created Successfully
                </p>
                <div className="space-y-2">
                  {["name", "email", "role"].map((field) => (
                    <div
                      key={field}
                      className="flex items-center justify-between border px-3 py-2 rounded flex-wrap sm:flex-nowrap"
                    >
                      <span className="font-medium capitalize w-full sm:w-auto">{field}:</span>
                      <span className="text-gray-700 font-mono break-all w-full sm:w-auto">
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

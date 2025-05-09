import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import AdminSidebarLayout from '../components/AdminSidebarLayout';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://lumiprep10-production-e6da.up.railway.app/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: false, // Optional unless you're managing cookies

        });
        setUsers(response.data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'users_list.xlsx');
  };

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <>
    <AdminSidebarLayout>
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User List</h1>
        <button
          onClick={exportToExcel}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Export to Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Sl No.</th>
              <th className="py-2 px-4 border">LUMI ID</th>
              <th className="py-2 px-4 border">Name</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.lumiId} className="hover:bg-gray-50">
                <td className="py-2 px-4 border text-center">{index + 1}</td>
                <td className="py-2 px-4 border text-center">{user.lumiId}</td>
                <td className="py-2 px-4 border">{user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </AdminSidebarLayout>
    </>

  );
};

export default UserListPage;
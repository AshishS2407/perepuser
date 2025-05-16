import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import AdminSidebarLayout from '../components/AdminSidebarLayout';

const AdminListPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://lumiprep10-production-e6da.up.railway.app/auth/admins', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setAdmins(response.data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(admins);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admins");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'admin_list.xlsx');
  };

  return (
    <AdminSidebarLayout>
      <div className="w-full px-2 sm:px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold">Admin/Mentor/Superadmin List</h1>
          <button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm sm:text-base"
          >
            Export to Excel
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white border text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-2 sm:px-4 border text-center">Sl No.</th>
                  <th className="py-2 px-2 sm:px-4 border text-left">Name</th>
                  <th className="py-2 px-2 sm:px-4 border text-center">Role</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="py-2 px-2 sm:px-4 border text-center">{index + 1}</td>
                    <td className="py-2 px-2 sm:px-4 border">{admin.name}</td>
                    <td className="py-2 px-2 sm:px-4 border text-center capitalize">
                      {admin.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminSidebarLayout>
  );
};

export default AdminListPage;

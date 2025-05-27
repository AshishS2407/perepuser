import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AdminSidebarLayout from '../components/AdminSidebarLayout';

const cardData = [
  {
    title: 'Create Main Test',
    description: 'Setup foundational tests that can include multiple sub-tests.',
    border: 'border-yellow-500',
    to: '/admin/create-main-test',
  },
  {
    title: 'Create Test',
    description: 'Design and publish structured assessments based on topic and level.',
    border: 'border-purple-500',
    to: '/admin/create-test',
  },
  {
    title: 'Add Questions',
    description: 'Build diverse question banks with options and correct answers.',
    border: 'border-blue-500',
    to: '/admin/add-questions',
  },
  {
    title: 'Add Explanations',
    description: 'Clarify answers with detailed explanations for better learning.',
    border: 'border-emerald-500',
    to: '/admin/add-explanations',
  },
  {
    title: 'Manage Tests',
    description: 'View, update, and maintain your test repository efficiently.',
    border: 'border-pink-500',
    to: '/admin/update-test',
  },
  
  {
    title: 'Create User',
    description: 'Add a new user account and assign test access.',
    border: 'border-indigo-500',
    to: '/admin/create-user',
  },
  {
    title: 'User List',
    description: 'Browse and manage registered user details and status.',
    border: 'border-red-400',
    to: '/userlist',
  },
  {
    title: 'Admin List',
    description: 'Manage all admin users with roles and permissions.',
    border: 'border-gray-400',
    to: '/adminlist',
  },
  {
    title: 'Create Admin',
    description: 'Onboard new admin with access to the dashboard.',
    border: 'border-teal-500',
    to: '/create-admin',
  },
];

const AdminDashBoard = () => {
  return (
    <AdminSidebarLayout>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-semibold text-gray-800 mb-4"
      >
        Admin Dashboard
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-gray-600 mb-10"
      >
        All essential tools for test creation, monitoring, and system administration in one place.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {cardData.map((card, index) => (
          <Link to={card.to} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`p-6 bg-white rounded-2xl border-l-4 ${card.border} shadow hover:shadow-xl transition duration-300 cursor-pointer`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {card.title}
              </h2>
              <p className="text-gray-600">{card.description}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </AdminSidebarLayout>
  );
};

export default AdminDashBoard;

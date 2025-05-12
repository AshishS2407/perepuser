import React from 'react';
import { motion } from 'framer-motion';
import AdminSidebarLayout from '../components/AdminSidebarLayout';
import UpdateTest from '../components/UpdateTest';

const UpdateTestPage = () => {
  return (
    <AdminSidebarLayout>
  <div className="flex items-center justify-center p-4 sm:p-6 md:p-10 min-h-screen">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10"
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8"
      >
        Update Test
      </motion.h1>

      <UpdateTest />
    </motion.div>
  </div>
</AdminSidebarLayout>

  );
};

export default UpdateTestPage;

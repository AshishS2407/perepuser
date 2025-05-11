import React from 'react';
import { motion } from 'framer-motion';
import AdminSidebarLayout from '../components/AdminSidebarLayout';
import AddQuestionForm from '../components/AddQuestionForm';

const AddQuestionFormPage = () => {
  return (
    <AdminSidebarLayout>
     

          <AddQuestionForm />
    </AdminSidebarLayout>
  );
};

export default AddQuestionFormPage;

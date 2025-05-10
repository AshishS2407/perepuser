import React from 'react';
import { useParams } from 'react-router-dom';
import UserTestResults from './UserTestResult';

const UserTestResultsPage = () => {
  const { userId } = useParams();

  return (
      <UserTestResults userId={userId} />
  );
};

export default UserTestResultsPage;

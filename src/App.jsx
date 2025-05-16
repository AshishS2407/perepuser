// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashBoard";
import UpdateTestPage from "./pages/UpdateTestPage";
import FetchTestPage from "./pages/FetchTestPage";
import AddQuestionPage from "./pages/AddQuestionPage";
import AddExplanationPage from "./pages/AddExplanationPage";
import ExplanationPage from "./pages/ExplanationPage";
import AddQuestionFormPage from "./pages/AddQuestionFormPage";
import CreateUserPage from "./pages/CreateUserPage";
import CreateMainTest from "./pages/CreateMainTest";
import MainTestList from "./pages/MainTestList";
import AssignSubTestPage from "./pages/AssignSubTestPage";
import UserListPage from "./pages/UserListPage";
import CreateAdminPage from "./pages/CreateAdminPage";
import UserTestResultsPage from "./pages/UserTestResultsPage";
import CreateSubTestPage from "./pages/CreateSubTestPage";
import EditMainTest from "./pages/EditMainTest";
import EditSubTestPage from "./pages/EditSubTestPage";
import EditQuestionForm from "./pages/EditQuestionForm";
import AdminListPage from "./pages/AdminListPage";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/tests/update/:testId" element={<UpdateTestPage />} />
        <Route path="/admin/create-test" element={<CreateSubTestPage />} />
        <Route path="/admin/update-test" element={<FetchTestPage/>} />
        <Route path="/admin/add-explanations" element={<AddExplanationPage/>} />
        <Route path="/admin/add-questions" element={<AddQuestionPage/>} />
        <Route path="/explanation/:testId" element={<ExplanationPage />} />
        <Route path="/add-question/:id" element={<AddQuestionFormPage />} />
        <Route path="/admin/create-user" element={<CreateUserPage />} />
        <Route path="/admin/create-main-test" element={<CreateMainTest />} />
        <Route path="/admin/main-test-list" element={<MainTestList />} />
        <Route path="/assign-subtest/:testId" element={<AssignSubTestPage />} />
        <Route path="/userlist" element={<UserListPage />} />
        <Route path="/create-admin" element={<CreateAdminPage />} />
        <Route path="/users/:userId/results" element={<UserTestResultsPage />} />
        <Route path="/edit-main-test/:id" element={<EditMainTest/>} /> 
        <Route path="/admin/edit-sub-test/:id" element={<EditSubTestPage/>} />
        <Route path="/tests/:testId/questions/:questionId/edit" element={<EditQuestionForm />} />
        <Route path="/adminlist" element={<AdminListPage />} />

      </Routes>
    </Router>
  );
}

export default App;

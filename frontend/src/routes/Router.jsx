import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ContentPage from '../pages/ContentPage';
import ContactPage from '../pages/ContactPage';
import ExamplesPage from '../pages/ExamplesPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

import ProtectedRoute from '../components/routes/ProtectedRoute';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/inhalte/links" element={<ContentPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/quiz" element={<h2>Quiz</h2>} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/examples" element={<ExamplesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;

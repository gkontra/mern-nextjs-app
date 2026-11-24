import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ContactPage from '../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';
import ExamplesPage from '../pages/ExamplesPage';
import LoginPage from '../pages/LoginPage';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/examples" element={<ExamplesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;

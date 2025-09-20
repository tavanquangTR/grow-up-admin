
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import HomeContent from './components/contents/HomeContent';
import UserManagement from './components/UserManagement';
import WorkshopManagement from './components/WorkshopManagement';
import SkillManagement from './components/SkillManagement';
import Errorpage from './utils/Errorpage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './router/ProtectedRoute';
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import React, { useContext, useState } from 'react';
import ThemeContext, { ThemeProvider } from './context/ThemeContext';
import './assets/styles/app.css';


const Root = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { defaultAlgorithm, darkAlgorithm } = theme;
  return (
    <ConfigProvider>
      <AntApp>
        <BrowserRouter>
          <Routes >
            <Route path='/login' element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<App />}>
                <Route index element={<HomeContent />} />
                <Route path='users' element={<UserManagement />} />
                <Route path='workshops' element={<WorkshopManagement />} />
                <Route path='skills' element={<SkillManagement />} />
              </Route>
            </Route>
            <Route path='*' element={<Errorpage />} />
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  )
}


const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* ThemeProviderで全体をラップする */}
    <ThemeProvider >
      <Root />
    </ThemeProvider>
  </React.StrictMode>
);

import React from 'react';
import { CartProvider } from 'react-use-cart';
import { Navigate, Route, Routes, HashRouter as Router } from 'react-router-dom';
import Header from './Header/Header';
import Main from './Main/Main';
import s from './App.module.scss';
import Admin from './Admin/Admin';
import { Layout } from './Layout/Layout';
import Login from './Login/Login';
import Register from './Registration/Register';
import { AuthProvider } from './context/AuthContext';

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className={s.container}>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Main />} />
                <Route path="admin" element={<Admin />} />
                <Route path="auth/login" element={<Login />} />
                <Route path="auth/register" element={<Register />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </div>
      </Router>
    </AuthProvider>
  );
};

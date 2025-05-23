import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from 'config';
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
import { Loader } from './comp/Loader/Loader';


export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [menuData, setMenuData] = useState([]);

useEffect(() => {
  const fetchMenuData = async () => {
    try {
      const response = await axios.get(`${config.baseURL}/api/products`);
      setMenuData(response.data);

      // Опціональна затримка перед вимкненням завантаження
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // або 1000 — за потреби
    } catch (error) {
      console.error('Error fetching menu data:', error);
      setIsLoading(false); // на випадок помилки
    }
  };

  fetchMenuData();
}, []);

// console.log(menuData)
  if (isLoading) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <Router>
       <Header />
        <div className={s.container}
        //  style={{ border: '2px solid red', background: 'rgba(255,0,0,0.1)', minHeight: '100vh' }}
         >
           
          <CartProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Main menuData={menuData} />} />
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

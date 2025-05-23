import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import s from './Header.module.scss';
import logo from './img/Logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import LogoutButton from 'components/comp/LogoutBtn/LogoutButton';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuth, setIsAuth, fullName, setFullName } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userId');
    setIsAuth(false);
    setFullName('');
    navigate('/'); // можеш змінити на "/auth/login" або інше
    setTimeout(() => {
        window.location.reload();
      }, 300);
  };
  const location = useLocation();
  const handleSignIn = () => {
    navigate('/auth/login');
  };
  const handleHome = () => {
    navigate('/');
  };
  const toggleDrawer = open => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
  <Box
    sx={{
      width: 250,
      backgroundColor: '#333',
      height: '100%',
      color: '#fff',
    }}
    role="presentation"
    onClick={toggleDrawer(false)}
    onKeyDown={toggleDrawer(false)}
  >
    <List>
      <ListItem
        button
        component="a"
        href="https://misteram.com.ua/chernigov/orangebar"
        target="_blank"
        rel="noreferrer"
      >
        <ListItemText primary="ДОСТАВКА" sx={{ color: '#fff' }} />
      </ListItem>
      <ListItem button component="a" href="tel:+380936900699">
        <ListItemText primary="+380936900699" sx={{ color: '#fff' }} />
      </ListItem>
      <ListItem
        button
        component="a"
        href="https://instagram.com/orangery.lounge?igshid=YmMyMTA2M2Y="
        target="_blank"
        rel="noreferrer"
      >
        <ListItemText primary="Instagram" sx={{ color: '#fff' }} />
      </ListItem>

      {/* Додаємо розділювач */}
      <hr style={{ borderColor: '#555', margin: '10px 0' }} />

      {/* Кнопки входу / виходу */}
      {isAuth ? (
        <ListItem button onClick={handleLogout}>
          <ListItemText primary={`Вийти (${fullName})`} sx={{ color: '#fff' }} />
        </ListItem>
      ) : (
        <ListItem button onClick={() => { navigate('/auth/login'); setDrawerOpen(false); }}>
          <ListItemText primary="Увійти" sx={{ color: '#fff' }} />
        </ListItem>
      )}
    </List>
  </Box>
);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: '#333', boxShadow: 'none', width: '100vw', }}
      >
        <Toolbar>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}>
            <Button
              color="inherit"
              href="https://misteram.com.ua/chernigov/orangery"
              target="_blank"
              rel="noreferrer"
            >
              ДОСТАВКА
            </Button>
            <Button color="inherit" href="tel:+380936900699">
              +380936900699
            </Button>
            <Button
              color="inherit"
              href="https://instagram.com/orangery.lounge?igshid=YmMyMTA2M2Y="
              target="_blank"
              rel="noreferrer"
              className={s.link}
            >
              <img src={require('./img/inst.png')} alt="" className={s.icon} />
            </Button>
          </Box>

          {/* Іконка меню для мобільних */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {isAuth ? (
            <div className={s.wellcome}>
              <p>{fullName}</p>
              <LogoutButton onLogout={handleLogout} className={s.logoutBtn}/>
            </div>
          ) : (
            location.pathname !== '/auth/login' &&
            location.pathname !== '/auth/register' && (
              <div className={s.center}>
                <button className={s.btn} onClick={handleSignIn}>
                  <svg viewBox="0 0 150 30" className={s.border}>
                    <polyline
                      points="149,1 149,29 1,29 1,1 149,1"
                      className={s.bgline}
                    />
                    <polyline
                      points="149,1 149,29 1,29 1,1 149,1"
                      className={s.hlline}
                    />
                  </svg>
                  <span>Увійти</span>
                </button>
              </div>
            )
          )}
          <img src={logo} alt="logo" className={s.logo} onClick={handleHome} />
        </Toolbar>
      </AppBar>

      {/* Drawer для мобільного меню */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#333', // Зміна кольору Drawer
            color: '#fff', // Білий текст
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header;

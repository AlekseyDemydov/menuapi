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
import logo from './img/Logo.png'

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = open => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box 
      sx={{ 
        width: 250, 
        backgroundColor: '#333', // Зміна кольору фону
        height: '100%', // Зайняти всю висоту
        color: '#fff', // Білий текст для контрасту
      }}
    >
      <List>
        <ListItem button component="a" href="https://misteram.com.ua/chernigov/orangebar" target="_blank" rel="noreferrer">
          <ListItemText primary="ДОСТАВКА" sx={{ color: '#fff' }} />
        </ListItem>
        <ListItem button component="a" href="tel:+380936900699">
          <ListItemText primary="+380936900699" sx={{ color: '#fff' }} />
        </ListItem>
        <ListItem button component="a" href="https://instagram.com/orangery.lounge?igshid=YmMyMTA2M2Y=" target="_blank" rel="noreferrer">
          <ListItemText primary="Instagram" sx={{ color: '#fff' }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed"
        sx={{ backgroundColor: '#333', boxShadow: 'none' }}
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
          <img src={logo} alt="logo" className={s.logo}/>
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

import React from 'react';
import s from './Layout.module.scss';

import { Outlet } from 'react-router-dom';




export const Layout = () => {
  
  return (
    <>

   
        <div className={s.body}>
          <Outlet  />
        </div>
    
    </>
  );
};

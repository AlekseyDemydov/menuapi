import React from 'react';
import s from './Layout.module.scss';

import { Outlet } from 'react-router-dom';




export const Layout = () => {
  
  return (
    <>
      <div className={s.container}>
   
        <div className={s.body}>
          <Outlet  />
        </div>
      </div>
    </>
  );
};

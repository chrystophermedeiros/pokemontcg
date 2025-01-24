import { Outlet } from 'react-router-dom';
import Header from './Header';
import '../styles/index.css';

export const Layout = () => (
  <>
    <Header  />
    <Outlet />
  </>
);

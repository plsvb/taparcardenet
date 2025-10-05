import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono flex flex-col p-8 animate-fade-in">
      <Navbar />
      <div className="flex-grow container mx-auto py-8">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

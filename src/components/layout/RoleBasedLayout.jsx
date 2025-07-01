import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

const RoleBasedLayout = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar userRole={user?.role} />
        <main className="flex-1 ml-64 mt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RoleBasedLayout;
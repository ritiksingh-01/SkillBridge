import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedLayout from './components/layout/RoleBasedLayout';

// Auth Pages
import LoginPage from './Pages/AuthPage/LoginPage';
import SignUpPage from './Pages/AuthPage/SignUpPage';

// Public Pages
import HomePage from './Pages/HomePage/HomePage';

// Dashboard Pages
import MentorDashboard from './Pages/MentorDashboard/MentorDashboard';

// Common Pages
import ProfilePage from './pages/Profile/ProfilePage';
import MessagesPage from './pages/Messages/MessagesPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import SettingsPage from './pages/Settings/SettingsPage';
import HelpPage from './pages/Help/HelpPage';

// Role-specific Pages
import FindMentorsPage from './pages/FindMentors/FindMentorsPage';

const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/signUp',
    element: <SignUpPage />
  },

  // Protected routes with role-based layout
  {
    path: '/mentor-dashboard',
    element: (
      <ProtectedRoute requiredRole="mentor">
        <RoleBasedLayout>
          <MentorDashboard />
        </RoleBasedLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <RoleBasedLayout>
          <ProfilePage />
        </RoleBasedLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/messages',
    element: (
      <ProtectedRoute>
        <RoleBasedLayout>
          <MessagesPage />
        </RoleBasedLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <RoleBasedLayout>
          <NotificationsPage />
        </RoleBasedLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/find-mentors',
    element: (
      <ProtectedRoute requiredRole="mentee">
        <RoleBasedLayout>
          <FindMentorsPage />
        </RoleBasedLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <RoleBasedLayout>
          <SettingsPage />
        </RoleBasedLayout>
      </ProtectedRoute>
    )
  },
  {
    path: '/help',
    element: (
      <ProtectedRoute>
        <RoleBasedLayout>
          <HelpPage />
        </RoleBasedLayout>
      </ProtectedRoute>
    )
  },

  // Redirects for old routes
  {
    path: '/mentee-dashboard',
    element: <Navigate to="/profile" replace />
  },
  {
    path: '/findMentorPage',
    element: <Navigate to="/find-mentors" replace />
  },

  // Catch all - redirect to home
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
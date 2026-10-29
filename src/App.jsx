import './App.css';
import { createBrowserRouter, RouterProvider, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './Components/ProtectedRoute'; // Fixed case-sensitive import (C7)
import LoginPage from './Pages/AuthPage/LoginPage';
import SignUpPage from './Pages/AuthPage/SignUpPage';
import FindMentorsPage from './Pages/FindMentorPage/FindMentorsPage';
import HomePage from './Pages/HomePage/HomePage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import MessagePage from './Pages/MessagePage/MessagePage';
import NotificationPage from './Pages/NotificationPage/NotificationPage';
import BecomeMentorPage from './Pages/BecomeMentorPage/BecomeMentorPage';
import MentorDashboard from './Pages/MentorDashboard/MentorDashboard';
import MenteeDashboard from './Pages/MenteeDashboard/MenteeDashboard'; // Added route (F8)
import MentorProfilePage from './Pages/MentorProfilePage/MentorProfilePage';
import SettingsPage from './Pages/SettingsPage/SettingsPage';
import HelpPage from './Pages/HelpPage/HelpPage';

// 404 Not Found Page Component with SPA navigation
const NotFoundPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleReturn = () => {
    if (isAuthenticated) {
      navigate(user?.role === 'mentor' ? '/mentor-dashboard' : '/mentee-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={handleReturn}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
      >
        {isAuthenticated ? 'Return to Dashboard' : 'Return Home'}
      </button>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/mentor-dashboard',
    element: (
      <ProtectedRoute requiredRole="mentor">
        <MentorDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/mentee-dashboard',
    element: (
      <ProtectedRoute requiredRole="mentee">
        <MenteeDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/becomeMentor',
    element: (
      <ProtectedRoute>
        <BecomeMentorPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/signUp',
    element: <SignUpPage />
  },
  {
    path: '/findMentorPage',
    element: (
      <ProtectedRoute>
        <FindMentorsPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: '/mentor/:id',
    element: <MentorProfilePage />
  },
  {
    path: '/ViewMentorProfile',
    element: <MentorProfilePage />
  },
  {
    path: '/message',
    element: (
      <ProtectedRoute>
        <MessagePage />
      </ProtectedRoute>
    )
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <NotificationPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/help',
    element: <HelpPage />
  },
  {
    path: '/404',
    element: <NotFoundPage />
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />
  }
]);

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

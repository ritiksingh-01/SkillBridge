import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './Pages/AuthPage/LoginPage';
import SignUpPage from './Pages/AuthPage/SignUpPage';
import FindMentorsPage from './Pages/FindMentorPage/FindMentorsPage';
import HomePage from './Pages/HomePage/HomePage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import MessagePage from './Pages/MessagePage/MessagePage';
import NotificationPage from './Pages/NotificationPage/NotificationPage';
import BecomeMentorPage from './Pages/BecomeMentorPage/BecomeMentorPage';
// import MenteeProfile from './Pages/MenteeProfilePage/MenteeProfile';
import MentorDashboard from './Pages/MentorDashboard/MentorDashboard';
import MenteeDashboard from './Pages/MenteeDashboard/MenteeDashboard';
import MentorProfilePage from './Pages/MentorProfilePage/MentorProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>
  },
  {
    path: '/mentor-dashboard',
    element: (
      <ProtectedRoute requiredRole="mentor">
        <MentorDashboard/>
      </ProtectedRoute>
    )
  },
  {
    path: '/mentee-dashboard',
    element: (
      <ProtectedRoute requiredRole="mentee">
        <MenteeDashboard/>
      </ProtectedRoute>
    )
  },
  {
    path: '/becomeMentor',
    element: (
      <ProtectedRoute>
        <BecomeMentorPage/>
      </ProtectedRoute>
    )
  },
  {
    path: "/login",
    element: <LoginPage/>
  },
  {
    path: "/signUp",
    element: <SignUpPage/>
  },
  {
    path: "/findMentorPage",
    element: (
      <ProtectedRoute>
        <FindMentorsPage/>
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '/ViewMentorProfile',
    element: <MentorProfilePage />
  },
  {
    path: "/message",
    element: (
      <ProtectedRoute>
        <MessagePage/>
      </ProtectedRoute>
    )
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <NotificationPage/>
      </ProtectedRoute>
    )
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
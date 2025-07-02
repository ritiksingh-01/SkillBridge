import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './Pages/AuthPage/LoginPage';
import SignUpPage from './Pages/AuthPage/SignUpPage';
import FindMentorsPage from './Pages/FindMentorPage/FindMentorsPage';
import HomePage from './Pages/HomePage/HomePage';
import MentorProfilePage from './Pages/MentorProfilePage/MentorProfilePage';
import MessagePage from './Pages/MessagePage/MessagePage';
import NotificationPage from './Pages/NotificationPage/NotificationPage';
import BecomeMentorPage from './Pages/BecomeMentorPage/BecomeMentorPage';
import MenteeProfile from './Pages/MenteeProfilePage/MenteeProfile';
import SettingPage from './Pages/SettingPage/SettingPage';
import HelpPage from './Pages/HelpPage/HelpPage';

const router = createBrowserRouter([
  {
    path: '/',
    element:
    <div>
    <HomePage/>
    </div>
  },
  {
    path: '/becomeMentor',
    element: <BecomeMentorPage/>
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
    element: <FindMentorsPage/>
  },
  {
    path: "/mentorProfile",
    element: <MentorProfilePage/>
  },
  {
    path: "/message",
    element: <MessagePage/>
  },
  {
    path: "/notifications",
    element: <NotificationPage/>
  },
  {
    path: "/menteeProfile",
    element: <MenteeProfile/>
  },
  {
    path: "/settings",
    element: <SettingPage/>
  },
  {
    path: "/help",
    element: <HelpPage/>
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
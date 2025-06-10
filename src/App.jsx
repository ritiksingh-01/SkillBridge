import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage2 from './Pages/HomePage2'
import BecomeMentorPage from './Pages/BecomeMentorPage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';
import FindMentorsPage from './Pages/FindMentorsPage';
import HomePage from './Pages/HomePage';
import MentorProfilePage from './Pages/MentorProfilePage';
import MessagePage from './Pages/MessagePage';
import NotificationPage from './Pages/NotificationPage';

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
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
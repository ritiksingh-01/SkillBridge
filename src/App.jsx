import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import BecomeMentorPage from './Pages/BecomeMentorPage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUpPage';

const router = createBrowserRouter([
  {
    path: "/",
    element:
    <div>
    <HomePage />
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
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
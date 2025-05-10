import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './assets/Pages/HomePage'
import BecomeMentorPage from './assets/Pages/BecomeMentorPage';

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
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
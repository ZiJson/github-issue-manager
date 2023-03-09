import React from 'react';
import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { Home, Login, ForceLogin } from './containers';
import { PATH_NAME } from './enums';
function App() {
  const router = createBrowserRouter([
    {
      path: PATH_NAME.Home,
      element: <ForceLogin child={<Home />} />
    },
    {
      path: PATH_NAME.Login,
      element: <Login />
    }
  ]);
  return (
    <RouterProvider
      router={router}
    />
  );
}

export default App;

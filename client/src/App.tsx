import React from 'react';
import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { Home, Login, ForceLogin } from './containers';
import { PATH_NAME } from './enums';
import { ConfigProvider } from 'antd';
import Theme from './theme';
import styled from 'styled-components';
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
  const Screen = styled.div`
    width : 500px;
    height : 370px;
    margin : auto;
    margin-top : 60px;
    background : #dbe9ee;
    border-radius : 20px;
    border : solid 10px #c0d6df;
    padding :10px 30px;
`
  return (
    <ConfigProvider theme={Theme}
    >
      <Screen>
        <RouterProvider
          router={router}
        />
      </Screen>
    </ConfigProvider>
  );
}


export default App;

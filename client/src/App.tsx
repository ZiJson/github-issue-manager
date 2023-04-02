import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { PATH_NAME } from './constant';
import { ConfigProvider } from 'antd';
import Theme from './theme';
import styled from 'styled-components';
import ForceLogin from './containers/ForceLogin';
import Home from './containers/Home';
import Login from './containers/Login';
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
    width : 50vw;
    aspect-ratio : 5/4;
    min-width : 600px;
    margin : auto;
    margin-top : 10vh;
    background : #dbe9ee;
    border-radius : 20px;
    border : solid 10px #c0d6df;
    padding :10px 30px;
`
  return (
    <ConfigProvider theme={Theme}
    >
      <Screen className='screen'>
        <RouterProvider
          router={router}
        />
      </Screen>
    </ConfigProvider>
  );
}


export default App;

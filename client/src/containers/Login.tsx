import { Spin } from "antd"
import { useEffect } from "react";
import env from "ts-react-dotenv"
import { nanoid } from 'nanoid';
import { LOCAL_STORAGE_KEY, PATH_NAME } from "../constant";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "../components/LoginPage";
import { Loading } from "../components/Loading";
const Login = () => {
    const { UserLogin } = useAuth()
    const client_id = env.CLIENT_ID
    const redirect_uri = env.REDIRECT_URL
    const authUrl = `https://github.com/login/oauth/authorize?scope=user repo&client_id=${client_id}&redirect_uri=${redirect_uri}&prompt=select_account`
    console.log("render")
    console.log(env)
    const url = window.location.href;
    if (url.includes("?code=")) {
        UserLogin()
        return <Loading/>
        
    }
    return (
        <LoginPage/>
    )
}
export default Login
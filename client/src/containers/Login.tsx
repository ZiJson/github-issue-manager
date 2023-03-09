import { Button } from "antd"
import { useEffect} from "react";
import env from "ts-react-dotenv"
import { nanoid } from 'nanoid';
import { LOCAL_STORAGE_KEY, PATH_NAME } from "../enums";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
export const Login = () => {
    const {UserLogin} = useAuth()
    const client_id = env.CLIENT_ID
    const redirect_uri = env.REDIRECT_URL
    const client_secret = env.CLIENT_SECRET
    const authUrl = `https://github.com/login/oauth/authorize?scope=user repo&client_id=${client_id}&redirect_uri=${redirect_uri}`
    const navigate = useNavigate()
    console.log("render")
    useEffect(() => {
        const url = window.location.href;
        if (url.includes("?code=")) {
            UserLogin()
        }
    }, [])
    return (
        <>
            <div>Login</div>
            <Button type="default" href={authUrl}>go Login</Button>
        </>
    )
}
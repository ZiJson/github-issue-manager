import env from "ts-react-dotenv"
import { useApolloClient } from "@apollo/client";
import { nanoid } from 'nanoid';
import { LOCAL_STORAGE_KEY, PATH_NAME } from "../../enums";
import { useNavigate } from "react-router-dom";
export const useAuth = () => {
    const client = useApolloClient()
    const navigate = useNavigate()

    const isLogin = ():boolean => {
        return (localStorage.getItem(LOCAL_STORAGE_KEY.token)?true:false)
    }

    const UserLogout = ():void => {
        navigate(PATH_NAME.Login)
        localStorage.clear()
        client.resetStore()
        // .then(()=>{navigate(PATH_NAME.Login)})
    };

    const UserLogin = async ():Promise<void> => {
        const url = window.location.href;
        const client_id = env.CLIENT_ID
        const client_secret = env.CLIENT_SECRET

        const code = (url.split("?code="))[1];
        const getTokenUrl = `http://localhost:4000/authenticate`
        const body = JSON.stringify({
            client_id,
            client_secret,
            code
        })
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch(getTokenUrl, {
            method: "Post",
            body,
        })
            .then(res => res.json())
            .then(data => {
                const token = JSON.parse(data)["access_token"]
                localStorage.setItem(LOCAL_STORAGE_KEY.token, token)
                navigate(PATH_NAME.Home)
            })
            .catch(error => { throw error })
    };
    return {UserLogin, UserLogout, isLogin}
}
import env from "ts-react-dotenv"
import { useApolloClient } from "@apollo/client";
import { nanoid } from 'nanoid';
import { LOCAL_STORAGE_KEY, PATH_NAME } from "../../constant";
import { useNavigate } from "react-router-dom";
export const useAuth = () => {
    const client = useApolloClient()
    const navigate = useNavigate()

    const isLogin = (): boolean => {
        return (localStorage.getItem(LOCAL_STORAGE_KEY.token) ? true : false)
    }

    const UserLogout = (): void => {
        navigate(PATH_NAME.Login)
        localStorage.clear()
        client.resetStore()
        // .then(()=>{navigate(PATH_NAME.Login)})
    };

    const UserLogin = async (): Promise<void> => {
        const url = window.location.href;
        const client_id = env.CLIENT_ID
        const client_secret = env.CLIENT_SECRET
        const code = (url.split("?code="))[1].split("&state=")[0];
        const state = (url.split("&state="))[1]
        const clientState = localStorage.getItem(LOCAL_STORAGE_KEY.state)
        if (state !== clientState) {
            console.log(state, clientState)
            throw "the state is not correct, you might under attack, please log in again!"
        }
        const getTokenUrl = env.PROXY_SERVER
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

    const createState = () => {
        const clientState = localStorage.getItem(LOCAL_STORAGE_KEY.state)
        console.log(clientState)
        if (clientState) return
        localStorage.setItem(LOCAL_STORAGE_KEY.state, nanoid())
    }

    return { UserLogin, UserLogout, isLogin, createState }
}
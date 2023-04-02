import { useAuth } from "./hooks/useAuth";
import LoginPage from "../components/LoginPage";
import { Loading } from "../components/Loading";
const Login = () => {
    const { UserLogin, createState } = useAuth()
    console.log("render")
    const clientState = createState()
    const url = window.location.href;
    if (url.includes("?code=")) {
        UserLogin()
        return <Loading/>
        
    }
    return (
        <LoginPage clientState={clientState}/>
    )
}
export default Login
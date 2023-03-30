import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PATH_NAME } from "../constant";
import { useAuth } from "./hooks/useAuth";
import { message } from "antd";
const ForceLogin = ({ child }: { child: React.ReactNode }) => {
    const navigate = useNavigate();
    const { isLogin } = useAuth()
    
    useEffect(() => {
        if (!isLogin()) {
            console.log("you have to login your GitHub")
            message.warning("you have to login your GitHub")
            navigate(PATH_NAME.Login)
        }
        console.log("you are login !")
    }, [])

    return (
        <>{child}</>
    )
}

export default ForceLogin
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LOCAL_STORAGE_KEY, PATH_NAME } from "../enums";
import { useAuth } from "./hooks/useAuth";
export const ForceLogin = ({ child }: { child: React.ReactNode }) => {
    const navigate = useNavigate();
    const {isLogin} = useAuth()
    useEffect(() => {
        if (!isLogin()) {
            console.log("you have to login")
            navigate(PATH_NAME.Login)
        }
    },[])

    return (
        <>{child}</>
    )
}
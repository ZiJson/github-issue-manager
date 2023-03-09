import React from "react";
import { Button } from "antd";
import { useAuth } from "./hooks/useAuth";
export const Home = () => {
    const {UserLogout} = useAuth()
    return (
        <>
            <div>Home</div>
            <Button type="default" onClick={()=>{
                UserLogout()
            }}>Logout</Button>
        </>
    )
}
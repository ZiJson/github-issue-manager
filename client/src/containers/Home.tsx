import React,{useState} from "react";
import { Button } from "antd";
import { useAuth, useHome } from "./hooks";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_USER } from "../graphql/queries";

export const Home = () => {
    const {UserLogout} = useAuth()
    const {repos, getMoreRepos, queryUser, issues, getMoreIssues} = useHome()
    if(queryUser.loading) return <div>loading</div>
    console.log("Home render")
    console.log("repos:",repos)

    const onRepoClick = (e:any) =>{
        console.log(e.target)
    }
    return (
        <>
            <div>Home</div>
            <Button type="default" onClick={()=>{
                UserLogout()
            }}>Logout</Button>
            {queryUser.data.viewer.login}
            {repos.datas.map((repo)=>(<Button type="text" key={repo.id} id={repo.id} onClick={onRepoClick}> {repo.name}</Button>))}
            <Button type="default" onClick={()=>{
                getMoreRepos()
            }}>getMoreRepos</Button>
            <br></br>
            issues:
            {issues.datas.map((issue)=>{
                <p key={issue.id}>{issue.title}</p>
            })}
        </>
    )
}
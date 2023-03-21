import React, { useState, useRef } from "react";
import { Button, Typography, Divider, List, Skeleton, Avatar, Modal, Select, Tag } from "antd";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth, useHome } from "./hooks";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_USER } from "../graphql/queries";
import { USER, REPO, ISSUE, ShowType } from "./hooks/useHome";
import styled from "styled-components";
import IssueModel from "../components/IssueModel";

export const Home = () => {
    const { UserLogout } = useAuth()
    const { repos, getMoreRepos, queryUser, issues, getMoreIssues, getIssueInfo, issue, goBack, State, scrollToTop, handleFilter, createLabel, refetchIssues, OncreateIssue, labels} = useHome()
    if (queryUser.loading) return <div>loading</div>
    console.log("Home render")
    // console.log("repos:",repos)
    // console.log("issues:", issues)
    const dataList = State === ShowType.reposList ? repos : issues
    const loadData = () => {
        State === ShowType.reposList ? getMoreRepos() : getMoreIssues(issues.repo)
    }
    const onRepoClick = (e: any) => {
        getMoreIssues(e.target.id)
        scrollToTop()
    }
    const onIssueClick = (e: any) => {
        getIssueInfo(e.target.id)
    }
    const StateFilter = (datas:ISSUE[]) => {
        return datas.filter(data=>data.state==="OPEN")
    }
    return (
        <>
            <Typography.Text strong>Hello <Typography.Link href={queryUser.data?.viewer.url} >{queryUser.data?.viewer.login}</Typography.Link> !</Typography.Text>

            <Button type="primary" onClick={() => {
                UserLogout()
            }}>Logout</Button>
            {State === ShowType.issuesList ?
                <>
                    <Button onClick={() => goBack()}>Back</Button>
                    <Select
                        labelInValue
                        defaultValue={{ value: "all", label: "All" }}
                        style={{ width: 120 }}
                        onChange={handleFilter}
                        options={[
                            { value: "All", label: "All" },
                            { value: "Open", label: 'Open' },
                            { value: 'In Progress', label: 'In Progress' },
                            { value: 'Done', label: 'Done' },
                        ]}
                    />
                </> : ""}
            <div
                id="scrollableDiv"
                style={{
                    height: 300,
                    overflow: 'auto',
                    padding: '0 16px',
                    // border: '1px solid rgba(140, 140, 140, 0.1)',
                }}
            >
                <InfiniteScroll
                    dataLength={dataList.datas.length}
                    next={loadData}
                    hasMore={dataList.cursor ? true : false}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                >
                    {State === ShowType.reposList ?
                        <>
                            <div className="scrollToTop"></div>
                            <List
                                dataSource={dataList.datas as REPO[]}
                                renderItem={(item) => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta
                                            title={<Typography.Text onClick={onRepoClick}><a id={item.nameWithOwner}>{item.name}</a></Typography.Text>}
                                            description={item.url}
                                        />
                                        <div>Content</div>
                                    </List.Item>
                                )}
                            />
                        </> :
                        <>
                            <div className="scrollToTop"></div>
                            <List
                                dataSource={StateFilter(dataList.datas as ISSUE[])}
                                renderItem={(item) => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta
                                            title={<Typography.Text onClick={onIssueClick} ><a id={item.id}>{item.title}</a></Typography.Text>}
                                            description={item.state}
                                        />
                                        {item.labels.nodes.map(label => (<Tag key={label.id} color={"#" + label.color}>{label.name}</Tag>))}
                                    </List.Item>
                                )}
                            />
                        </>}
                </InfiniteScroll>
            </div>
            <IssueModel State={State} goBack={goBack} issue={issue as ISSUE} refetchIssue={refetchIssues} labels={labels}/>
            <Button onClick={() => scrollToTop()}> to top</Button>
            <Button onClick={() => OncreateIssue()}>create issue</Button>
            <Button onClick={() => refetchIssues()}>refetch</Button>
            {/* {displayUser(queryUser.data as USER)}
                {repos.datas.map((repo, i) => (<Button type="text" key={i} onClick={onRepoClick}><div id={repo.nameWithOwner}>{repo.name}</div></Button>))}
                <Button type="default" onClick={() => {
                    getMoreRepos()
                }}>getMoreRepos</Button>
                <br></br>
                issues:
                {issues.datas.map((issue, i) => (
                    <Button type="text" key={i} onClick={onIssueClick}><div id={issue.id}>{issue.title}</div></Button>
                ))}
                issue:
                {issue?.title} */}
        </>
    )
}
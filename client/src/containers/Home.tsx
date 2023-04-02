import { Button, Typography, Tooltip, Select, Space, Input, message } from "antd";
import { SwapLeftOutlined, VerticalAlignTopOutlined, AppstoreAddOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useAuth, useHome } from "./hooks";
import { Loading } from "../components/Loading";
import { ISSUE, ShowType } from "../constant";
import IssueModel from "../components/IssueModel";
import style from "./containers.module.css"
import ScrollList from "../components/ScrollList";

const Home = () => {
    const { UserLogout } = useAuth()
    const { repos, getMoreRepos, queryUser, issues, getMoreIssues, getIssueInfo, issue, goBack, State, scrollToTop, handleFilter, refetchIssues, OncreateIssue, labels, onSearch, searchLoading, sortDirect, setSortDirect, setSearchInput } = useHome()
    if (queryUser.loading) return <Loading />

    console.log("Home render")
    // console.log("repos:",repos)
    // console.log("issues:", issues)
    const dataList = State === ShowType.reposList ? repos : issues
    const loadData = async () => {
        State === ShowType.reposList ? getMoreRepos() : getMoreIssues(issues.repo)
    }
    const onRepoClick = async (e: any) => {
        await getMoreIssues(e.target.id)
        scrollToTop()
    }
    const onIssueClick = async (e: any) => {
        getIssueInfo(e.target.id)
    }

    const onSearchEnter = (value: string) => {
        if (!value) {
            message.warning("Hey! Type anything!")
            return
        }
        setSearchInput(value)
    }
    return (
        <>
            <div className={style.header}>
                <Typography.Text strong >Hello <Typography.Link href={queryUser.data?.viewer.url} >{queryUser.data?.viewer.login}</Typography.Link> !</Typography.Text>
                <Space align="end" style={{ width: "auto", justifyContent: "end" }}>
                    {(State === ShowType.issuesList || State === ShowType.issueInfo) && !onSearch ?
                        <>
                            <Select
                                labelInValue
                                defaultValue={{ value: "all", label: "All" }}
                                style={{ width: 120 }}
                                onChange={handleFilter}
                                options={[
                                    { value: "All", label: "All" },
                                    { value: "Open", label: 'Open' },
                                    { value: 'In_Progress', label: 'In Progress' },
                                    { value: 'Done', label: 'Done' },
                                ]}
                            />
                        </> : ""}
                    <Input.Search placeholder="input search text" style={{ width: 150 }} onSearch={onSearchEnter} loading={searchLoading}></Input.Search>
                    <Tooltip title={sortDirect === "ASC" ? "start from old" : "start from new"}>
                        <Button type="text" size="small" onClick={() => { setSortDirect(sortDirect === "ASC" ? "DESC" : "ASC") }} icon={<ArrowDownOutlined />}><sup style={{ fontWeight: "600" }}>{sortDirect === "ASC" ? "O" : "N"}</sup></Button>
                    </Tooltip>
                    <Button type="primary" className={style.logout} onClick={() => {
                        UserLogout()
                    }}>Logout</Button>
                </Space>
            </div>

            <ScrollList dataList={dataList} State={State} onItemClick={State === ShowType.reposList ? onRepoClick : onIssueClick} loadData={loadData} />

            <IssueModel State={State} goBack={goBack} issue={issue as ISSUE} refetchIssue={refetchIssues} labels={labels} />

            <div className={style.footer}>
                <div>
                    <Button onClick={() => goBack()} icon={<SwapLeftOutlined />} type="text" style={{ display: onSearch ? "" : State === ShowType.reposList ? "none" : "" }}>return</Button>
                </div>
                <Space>
                    <Tooltip title="create issue" placement="leftTop">
                        <Button onClick={() => OncreateIssue()} icon={<AppstoreAddOutlined />} type="text" style={{ display: State === ShowType.reposList ? "none" : "" }}>new</Button>
                    </Tooltip>
                    <Tooltip title="top" placement="bottom">
                        <Button onClick={() => scrollToTop()} icon={<VerticalAlignTopOutlined />} type="text">top</Button>
                    </Tooltip>
                </Space>

            </div>
        </>
    )
}

export default Home
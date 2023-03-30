import { Button, Typography, Divider, List, Skeleton, Tooltip, Select, Tag, Space, Input, message } from "antd";
import { SwapLeftOutlined, VerticalAlignTopOutlined, AppstoreAddOutlined ,ArrowUpOutlined ,ArrowDownOutlined} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth, useHome } from "./hooks";
import { Loading } from "../components/Loading";
import { REPO, ISSUE, ShowType } from "../constant";
import IssueModel from "../components/IssueModel";
import style from "./containers.module.css"

const Home = () => {
    const { UserLogout } = useAuth()
    const { repos, getMoreRepos, queryUser, issues, getMoreIssues, getIssueInfo, issue, goBack, State, scrollToTop, handleFilter, refetchIssues, OncreateIssue, labels, SearchByContent, onSearch, searchLoading, sortDirect, setSortDirect, setSearchInput } = useHome()
    if (queryUser.loading) return <Loading />

    console.log("Home render")
    // console.log("repos:",repos)
    // console.log("issues:", issues)
    const dataList = State === ShowType.reposList ? repos : issues
    const loadData = () => {
        State === ShowType.reposList ? getMoreRepos() : getMoreIssues(issues.repo)
    }
    const onRepoClick = async (e: any) => {
        await getMoreIssues(e.target.id)
        scrollToTop()
    }
    const onIssueClick = (e: any) => {
        getIssueInfo(e.target.id)
    }
    const StateFilter = (datas: ISSUE[]) => {
        return datas.filter(data => data.state === "OPEN")
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
                <Typography.Text strong>Hello <Typography.Link href={queryUser.data?.viewer.url} >{queryUser.data?.viewer.login}</Typography.Link> !</Typography.Text>
                <Space>
                    {(State === ShowType.issuesList || State === ShowType.issueInfo) && !onSearch ?
                        <>
                            <Select
                                size="small"
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
                    <Input.Search placeholder="input search text" style={{ width: 150 }} size="small" onSearch={onSearchEnter} loading={searchLoading}></Input.Search>
                    <Tooltip title={sortDirect==="ASC"?"start from old":"start from new"}>
                    <Button type="text" size="small" onClick={()=>{setSortDirect(sortDirect==="ASC"?"DESC":"ASC")}} icon={<ArrowDownOutlined />}><sup style={{fontWeight:"600"}}>{sortDirect==="ASC"?"O":"N"}</sup></Button>
                    </Tooltip>
                    <Button type="primary" size="small" onClick={() => {
                        UserLogout()
                    }}>Logout</Button>
                </Space>
            </div>



            <div
                id="scrollableDiv"
                className={style.scrollDiv}
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
                                            description={item.url}
                                        />
                                        {item.labels.nodes.map(label => (<Tag key={label.id} color={"#" + label.color}>{label.name}</Tag>))}
                                    </List.Item>
                                )}
                            />
                        </>}
                </InfiniteScroll>
            </div>
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
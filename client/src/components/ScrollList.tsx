import { List, Typography, Skeleton, Divider, Tag } from "antd"
import { REPO, ISSUE, ShowType } from "../constant"
import { Maybe } from "../__generated__/graphql";
import style from "./components.module.css"
import InfiniteScroll from 'react-infinite-scroll-component';
interface prop {
    dataList: {
        datas: REPO[];
        cursor: Maybe<string> | undefined;
        type: "repos";
    } | {
        datas: ISSUE[];
        repo: string;
        cursor: Maybe<string> | undefined;
        filter: string;
        type: "issues";
        loaded: boolean;
    }
    onItemClick: (e: any) => Promise<void>
    loadData: () => Promise<void>
    State: ShowType
}

const ScrollList = (prop: prop) => {
    const StateFilter = (datas: ISSUE[]) => {
        return datas.filter(data => data.state === "OPEN")
    }
    return (
        <div
            id="scrollableDiv"
            className={style.scrollDiv}
        >
            <InfiniteScroll
                dataLength={prop.dataList.datas.length}
                next={prop.loadData}
                hasMore={prop.dataList.cursor ? true : false}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
            >
                {prop.State === ShowType.reposList ?
                    <>
                        <div className="scrollToTop"></div>
                        <List
                            dataSource={prop.dataList.datas as REPO[]}
                            renderItem={(item) => (
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                        title={<Typography.Text onClick={prop.onItemClick}><a id={item.nameWithOwner}>{item.name}</a></Typography.Text>}
                                        description={<a className={style.link} href={item.url}>{item.url}</a>}
                                    />
                                </List.Item>
                            )}
                        />
                    </> :
                    <>
                        <div className="scrollToTop"></div>
                        <List
                            dataSource={StateFilter(prop.dataList.datas as ISSUE[])}
                            renderItem={(item) => (
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                        title={<Typography.Text onClick={prop.onItemClick} ><a id={item.id}>{item.title}</a></Typography.Text>}
                                        description={<a className={style.link} href={item.url}>{item.url}</a>}
                                    />
                                    <div className={style.tags}
                                    >
                                        {item.labels.nodes.map(label => (<Tag key={label.id} style={{ width: "fit-content" }} color={"#" + label.color}>{label.name}</Tag>))}
                                    </div>
                                </List.Item>
                            )}
                        />
                    </>}
            </InfiniteScroll>
        </div>
    )
}


export default ScrollList
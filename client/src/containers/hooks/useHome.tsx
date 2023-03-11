import { useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_REPOS, GET_USER, SEARCH } from "../../graphql/queries";
import { PageInfo } from "../../__generated__/graphql";
import { type } from "@testing-library/user-event/dist/type";
type REPO = {
    id: string
    issues: {
        totalCount: number
    }
    name: string
    nameWithOwner: string
    url: string
}

type ISSUE = {
    id:string
    title :string
    state :string
    body ?: string
}

type USER = {
    viewer: {
        id: string
        login: string
        name: string
    }

}
export const useHome = () => {
    console.log("useHome called")
    const [repos, setRepos] = useState<{ datas: REPO[], cursor: string }>({ datas: [], cursor: "" })
    const [issues, setIssues] = useState<{ datas: ISSUE[], cursor: string }>({ datas: [], cursor: "" })
    const queryUser = useQuery(GET_USER, {
        onCompleted(data) {
            const init = {
                datas: data.viewer.repositories.nodes,
                cursor: data.viewer.repositories.pageInfo.hasNextPage ? data.viewer.repositories.pageInfo.endCursor : null
            }
            setRepos(init)

        },
    })
    const [fetchRepos] = useLazyQuery(GET_REPOS, {
        onCompleted(data) {
            console.log(data)
            setRepos({
                datas: [...repos.datas, ...data.viewer.repositories.nodes],
                cursor: data.viewer.repositories.pageInfo.hasNextPage ? data.viewer.repositories.pageInfo.endCursor : null
            })
        },
        fetchPolicy: 'no-cache'
    })
    const [fetchIssues] = useLazyQuery(SEARCH,{
        onCompleted(data) {
            console.log(data)
        },
    })

    const getMoreRepos = () => {
        if (!repos.cursor) {
            console.log("No repo more")
            return
        }
        fetchRepos({ variables: { cursor: repos.cursor } })
    }
    const getMoreIssues = (id:string) => {
        fetchIssues({
            variables:{
                id,
                first:10,
                issueCursor:issues.cursor
            }
        })

    }
    return { repos, getMoreRepos, queryUser, issues, getMoreIssues }
}
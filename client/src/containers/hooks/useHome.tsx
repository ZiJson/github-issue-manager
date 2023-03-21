import { useEffect, useState } from "react";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { GET_REPOS, GET_USER, SEARCH } from "../../graphql/queries";
import { PageInfo, User, Maybe } from "../../__generated__/graphql";
import { type } from "@testing-library/user-event/dist/type";
import { CREATE_LABEL } from "../../graphql/mutations/Label";
import { GET_LABELS } from "../../graphql/queries/GetLabels";
import { CREATE_ISSUE } from "../../graphql/mutations/CreateIssue";
export type REPO = {
    id: string
    issues: {
        totalCount: number
    }
    name: string
    nameWithOwner: string
    url: string
}
export type ISSUE = {
    id?: string
    title?: string
    state?: string
    body?: string
    bodyHTML?: string
    repository :{
        nameWithOwner:string
        id:string
      }
    labels: {
        nodes: LABEL[]
    }
}

export type LABEL = {
    id: string
    name: string
    description: string
    color: string
}

export type USER = {
    viewer: {
        id: string
        login: string
        name: string
        url: string
        repositories: {
            nodes: REPO[]
            pageInfo: Partial<PageInfo>
        }
    }
}
export enum LabelColor {
    Open = "dad7cd",
    In_Progress = "e63946",
    Done = "2a9d8f"
}
export enum ShowType {
    reposList,
    issuesList,
    issueInfo
}
export const useHome = () => {
    const [repos, setRepos] = useState<{ datas: REPO[], cursor: Maybe<string> | undefined, type: "repos" }>({ datas: [], cursor: null, type: "repos" })
    const [issues, setIssues] = useState<{ datas: ISSUE[], repo: string, cursor: Maybe<string> | undefined, filter: string, type: "issues" }>({ datas: [], cursor: null, repo: "", type: "issues", filter: "All" })
    const [issue, setIssue] = useState<ISSUE | undefined>()
    const [labels, setLabels] = useState<LABEL[]>([])
    useEffect(() => {
        scrollToTop()
    }, [issues.repo])
    const queryUser = useQuery<USER>(GET_USER, {
        onCompleted(data) {
            const init = {
                ...repos,
                datas: data.viewer.repositories.nodes,
                cursor: data.viewer.repositories.pageInfo.hasNextPage ? data.viewer.repositories.pageInfo.endCursor : null
            }
            setRepos(init)

        },
    })
    const [fetchRepos] = useLazyQuery<USER>(GET_REPOS, {
        onCompleted(data) {
            setRepos({
                ...repos,
                datas: [...repos.datas, ...data.viewer.repositories.nodes],
                cursor: data.viewer.repositories.pageInfo.hasNextPage ? data.viewer.repositories.pageInfo.endCursor : null
            })
        },
        fetchPolicy: 'no-cache'
    })
    const [fetchById] = useLazyQuery(SEARCH, {
        fetchPolicy: "cache-first"
    })

    const [getLabels] = useLazyQuery(GET_LABELS, {
        fetchPolicy: "cache-first"
    })

    const [createLabel] = useMutation(CREATE_LABEL,
        {
            context: { headers: { Accept: `application/vnd.github.bane-preview+json` } },
            errorPolicy: "ignore"
        }
    )


    const getMoreRepos = () => {
        if (!repos.cursor) {
            console.log("No repo more")
            return
        }
        fetchRepos({ variables: { cursor: repos.cursor } })
    }
    const getMoreIssues = async (repoWithOwner: string) => {
        if (issues.repo === repoWithOwner && !issues.cursor) {
            console.log("No issue more")
            return
        }
        const filter = issues.filter
        const query = `repo:${repoWithOwner} is:issue is:open ${filter === 'All' ? "" : "label:" + filter}`
        await fetchById({
            variables: {
                query,
                issueCursor: issues.cursor
            },
        }).then((res) => {
            setIssues({
                ...issues,
                repo: repoWithOwner,
                datas: [...issues.datas, ...res.data.search.nodes],
                cursor: res.data.search.pageInfo.hasNextPage ? res.data.search.pageInfo.endCursor : null
            })
        })
        
        if (issues.repo !== repoWithOwner) {
            await hanedleLabel(repoWithOwner)
        }
    }
    const getIssueInfo = (id: string) => {
        if (id === issue?.id) {
            return
        }
        const issueClicked: ISSUE | undefined = issues.datas.find((data) => data.id === id)
        if (!issueClicked) return
        setIssue(issueClicked)
    }
    const goBack = () => {
        if (State === ShowType.issuesList) {
            setIssues({ datas: [], cursor: null, repo: "", type: "issues", filter: "All" })
            setLabels([])
        }
        else if (State === ShowType.issueInfo) {
            setIssue(undefined)
        }
    }
    const scrollToTop = () => {
        const top = document.querySelector('.scrollToTop');
        top?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    }

    const handleFilter = (value: { value: string; label: React.ReactNode }) => {
        if (issues.filter !== value.value) {
            const filter = value.value
            console.log(filter)
            const query = `repo:${issues.repo} is:issue ${filter === 'All' ? "" : "label:" + filter}`
            fetchById({
                variables: {
                    query,
                    issueCursor: null
                }
            }).then((res) => {
                setIssues({
                    ...issues,
                    filter: value.value,
                    datas: res.data.search.nodes,
                    cursor: res.data.search.pageInfo.hasNextPage ? res.data.search.pageInfo.endCursor : null
                })
            })
        }
    }

    const hanedleLabel = async (repo: string) => {
        if(labels.length>0)return
        const reponow = repos.datas.find(data => data.nameWithOwner === repo)
        await Promise.all([
            createLabel({ variables: { color: LabelColor.Open, name: "Open", repositoryId: reponow?.id } }),
            createLabel({ variables: { color: LabelColor.In_Progress, name: "In Progress", repositoryId: reponow?.id } }),
            createLabel({ variables: { color: LabelColor.Done, name: "Done", repositoryId: reponow?.id } })
        ])
        const labelQuery = await getLabels({ variables: { searchQuery: `repo:${repo}` } })
        const labelsget: LABEL[] = (labelQuery.data.search.nodes[0]).labels.nodes
        const labelsNeed = labelsget.filter(label => (["Open", "In Progress", "Done"].includes(label.name)))
        setLabels(labelsNeed)
    }

    const refetchIssues = async() => {
        const query = `repo:${issues.repo} is:issue is:open ${issues.filter === 'All' ? "" : "label:" + issues.filter}`
        fetchById({
            variables: {
                query,
                issueCursor: null
            },
            fetchPolicy:"cache-and-network"
        }).then((res) => {
            console.log(res.data)
            setIssues({
                ...issues,
                datas: res.data.search.nodes,
                cursor: res.data.search.pageInfo.hasNextPage ? res.data.search.pageInfo.endCursor : null
            })
        })
    }
    const OncreateIssue = () => {
        const repoId = (repos.datas.find(repo=>repo.nameWithOwner==issues.repo))?.id 
        if(!repoId) return
        setIssue({
            repository:{
                nameWithOwner:issues.repo,
                id : repoId
            },
            labels:{
                nodes :[]
            }
        })
    }
    const State = issue?.repository.nameWithOwner ? ShowType.issueInfo : issues.repo ? ShowType.issuesList : ShowType.reposList
    return { repos, getMoreRepos, queryUser, issues, getMoreIssues, getIssueInfo, issue, goBack, State, scrollToTop, handleFilter, createLabel, refetchIssues , OncreateIssue, labels }
}
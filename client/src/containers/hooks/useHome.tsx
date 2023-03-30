import { useEffect, useState } from "react";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { GET_REPOS, GET_USER, SEARCH } from "../../graphql/queries";
import { PageInfo, User, Maybe } from "../../__generated__/graphql";
import { CREATE_LABEL } from "../../graphql/mutations/Label";
import { GET_LABELS } from "../../graphql/queries/GetLabels";
import { useApolloClient } from "@apollo/client";
import { REPO, ISSUE, LABEL, ShowType, LabelColor, USER, PATH_NAME } from "../../constant";
import { useNavigate } from "react-router-dom";
import { type } from "@testing-library/user-event/dist/type";

export const useHome = () => {
    const [repos, setRepos] = useState<{ datas: REPO[], cursor: Maybe<string> | undefined, type: "repos" }>({ datas: [], cursor: null, type: "repos" })
    const [issues, setIssues] = useState<{ datas: ISSUE[], repo: string, cursor: Maybe<string> | undefined, filter: string, type: "issues", loaded: boolean }>({ datas: [], cursor: null, repo: "", type: "issues", filter: "All", loaded: false })
    const [issue, setIssue] = useState<ISSUE | undefined>()
    const [labels, setLabels] = useState<LABEL[]>([])
    const [onSearch, setOnSearch] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [sortDirect, setSortDirect] = useState("DESC")
    const [searchInput, setSearchInput] = useState("")
    const client = useApolloClient()
    const navigate = useNavigate();

    useEffect(() => {
        scrollToTop()
    }, [issues.repo])

    useEffect(() => {
        if (!sortDirect) return
        if (State === ShowType.reposList) {
            onSearch ? SearchByContent(searchInput, "REPOSITIRY") : refetchRepos()
        }
        else if (State === ShowType.issuesList) {
            onSearch ? SearchByContent(searchInput, "ISSUE") : refetchIssues()
        }
        scrollToTop()
    }, [sortDirect])

    useEffect(() => {
        if (!searchInput) return
        const type = State === ShowType.reposList ? "REPOSITORY" : "ISSUE"
        console.log("search")
        SearchByContent(searchInput, type)
    }, [searchInput])

    const queryUser = useQuery<USER>(GET_USER, {
        onError(error) {
            navigate(PATH_NAME.Login)
            throw error.message
        },
    })

    const getMoreRepos = async () => {
        if (!repos.cursor) {
            console.log("No repo more")
            return
        }
        client.query({
            query: GET_REPOS,
            variables: {
                cursor: repos.cursor,
                direction: sortDirect
            },
            fetchPolicy: "no-cache"
        }).then(res => {
            const data = res.data
            setRepos({
                ...repos,
                datas: [...repos.datas, ...data.viewer.repositories.nodes],
                cursor: data.viewer.repositories.pageInfo.hasNextPage ? data.viewer.repositories.pageInfo.endCursor : null
            })
        })
    }

    const SearchByContent = async (content: string, type: string) => {
        setSearchLoading(true)
        const query = type === "REPOSITORY" ? `${content} in:name user:${queryUser.data?.viewer.login} sort:created-${sortDirect}`
            : `${content} in:title,body repo:${issues.repo} is:issue is:Open sort:created-${sortDirect}`
        await client.query({
            query: SEARCH,
            variables: { query, type }
        }).then(res => {
            const data = res.data
            if (type === "REPOSITORY") {
                setRepos({
                    ...repos,
                    datas: data.search.nodes,
                    cursor: data.search.pageInfo.hasNextPage ? data.search.pageInfo.endCursor : null
                })
            }
            else {
                setIssues({
                    ...issues,
                    datas: res.data.search.nodes,
                    cursor: res.data.search.pageInfo.hasNextPage ? res.data.search.pageInfo.endCursor : null,
                    loaded: true
                })
            }

            setOnSearch(true)
            setSearchLoading(false)
        })
    }

    const getMoreIssues = async (repoWithOwner: string) => {
        if (issues.datas.length > 0 && !issues.cursor) {
            console.log("No issue more")
            return
        }
        const filter = issues.filter
        const query = `repo:${repoWithOwner} is:issue is:open ${filter === 'All' ? "" : "label:" + filter} sort:created-${sortDirect}`
        await client.query({
            query: SEARCH,
            variables: {
                query,
                cursor: issues.cursor,
                type: "ISSUE"
            },
        }).then((res) => {
            setIssues({
                ...issues,
                repo: repoWithOwner,
                datas: [...issues.datas, ...res.data.search.nodes],
                cursor: res.data.search.pageInfo.hasNextPage ? res.data.search.pageInfo.endCursor : null,
                loaded: true
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
        if (State === ShowType.issuesList && !onSearch) {
            setIssues({ ...issues, datas: [], cursor: null, type: "issues", filter: "All", loaded: false })
            scrollToTop()
        }
        else if (State === ShowType.issuesList && onSearch) {
            refetchIssues(true).then(() =>{
                setSearchInput("")
                setOnSearch(false)
            })
        }
        else if (State === ShowType.issueInfo) {
            setIssue(undefined)
        }
        else if (State === ShowType.reposList && onSearch) {
            refetchRepos().then(() => {
                setSearchInput("")
                setOnSearch(false)
            })
        }
    }
    const scrollToTop = () => {
        const top = document.querySelector('.scrollToTop');
        top?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    }

    const handleFilter = async (value: { value: string; label: React.ReactNode }) => {
        if (issues.filter !== value.value) {
            const filter = value.value
            console.log(filter)
            const query = `repo:${issues.repo} is:issue is:open ${filter === 'All' ? "" : "label:" + filter} sort:created-${sortDirect}`
            client.query({
                query: SEARCH,
                variables: {
                    query,
                    cursor: null,
                    type: "ISSUE"
                }
            }).then((res) => {
                console.log(res.data)
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
        const reponow = repos.datas.find(data => data.nameWithOwner === repo)
        await Promise.all([
            client.mutate({ mutation: CREATE_LABEL, variables: { color: LabelColor.Open, name: "Open", repositoryId: reponow?.id }, errorPolicy: "ignore", context: { headers: { Accept: `application/vnd.github.bane-preview+json` } } }),
            client.mutate({ mutation: CREATE_LABEL, variables: { color: LabelColor.In_Progress, name: "In_Progress", repositoryId: reponow?.id }, errorPolicy: "ignore", context: { headers: { Accept: `application/vnd.github.bane-preview+json` } } }),
            client.mutate({ mutation: CREATE_LABEL, variables: { color: LabelColor.Done, name: "Done", repositoryId: reponow?.id }, errorPolicy: "ignore", context: { headers: { Accept: `application/vnd.github.bane-preview+json` } } })
        ])
        const labelQuery = await client.query({ query: GET_LABELS, variables: { searchQuery: `repo:${repo}` } })
        const labelsget: LABEL[] = (labelQuery.data.search.nodes[0]).labels.nodes
        const labelsNeed = labelsget.filter(label => (["Open", "In_Progress", "Done"].includes(label.name)))
        setLabels(labelsNeed)
    }

    const refetchRepos = async () => {
        client.query({
            query: GET_REPOS,
            variables: { cursor: null, direction: sortDirect }
        }).then(res => {
            const data = res.data
            setRepos({
                ...repos,
                datas: data.viewer.repositories.nodes,
                cursor: data.viewer.repositories.pageInfo.hasNextPage ? data.viewer.repositories.pageInfo.endCursor : null
            })
        })
    }

    const refetchIssues = async (force?:boolean) => {
        if(onSearch&&!force){
            SearchByContent(searchInput,"ISSUE")
            return
        }
        const query = `repo:${issues.repo} is:issue is:open ${issues.filter === 'All' ? "" : "label:" + issues.filter} sort:created-${sortDirect}`
        client.query({
            query: SEARCH,
            variables: {
                query,
                cursor: null,
                type: "ISSUE"
            },
            fetchPolicy: "network-only"
        }).then((res) => {
            setIssues({
                ...issues,
                datas: res.data.search.nodes,
                cursor: res.data.search.pageInfo.hasNextPage ? res.data.search.pageInfo.endCursor : null
            })
        })
    }
    const OncreateIssue = () => {
        const repoId = (repos.datas.find(repo => repo.nameWithOwner == issues.repo))?.id
        if (!repoId) return
        setIssue({
            repository: {
                nameWithOwner: issues.repo,
                id: repoId
            },
            labels: {
                nodes: []
            }
        })
    }

    const State = issue?.repository.nameWithOwner ? ShowType.issueInfo : issues.loaded ? ShowType.issuesList : ShowType.reposList
    return { repos, getMoreRepos, queryUser, issues, getMoreIssues, getIssueInfo, issue, goBack, State, scrollToTop, handleFilter, refetchIssues, OncreateIssue, labels, SearchByContent, onSearch, searchLoading, sortDirect, setSortDirect, setSearchInput }
}
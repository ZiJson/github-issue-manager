import { useEffect, useState } from "react";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { GET_REPOS, GET_USER, SEARCH } from "../../graphql/queries";
import { PageInfo, User, Maybe } from "../../__generated__/graphql";
import { CREATE_LABEL } from "../../graphql/mutations/Label";
import { GET_LABELS } from "../../graphql/queries/GetLabels";
import { useApolloClient } from "@apollo/client";
import { REPO,ISSUE,LABEL,ShowType, LabelColor,USER } from "../../constant";

export const useHome = () => {
    const [repos, setRepos] = useState<{ datas: REPO[], cursor: Maybe<string> | undefined, type: "repos" }>({ datas: [], cursor: null, type: "repos" })
    const [issues, setIssues] = useState<{ datas: ISSUE[], repo: string, cursor: Maybe<string> | undefined, filter: string, type: "issues", loaded:boolean }>({ datas: [], cursor: null, repo: "", type: "issues", filter: "All",loaded:false })
    const [issue, setIssue] = useState<ISSUE | undefined>()
    const [labels, setLabels] = useState<LABEL[]>([])
    const client = useApolloClient()
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
    const getMoreRepos = async () => {
        if (!repos.cursor) {
            console.log("No repo more")
            return
        }
        client.query({
            query: GET_REPOS,
            variables: {
                cursor: repos.cursor
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
    const getMoreIssues = async (repoWithOwner: string) => {
        if (issues.datas.length > 0 && !issues.cursor) {
            console.log("No issue more")
            return
        }
        const filter = issues.filter
        const query = `repo:${repoWithOwner} is:issue is:open ${filter === 'All' ? "" : "label:" + filter}`
        await client.query({
            query: SEARCH,
            variables: {
                query,
                issueCursor: issues.cursor
            },
        }).then((res) => {
            setIssues({
                ...issues,
                repo: repoWithOwner,
                datas: [...issues.datas, ...res.data.search.nodes],
                cursor: res.data.search.pageInfo.hasNextPage ? res.data.search.pageInfo.endCursor : null,
                loaded:true
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
            setIssues({ ...issues, datas: [], cursor: null, type: "issues", filter: "All",loaded:false })
            scrollToTop()
        }
        else if (State === ShowType.issueInfo) {
            setIssue(undefined)
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
            const query = `repo:${issues.repo} is:issue ${filter === 'All' ? "" : "label:" + filter}`
            client.query({
                query:SEARCH,
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

    const refetchIssues = async () => {
        const query = `repo:${issues.repo} is:issue is:open ${issues.filter === 'All' ? "" : "label:" + issues.filter}`
        client.query({
            query:SEARCH,
            variables: {
                query,
                issueCursor: null
            },
            fetchPolicy: "network-only"
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
    return { repos, getMoreRepos, queryUser, issues, getMoreIssues, getIssueInfo, issue, goBack, State, scrollToTop, handleFilter, refetchIssues, OncreateIssue, labels }
}
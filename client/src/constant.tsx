import { PageInfo } from "./__generated__/graphql"
export enum PATH_NAME {
	Home = '/',
	Login = 'login'
}
export enum LOCAL_STORAGE_KEY {
    token = "access_token"
}

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
    url?: string
    repository: {
        nameWithOwner: string
        id: string
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
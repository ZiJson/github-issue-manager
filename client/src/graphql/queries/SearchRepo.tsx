import { gql } from "@apollo/client";
import { REPO_INFO, PAGE_CURSOR } from "../Fragments";

export const SEARCHREPO = gql`
    ${REPO_INFO}  
    ${PAGE_CURSOR}  
    query SearchRepo ($query:String!) {
        search(type: REPOSITORY, query: $query, first: 10) {
            nodes {
                ... on Repository {
                    ...RepoInfo
                }
            }
            pageInfo {
                ...PageCursor
            }
        }
    }
`
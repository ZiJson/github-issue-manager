import gql from 'graphql-tag';
import { PAGE_CURSOR,  ISSUE_INFO } from '../Fragments';

export const SEARCH = gql`
    ${ISSUE_INFO}
    ${PAGE_CURSOR}
    query Search($id:ID!, $issueCursor:String, $first:Int){
        node(id: $id) {
            ... on Issue {
                ...IssueInfo
            }
            ... on Repository {
                issues(after: $issueCursor first: $first){
                    nodes{
                        id
                        title
                    }
                    pageInfo{
                        ...PageCursor
                    }
                }
            }
        }
    }
`
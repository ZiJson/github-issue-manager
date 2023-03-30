import gql from 'graphql-tag';
import { PAGE_CURSOR,  ISSUE_INFO, REPO_INFO } from '../Fragments';

export const SEARCH = gql`
    ${ISSUE_INFO}
    ${REPO_INFO} 
    ${PAGE_CURSOR}
    query Search($query:String!,  $cursor:String $type:SearchType!){
        search(query: $query, type: $type, first: 10, after: $cursor) {
            nodes {
                ... on Issue {
                  ...IssueInfo
                }
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
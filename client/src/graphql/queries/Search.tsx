import gql from 'graphql-tag';
import { PAGE_CURSOR,  ISSUE_INFO } from '../Fragments';

export const SEARCH = gql`
    ${ISSUE_INFO}
    ${PAGE_CURSOR}
    query Search($query:String!,  $issueCursor:String){
        search(query: $query, type: ISSUE, first: 10, after: $issueCursor) {
            nodes {
                ... on Issue {
                  ...IssueInfo
                }
              }
              pageInfo {
                ...PageCursor
              }
        }
    }
`
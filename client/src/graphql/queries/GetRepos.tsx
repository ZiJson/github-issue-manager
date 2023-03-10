import gql from 'graphql-tag';
import { PAGE_CURSOR, REPO_INFO } from '../Fragments';

export const GET_REPOS = gql(`
    ${PAGE_CURSOR}
    ${REPO_INFO}
    query GetRepos ($cursor:String!){
        viewer {
          repositories(first: 10, after: $cursor) {
            pageInfo {
                ...PageCursor
            }
            nodes {
                ...RepoInfo
            }
          }
        }
      }
`)

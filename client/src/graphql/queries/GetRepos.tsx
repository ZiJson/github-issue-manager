import gql from 'graphql-tag';
import { PAGE_CURSOR, REPO_INFO } from '../Fragments';

export const GET_REPOS = gql(`
    ${PAGE_CURSOR}
    ${REPO_INFO}
    query GetRepos ($cursor:String $direction:OrderDirection!){
        viewer {
          id
          repositories(first: 10, after:$cursor affiliations: [OWNER, ORGANIZATION_MEMBER, COLLABORATOR]
            ownerAffiliations: [OWNER, ORGANIZATION_MEMBER, COLLABORATOR] orderBy: {field: CREATED_AT, direction: $direction}) {
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

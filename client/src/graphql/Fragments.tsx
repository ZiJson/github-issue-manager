import { gql } from 'graphql-tag';

export const USER_INFO = `
  fragment UserInfo on User {
    id
    name
    login
    url
  }
`;

export const REPO_INFO = `
  fragment RepoInfo on Repository {
    id
    issues {
      totalCount
    }
    name
    nameWithOwner
    url
    
  }
`

export const ISSUE_INFO = `
  fragment IssueInfo on Issue {
    id
    state
    title
    body
    bodyHTML
    url
    repository {
      nameWithOwner
      id
    }
    labels(first: 10){
      nodes {
        name
        id 
        color
        
      }
    }
  }
`

export const PAGE_CURSOR = `
  fragment PageCursor on PageInfo {
    hasNextPage
    endCursor
  }
`

export const LABEL = `
  fragment Label on Label {
    id
    color 
    name
  }
`
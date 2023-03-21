import { gql } from "@apollo/client";
import { ISSUE_INFO } from "../Fragments";

export const CREATE_ISSUE = gql`
    ${ISSUE_INFO}
    mutation CreateIssue($repositoryId:ID! $title:String! $body:String $labelIds:[ID!] ) {
        createIssue(input: {repositoryId: $repositoryId, title: $title, body: $body, labelIds: $labelIds}) {
        issue {
            ...IssueInfo
        }
        }
    }
`
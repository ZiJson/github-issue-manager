import { gql } from "@apollo/client";
import { ISSUE_INFO } from "../Fragments";
export const UPDATE_ISSUE = gql`
    ${ISSUE_INFO}
    mutation UpdateIssue ($id:ID! $body:String! $title:String! ) {
        updateIssue(input: {id:$id, body: $body, title: $title}) {
        issue {
            ...IssueInfo
        }
        }
    }
`
// export const UPDATE_ISSUE_LABEL = gql`
//     ${ISSUE_INFO}
//     mutation UpdateIssue ($id:ID! $body:String! $title:String! ) {
//         updateIssue(input: {id:$id, body: $body, title: $title}) {
//         issue {
//             ...IssueInfo
//         }
//         }
//     }
// `
// export const UPDATE_ISSUE_STATE = gql`
//     ${ISSUE_INFO}
//     mutation UpdateIssue ($id:ID! $body:String! $title:String! ) {
//         updateIssue(input: {id:$id, body: $body, title: $title}) {
//         issue {
//             ...IssueInfo
//         }
//         }
//     }
// `
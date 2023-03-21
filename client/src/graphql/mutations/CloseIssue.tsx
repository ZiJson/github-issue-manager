import { gql } from "@apollo/client";
import { ISSUE_INFO } from "../Fragments";

export const CLOSE_ISSUE = gql`
    ${ISSUE_INFO}
    mutation CloseIssue($issueId:ID!) {
        closeIssue(input: {issueId: $issueId}) {
        issue{
            ...IssueInfo
        }
        }
    }
`
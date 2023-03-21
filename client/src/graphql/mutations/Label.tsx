import gql from 'graphql-tag';
import { ISSUE_INFO } from '../Fragments';

export const CREATE_LABEL = gql`
    mutation CreateLabel($color:String! $name:String! $repositoryId:ID!) {
        createLabel(
        input: {color: $color, name: $name,repositoryId:$repositoryId }
        ) {
            label {
                name
                id
                color
            }
        }
    }
`

export const CHANGE_LABEL = gql`
    ${ISSUE_INFO}
    mutation ChangeLabel ($issueId:ID! $toRemove:[ID!]! $toAdd:[ID!]!) {
        addLabelsToLabelable(input: {labelableId: $issueId, labelIds: $toAdd}){
            labelable {
                ... on Issue {
                    ...IssueInfo
                }
            }
        }
        removeLabelsFromLabelable(input: {labelableId: $issueId, labelIds: $toRemove}) {
            labelable {
                ... on Issue {
                    ...IssueInfo
                }
            }
        }
    }
`

export const ADD_LABEL = gql`
    ${ISSUE_INFO}
    mutation AddLabel ($issueId:ID!  $toAdd:[ID!]!) {
        addLabelsToLabelable(input: {labelableId: $issueId, labelIds: $toAdd}){
            labelable {
                ... on Issue {
                    ...IssueInfo
                }
            }
        }
    }
`
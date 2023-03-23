import { gql } from "@apollo/client";

export const GET_LABELS = gql`
    query GetLabels ($searchQuery:String! ) {
        search(query: $searchQuery, type: REPOSITORY, first: 1) {
        nodes {
            ... on Repository {
            labels(first: 10, query: "Open In_Progress Done") {
                nodes {
                    color
                    id
                    description
                    name
                }
            }
            }
        }
        }
    }
`
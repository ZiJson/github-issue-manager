import gql from 'graphql-tag';
import { useQuery, useLazyQuery } from '@apollo/client';
import { USER_INFO, REPO_INFO, PAGE_CURSOR } from '../Fragments';
import { GET_REPOS } from './GetRepos';
const GET_USER = gql(`
    ${USER_INFO}
    ${REPO_INFO}
    ${PAGE_CURSOR}
    query GetUser {
        viewer{
            ...UserInfo
            repositories(first: 10) {
                pageInfo {
                    ...PageCursor
                }
                edges {
                    cursor
                    node {
                      ...RepoInfo
                    }
                }
            }
        }
    }    
`);

export const User = () => {
    const { data, loading, error} = useQuery(GET_USER);
    const [getRepos,{data:newdata, loading:newloading, error:newerror}] = useLazyQuery(GET_REPOS);
    if (loading) return null;
    if (error) throw error;
    console.log(data)
    getRepos({variables:{cursor:(data.viewer.repositories.edges.slice(-1)[0]).cursor}})
    console.log(newerror)
    return (
        <div>{data.viewer.login}</div>
    )
}

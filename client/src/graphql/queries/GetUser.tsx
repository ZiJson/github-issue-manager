import gql from 'graphql-tag';
import { useQuery, useLazyQuery } from '@apollo/client';
import { USER_INFO, REPO_INFO, PAGE_CURSOR } from '../Fragments';
import { GET_REPOS } from './GetRepos';
export const GET_USER = gql(`
    ${USER_INFO}
    query GetUser {
        viewer{
            ...UserInfo
        }
    }    
`);



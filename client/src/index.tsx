import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { LOCAL_STORAGE_KEY } from './enums';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const httpLink = createHttpLink({
  uri: GITHUB_BASE_URL,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "Bearer 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",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
console.log(client)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>

  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

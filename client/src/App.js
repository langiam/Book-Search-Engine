// client/src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Navbar from './components/Navbar';
// Now that vite-env.d.ts is in place, TS knows about import.meta.env
const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL || '/graphql',
});
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    };
});
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
function App() {
    return (<ApolloProvider client={client}>
      <Navbar />
      <div className="container mt-4">
        <Outlet />
      </div>
    </ApolloProvider>);
}
export default App;

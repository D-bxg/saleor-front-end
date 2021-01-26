import React, { PureComponent } from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import Pages from './pages'
import './App.less';

const client = new ApolloClient({
  link: createUploadLink({
    // uri: "http://192.168.172.128:8080/graphql/",
    uri: "http://39.101.164.11:8080/graphql/",
  }),
  cache: new InMemoryCache(),
});

export default class App extends PureComponent {
  render() {
    return (
      <ApolloProvider client={client}>
        <Pages></Pages>
      </ApolloProvider>
    )
  }
}
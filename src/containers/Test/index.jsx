import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://39.101.164.11:8080/graphql/",
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql`
      query {
        products {
          id
        }
      }
    `,
  })
  .then((result) => console.log(result));

class Test extends PureComponent {
  render() {
    const { Test } = this.props;
    console.log(Test);
    return (
      <div>
        Test
        {Test.name}
      </div>
    );
  }
}

export default connect((state) => ({ Test: state.Test }), {})(Test);

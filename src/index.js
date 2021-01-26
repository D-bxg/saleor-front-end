import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
// import { ApolloProvider } from "react-apollo";
// import ApolloClient from "apollo-client";

// const client = new ApolloClient();

ReactDOM.render(
  //react-router-dom

  // {/* react-redux */}
  
    // {/* react-apollo */}
    <Provider store={store} >
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>,
  document.getElementById("root")
);

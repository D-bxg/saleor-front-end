import React, { Component } from "react";
import { Route } from "react-router-dom";
import Afp from "./afp";

export default class index extends Component {
  render() {
    return (
      <div>
        <Route path="/detail/afp">
          <Afp></Afp>
        </Route>
      </div>
    );
  }
}

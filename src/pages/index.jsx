import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Detail from './Detail'
import Nav from "../components/Nav/";
import Footer from "../components/Footer";

export default class index extends Component {
  render() {
    return (
      <Fragment>
        <Nav></Nav>
        <Switch>
          <Route path="/detail" component={Detail} />
          <Route path="/" component={Home} />
        </Switch>
        <Footer></Footer>
      </Fragment>
    );
  }
}

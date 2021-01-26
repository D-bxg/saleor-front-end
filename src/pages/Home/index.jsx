import React, { PureComponent } from "react";
import { Route } from "react-router-dom";

import Test from "../../containers/Test/";
import Carousel from "../../components/Carousel/";
import Commodity from "../../components/Commodity/";

export default class Home extends PureComponent {
  render() {
    return (
      <>
        <Carousel></Carousel>
        <Commodity></Commodity>
        <Route path="/Test">
          <Test></Test>
        </Route>
      </>
    );
  }
}

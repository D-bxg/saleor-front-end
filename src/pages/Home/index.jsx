import React, { PureComponent } from "react";

import Carousel from "../../components/Carousel/";
import Commodity from "../../components/Commodity/";

export default class Home extends PureComponent {
  render() {
    return (
      <>
        
        <Carousel></Carousel>
        <Commodity></Commodity>
      </>
    );
  }
}

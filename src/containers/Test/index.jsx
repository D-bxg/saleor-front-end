import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import "./index.min.css";
// import ScrollMagic from "scrollmagic";
// import { TweenMax } from "gsap";
// import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";

import Box3D from "../../components/Box3D";

// ScrollMagicPluginGsap(ScrollMagic, TweenMax);

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
  // componentDidMount() {
  //   let controller = new ScrollMagic.Controller({ vertical: true });
  //   var tween = TweenMax.staggerFromTo(
  //     "#div",
  //     2,
  //     { left: 0 },
  //     { left: '70vw',background:"rgba(137, 224, 163)","border-radius":"50%",},
  //     0.15
  //   );
  //   new ScrollMagic.Scene({
  //     offset: 0, // 滚动50px后开始该场
  //     triggerHook: 0,
  //     duration: '240%', // 场景持续滚动距离为100px
  //     triggerElement: "#div",
  //   })
  //     .setTween(tween)
  //     .setPin("#div") // 在场景持续时间内固定元素
  //     .addTo(controller); // 将场景分配给控制器
  // }
  render() {
    // const { Test } = this.props;
    return (
      <div className="">
        <Box3D
          size="50px"
          rotateX="70deg"
          rotateY="70deg"
          top="40vh"
          left="50vw"
        ></Box3D>
      </div>
    );
  }
}

export default connect((state) => ({ Test: state.Test }), {})(Test);

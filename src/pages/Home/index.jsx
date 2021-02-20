/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { PureComponent } from "react";
import { Modal } from "antd";
import ScrollMagic from "scrollmagic";
import { TweenMax } from "gsap";
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";
import VanillaTilt from "vanilla-tilt";

import Carousel from "../../components/Carousel/";
import Commodity from "../../components/Commodity/";
import Box3D from "../../components/Box3D";

import ADMET from "../../images/ADMET.png";
import COCRYSTAL from "../../images/COCRYSTAL.jpg";
import GENERATIVE from "../../images/GENERATIVE.jpg";
import KinomeX from "../../images/KinomeX.png";
import SCAFFHOP from "../../images/SCAFFHOP.jpg";

import "./index.min.css";

ScrollMagicPluginGsap(ScrollMagic, TweenMax);

export default class Home extends PureComponent {
  state = {
    visible: false,
    photo: ADMET,
    video: "http://39.99.151.46:3000/media/swiper/media/Admet-video.mp4",
  };
  mouseOverL1 = () => {
    this.setState({
      photo: ADMET,
      video: "http://39.99.151.46:3000/media/swiper/media/Admet-video.mp4",
    });
    // let elem=document.getElementById('movies');// 获得video
    // let id = elem.attributes["id"].value;
    // let autobuffer = elem.attributes["autobuffer"].value;
    // let width = elem.attributes["width"].value;
    // elem.parentNode.removeChild(elem);// 删除video
    // let frameDiv = document.createElement("video");//创建一个video
    // let bodyFa = document.getElementById("movies-div");//通过id号获取video的父类（也就是上一级的节点）
    // bodyFa.appendChild(frameDiv);//把创建的节点video添加到父类中；
    // frameDiv.setAttribute("id", id);//给创建的div设置id值；
    // frameDiv.setAttribute("autobuffer", autobuffer);
    // frameDiv.setAttribute("width", width);
    // frameDiv.className="divclass"; //给创建的div设置class；
  };
  mouseOverL2 = () => {
    this.setState({
      photo: COCRYSTAL,
      video: "http://39.99.151.46:3000/media/swiper/media/CoCrystal-video.mp4",
    });
  };
  mouseOverL3 = () => {
    this.setState({
      photo: GENERATIVE,
      video: "http://39.99.151.46:3000/media/swiper/media/Generative-video.mp4",
    });
  };
  mouseOverL4 = () => {
    this.setState({
      photo: SCAFFHOP,
      video: "http://39.99.151.46:3000/media/swiper/media/ScaffHop-video.mp4",
    });
  };
  mouseOverL5 = () => {
    this.setState({
      photo: KinomeX,
      video: "http://39.99.151.46:3000/media/swiper/media/Kinome-video.mp4",
    });
  };
  componentDidMount() {
    VanillaTilt.init(document.querySelector(".home__photo--under"), {
      max: 10,
      speed: 600,
    });
    let controller = new ScrollMagic.Controller();

    var tween1 = TweenMax.staggerFromTo(
      [
        ".home__pa",
        ".home__pb",
        ".home__pc",
        ".home__pd",
        ".home__pe",
        ".home__photo--under",
      ],
      0.01,
      {},
      {
        display: "none",
      }
    )
      .staggerFromTo(
        ".home__image",
        0.1,
        {},
        {
          width: "45vw",
          left: "6vw",
          top: "20vh",
        }
      )
      .staggerFromTo(
        ".home__image",
        0.2,
        {},
        {
          left: "6vw",
          top: "20vh",
        }
      );

    new ScrollMagic.Scene({
      offset: "-50px", // 滚动50px后开始该场
      triggerHook: 0,
      duration: "1000px", // 场景持续滚动距离为100px
      triggerElement: ".home",
    })
      .setTween(tween1)
      .setPin(".home__image") // 在场景持续时间内固定元素
      .addTo(controller); // 将场景分配给控制器
  }
  render() {
    return (
      <>
        <div className="home">
          <div className="home__afp"></div>
          <div className="home__1">
            <div className="home__text">
              <div className="home__context">
                <div className="home__title">ADMET</div>
                <div className="home__main">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est
                  placeat, commodi cumque dol
                </div>
              </div>
              <div className="home__image">
                <div
                  className="home__photo"
                  onClick={() =>
                    this.setState({ visible: !this.state.visible })
                  }
                >
                  <div id="home__photo" className="home__photo--under">
                    <div className="home__pa" onMouseOver={this.mouseOverL1}>
                      <img src={ADMET} alt="photo" />
                    </div>
                    <div className="home__pb" onMouseOver={this.mouseOverL2}>
                      <img src={COCRYSTAL} alt="photo" />
                    </div>
                    <div className="home__pc" onMouseOver={this.mouseOverL3}>
                      <img src={GENERATIVE} alt="photo" />
                    </div>
                    <div className="home__pd" onMouseOver={this.mouseOverL4}>
                      <img src={SCAFFHOP} alt="photo" />
                    </div>
                    <div className="home__pe" onMouseOver={this.mouseOverL5}>
                      <img src={KinomeX} alt="photo" />
                    </div>
                  </div>

                  <img src={this.state.photo} alt="photo" />
                  <Modal
                    title="atp"
                    centered
                    visible={this.state.visible}
                    onOk={() => this.setState({ visible: !this.state.visible })}
                    onCancel={() =>
                      this.setState({ visible: !this.state.visible })
                    }
                    width={"auto"}
                  >
                    <div id="movies-div" className="home__video">
                      <video
                        id="movies"
                        controls
                        // onMouseOver={this.play()}
                        // onMouseOut={this.pause()}
                        autobuffer="true"
                        width="1000px"
                      >
                        {this.state.video}
                        <source src={this.state.video} type="video/mp4" />
                        您的浏览器不支持video标签。
                      </video>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </div>

          <div className="home__2">
            <div className="home__2left"></div>
            <div className="home__2right">
              <div className="home-list">
                <div className="home-list__l1" onMouseOver={this.mouseOverL1}>
                  <p className="home-list__p">αADMET</p>
                  <div>
                    A group of graph neural network models for predicting ADMET
                    properties of compounds.
                  </div>
                </div>
                <div className="home-list__l2" onMouseOver={this.mouseOverL5}>
                  <p className="home-list__p">αKinomeX</p>
                  <div>
                    An application to predict kinome-wide polypharmacology
                    effect of small molecules based solely on their chemical
                    structures.
                  </div>
                </div>
                <div className="home-list__l3" onMouseOver={this.mouseOverL3}>
                  <p className="home-list__p">αMolGen</p>
                  <div>
                    A deep generative model maps the molecular activity or
                    physicochemical properties or ADMET properties to chemical
                    structures.
                  </div>
                </div>
                <div className="home-list__l4" onMouseOver={this.mouseOverL4}>
                  <p className="home-list__p">αScaffHop</p>
                  <div>
                    We proposed a molecular generation strategy, where new
                    compound structures were generated by applying
                    expert-defined transformations to an initial compound.
                  </div>
                </div>
                <div className="home-list__l5" onMouseOver={this.mouseOverL2}>
                  <p className="home-list__p">αCoCrystal</p>
                  <div>
                    A machine-learning model trained on the whole Cambridge
                    Structural Database for assisting high-throughput cocrystal
                    screening.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="home__3"></div>
          {/* <Commodity></Commodity> */}
          <div className="home__back">
            <div className="home__back__a"></div>
            <div className="home__back__b"></div>
            <div className="home__back__c"></div>
            <div className="home__back__d"></div>
            <div className="home__back__e"></div>
          </div>
        </div>
      </>
    );
  }
}
{
  /* <Box3D
id="a1"
width="100px"
height="100px"
rotateX="140deg"
rotateY="30deg"
top="15vh"
left="30vw"
></Box3D> */
}

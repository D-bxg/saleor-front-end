import React, { Component } from "react";
import "./index.min.css";
export default class Box3D extends Component {
  constructor(props) {
    super(props);
    this.BOX_3D_WIDTH = this.props.width;
    this.BOX_3D_HEIGHT = this.props.height;

    this.BOX_3D_ROTATEX = this.props.rotateX;
    this.BOX_3D_ROTATEY = this.props.rotateY;

    this.BOX_3D_TOP = this.props.top;
    this.BOX_3D_LEFT = this.props.left;

    this.BOX_3D_ID = this.props.id;

    this.BOX_3D_S_WIDTH = this.S(this.props.width);
    this.BOX_3D_S_HEIGHT = this.S(this.props.height);

    this.BOX_3D_SCTION = {
      width: this.props.width,
      height: this.props.height,

      transformStyle: "preserve-3d",
      perspective: "10000cm",
      position: "absolute",
      top: `${this.BOX_3D_TOP}`,
      left: `${this.BOX_3D_LEFT}`,
      transform: `translate(0) rotateX(${this.BOX_3D_ROTATEX}) rotateY(${this.BOX_3D_ROTATEY})`,
    };

    this.BOX_3D_DIV = {
      width: "inherit",
      height: "inherit",
      position: "absolute",
      top: "0",
      left: "0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    this.state = {
      BOX_3D_TOP: {
        ...this.BOX_3D_DIV,
        transform: `rotateX(90deg) translateZ(${this.BOX_3D_S_WIDTH})`,
      },
      BOX_3D_BOTTOM: {
        ...this.BOX_3D_DIV,
        transform: `rotateX(-90deg) translateZ(${this.BOX_3D_S_HEIGHT})`,
      },
      BOX_3D_LEFT: {
        ...this.BOX_3D_DIV,
        transform: `rotateY(-90deg) translateZ(${this.BOX_3D_S_WIDTH})`,
      },
      BOX_3D_RIGHT: {
        ...this.BOX_3D_DIV,
        transform: `rotateY(90deg) translateZ(${this.BOX_3D_S_WIDTH})`,
      },
      BOX_3D_FRONT: {
        ...this.BOX_3D_DIV,
        transform: `translateZ(${this.BOX_3D_S_WIDTH})`,
      },
      BOX_3D_BACK: {
        ...this.BOX_3D_DIV,
        transform: `rotateX(-180deg) translateZ(${this.BOX_3D_S_WIDTH})`,
      },
    };
  }
  S = (a) => {
    let b = a.replace(/[^0-9]/gi, "") / 2;
    return (b = b.toString() + a.replace(/[^a-z]+/gi, ""));
  };
  Q = (a) => {
    let w = this.props.height.replace(/[^0-9]/gi, "");
    let h = this.props.width.replace(/[^0-9]/gi, "");
    console.log(w + "w");
    console.log(h + "h");
    console.log(w > h);
    if (w > h) {
      let b = (w - h) / 2;
      return (b = b.toString() + a.replace(/[^a-z]+/gi, ""));
    }
    if (w < h) {
      let b = (h - w) / 2;
      b = w + b;
      console.log(b);
      return (b = b.toString() + a.replace(/[^a-z]+/gi, ""));
    }
    if (w == h) {
      let b = a.replace(/[^0-9]/gi, "") / 2;
      return (b = b.toString() + a.replace(/[^a-z]+/gi, ""));
    }
  };
  render() {
    const {
      BOX_3D_TOP,
      BOX_3D_BOTTOM,
      BOX_3D_LEFT,
      BOX_3D_RIGHT,
      BOX_3D_FRONT,
      BOX_3D_BACK,
    } = this.state;
    return (
      <div id={this.BOX_3D_ID} style={this.BOX_3D_SCTION} className="box3d">
        <div style={BOX_3D_TOP} className="box3d__top"></div>
        <div style={BOX_3D_BOTTOM} className="box3d__bottom"></div>
        <div style={BOX_3D_LEFT} className="box3d__left"></div>
        <div style={BOX_3D_RIGHT} className="box3d__right"></div>
        <div style={BOX_3D_FRONT} className="box3d__front"></div>
        <div style={BOX_3D_BACK} className="box3d__back"></div>
      </div>
    );
  }
}

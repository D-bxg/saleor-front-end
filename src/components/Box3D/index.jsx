import React, { Component } from "react";
import './index.min.css'
export default class Box3D extends Component {
  constructor(props) {
    super(props);
    this.BOX_3D_SIZE = this.props.size;
    this.BOX_3D_ROTATEX = this.props.rotateX;
    this.BOX_3D_ROTATEY = this.props.rotateY;
    this.BOX_3D_TOP = this.props.top;
    this.BOX_3D_LEFT = this.props.left;

    this.BOX_3D_S_SIZE = this.S(this.BOX_3D_SIZE);

    this.BOX_3D_DIV = {
      width: this.BOX_3D_SIZE,
      height: this.BOX_3D_SIZE,
      position: "absolute",
      top: "0",
      left: "0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    this.state = {
      BOX_3D_SCTION: {
        width: this.BOX_3D_SIZE,
        height: this.BOX_3D_SIZE,
        transformStyle: "preserve-3d",
        position: "absolute",
        top: `${this.BOX_3D_TOP}`,
        left: `${this.BOX_3D_LEFT}`,
        transform: `rotateX(${this.BOX_3D_ROTATEX}) rotateY(${this.BOX_3D_ROTATEY})`,
      },
      BOX_3D_TOP: {
        ...this.BOX_3D_DIV,
        transform: `rotateX(90deg) translateZ(${this.BOX_3D_S_SIZE})`,
      },
      BOX_3D_BOTTOM: {
        ...this.BOX_3D_DIV,
        transform: `rotateX(-90deg) translateZ(${this.BOX_3D_S_SIZE})`,
      },
      BOX_3D_LEFT: {
        ...this.BOX_3D_DIV,
        transform: `rotateY(-90deg) translateZ(${this.BOX_3D_S_SIZE})`,
      },
      BOX_3D_RIGHT: {
        ...this.BOX_3D_DIV,
        transform: `rotateY(90deg) translateZ(${this.BOX_3D_S_SIZE})`,
      },
      BOX_3D_FRONT: {
        ...this.BOX_3D_DIV,
        transform: `translateZ(${this.BOX_3D_S_SIZE})`,
      },
      BOX_3D_BACK: {
        ...this.BOX_3D_DIV,
        transform: `rotateX(-180deg) translateZ(${this.BOX_3D_S_SIZE})`,
      },
    };
  }
  S = (a) => {
    let b = a.replace(/[^0-9]/gi, "") / 2;
    return (b = b.toString() + a.replace(/[^a-z]+/gi, ""));
  };
  render() {
    const {
      BOX_3D_SCTION,
      BOX_3D_TOP,
      BOX_3D_BOTTOM,
      BOX_3D_LEFT,
      BOX_3D_RIGHT,
      BOX_3D_FRONT,
      BOX_3D_BACK,
    } = this.state;
    return (
      <div id="Box3D" style={BOX_3D_SCTION} className="box3d">
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

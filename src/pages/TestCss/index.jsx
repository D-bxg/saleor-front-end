import React, { PureComponent } from "react";

import './index.min.css'

export default class Home extends PureComponent {
  state={
    hidden:'testcss__vw--hidden'
  }
  render() {
    const {hidden} = this.state
    return (
      <>
      
        <div className="mask">
        <div className="testcss__slider "></div> 
        </div>
        <div className="testcss">
          
          
               a
               <div style={{height:'200vh',width:'10px',backgroundColor:'red'}}></div>  
        </div>
      </>
    );
  }
}

import React, { Component, Fragment, Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
// import Home from './Home';
// import Detail from './Detail';
import Nav from "../components/Nav/";
import Footer from "../components/Footer";
// import Test from "../containers/Test/";
import Loding from "../components/Loding";

const Home = lazy(() => import("./Home"));
const Detail = lazy(() => import("./Detail"));
const Test = lazy(() => import("../containers/Test"));

export default class index extends Component {
  render() {
    return (
      <Fragment>
        <Nav></Nav>
        <Suspense fallback={<Loding></Loding>}>
          <Switch>
            <Route path="/detail" component={Detail} />
            <Route path="/test" component={Test} />
            <Route path="/" component={Home} />
          </Switch>
        </Suspense>
        {/* <Footer></Footer> */}
      </Fragment>
    );
  }
}

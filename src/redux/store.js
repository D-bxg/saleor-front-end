// 创建store和异步方法
import { createStore, applyMiddleware } from "redux";
// 全局reducers
import reducers from "./reducers";
// 异步方法库的中间件
import thunk from "redux-thunk";

export default createStore(reducers, applyMiddleware(thunk));

import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import promise from "redux-promise";
import { Provider } from "react-redux";

import "./index.css";
import "./css/style.css";
// import App from "./App";
import MakeThePartRoute from "./common/core/makeThePartRoute";
import registerServiceWorker from "./registerServiceWorker";
import reducers from "./common/core/redux/reducers";

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);
const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
  <MakeThePartRoute store={store} />,
  document.getElementById("root")
);
registerServiceWorker();

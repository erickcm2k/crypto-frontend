import { ConfigProvider } from "antd";
import React from "react";
import MainContainer from "./components/MainContainer";

const App = () => (
  <ConfigProvider theme={{}}>
    <MainContainer/>
  </ConfigProvider>
);

export default App;

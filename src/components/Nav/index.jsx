import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Menu, Input } from "antd";
import { AppstoreOutlined, AudioOutlined } from "@ant-design/icons";
import "./index.min.css";
const { SubMenu } = Menu;
const { Search } = Input;
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1890ff",
    }}
  />
);

export default class Nav extends Component {
  state = {
    current: "mail",
  };

  onSearch = (value) => console.log(value);

  handleClick = (e) => {
    console.log("click ", e);
    this.setState({ current: e.key });
  };

  render() {
    const { current } = this.state;
    return (
      <header className="header">
        <Link to="/">
          <div key="logo" className="header__logo"></div>
        </Link>
        <div className="header__div"></div>
        <div key="search" className="header__search">
          <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            suffix={suffix}
            onSearch={this.onSearch}
          />
        </div>
        <div key="item" className="header__item">
          <Menu style={{backgroundColor:"#a4ede1"}} onClick={this.handleClick} mode="horizontal">
            <SubMenu key="detail" icon={<AppstoreOutlined />} title="应用">
              <Menu.ItemGroup title="应用">
                <Menu.Item key="afp">
                  <Link to="/detail/afp">afp</Link>
                </Menu.Item>
              </Menu.ItemGroup>
              {/* <Menu.ItemGroup title="Item 2">
                <Menu.Item key="setting:3">Option 3</Menu.Item>
                <Menu.Item key="setting:4">Option 4</Menu.Item>
              </Menu.ItemGroup> */}
            </SubMenu>
            {/* 
            <Menu.Item key="afp">
              
            </Menu.Item>
            <Menu.Item key="app" disabled icon={<AppstoreOutlined />}>
              Navigation Two
            </Menu.Item>
            
            <Menu.Item key="alipay">
              <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                Navigation Four - Link
              </a>
            </Menu.Item> */}
          </Menu>
        </div>
      </header>
    );
  }
}

import { GroupOutlined, HomeOutlined, MailOutlined, SettingOutlined, ThunderboltOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import logoUrl from "../../assets/react.svg";

import { Link } from "react-router";
import { handleLogin } from "../../api/auth_api";
import { useState } from "react";

const LeftSideMenu = (props) => {
  const { setIsDarkMode, isDarkMode } = props;
  const [itemKey, setItemKey] = useState("");
  const { setUserNum, setWorkshopNum, setSkillNum, userNum } = props;

  const darkModeChange = () => {
    setIsDarkMode(!isDarkMode);
    console.log("onClick method");
  }
  const changeItemKey = (item) => {
    console.log(item.key);
    setItemKey(item.key);
  };
  const items = [
    {
      label: `🏠 ホーム`,
      key: 'home',
      icon: <Link to={"/"}><HomeOutlined style={{ color: '#78c2ad' }} /></Link>,
    },
    {
      label: '👥 ユーザー',
      key: 'user',
      icon: <Link to={"/users"}><UserOutlined style={{ color: '#78c2ad' }} /></Link>,
    },
    {
      label: '📚 勉強会',
      key: 'workshop',
      icon: <Link to={"/workshops"}><GroupOutlined style={{ color: '#78c2ad' }} /></Link>,
    },
    {
      label: '⚡ スキル',
      key: 'skill',
      icon: <Link to={"/skills"}><ThunderboltOutlined style={{ color: '#78c2ad' }} /></Link>,
    },
    {
      label: '🌙 ダークモード',
      key: 'setting',
      icon: <Button
        onClick={darkModeChange}
        type="text"
        style={{
          border: 'none',
          background: 'transparent',
          color: '#78c2ad'
        }}
      >
        <SettingOutlined />
      </Button>,
    },
  ];


  console.log(">>>CHECK item key", itemKey);
  return (
    <div className="left-menu-block">
      <Menu className="left-menu"
        style={{ width: 256, height: 500 }}
        selectedKeys={itemKey}
        mode="vertical"
        items={items}
        onClick={
          changeItemKey
        }

      >


      </Menu>

    </div>);

  ;
};
export default LeftSideMenu;
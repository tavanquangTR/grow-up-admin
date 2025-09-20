import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import LeftSideMenu from "../components/layout/LeftSideMenu"
import Header from "../components/layout/Header";
import "../assets/styles/app.css";
import Footer from "../components/layout/Footer";
import { useState } from "react";
import { countSkillsAPI, countUsersAPI, countWorkshopsAPI } from "../api/user_api";
import { ConfigProvider, theme } from "antd";

// 新しく作成するレイアウト用コンポーネント
const AppLayout = (props) => {
    // 1. useTokenフックで現在のテーマのtokenを取得
    const { token } = theme.useToken();
    const [path, setPath] = useState("/");
    const [userNum, setUserNum] = useState(10);
    const [workshopNum, setWorkshopNum] = useState(0);
    const [skillNum, setSkillNum] = useState(0);
    const { setIsDarkMode, isDarkMode } = props;


    // ... getUserNumなどのロジックはここに移動 ...

    return (
        // 2. tokenの色を使ってスタイルを適用
        <div
            className="layout"
            style={{ backgroundColor: token.colorBgLayout, width: "100%", height: "100%" }} // 背景色を適用
        >
            <Header />
            <div className="main-content" style={{ color: token.colorTextBase }}> {/* テキスト色を適用 */}
                {/* サイドメニューにも背景色を適用するとより良くなります */}
                <LeftSideMenu
                    className="left-menu"
                    style={{ backgroundColor: token.colorBgContainer }}
                    setUserNum={setUserNum}
                    setIsDarkMode={setIsDarkMode}
                    isDarkMode={isDarkMode}
                // ... props ...
                />
                <Outlet context={[userNum, workshopNum, skillNum]} />
            </div>
            <Footer />
        </div>
    );
};


const App = () => {
    const { defaultAlgorithm, darkAlgorithm } = theme;
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
            }}
        >
            {/* 新しく作ったコンポーネントを呼び出す */}
            <AppLayout setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode} />
        </ConfigProvider>
    );
};

export default App;
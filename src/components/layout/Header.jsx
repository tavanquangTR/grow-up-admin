import { Modal } from "antd";
import logoUrl from "../../assets/icons/logo.png";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { logout } from "../../api/auth_api";
const Header = () => {
    const handleLogout = () => {
        logout();
    };
    return (
        <>
            <div className="header">
                <img src={logoUrl} alt="logo" style={{ width: "100px", }} />
                <LogoutOutlined onClick={handleLogout} style={{ color: "red" }} />

            </div>
            <Modal
                title="Basic Modal"
                closable={true}
                open={false}
                onOk={() => { }}
                onCancel={() => { }}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>

    );
}
export default Header;
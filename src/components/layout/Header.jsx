import { Modal, Button, Popconfirm } from "antd";
import logoUrl from "../../assets/icons/logo.png";
import { LogoutOutlined, HeartOutlined } from "@ant-design/icons";
import { logout } from "../../api/auth_api";

const Header = () => {
    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <div className="header" style={{
                background: 'linear-gradient(90deg, #a8e6cf 0%, #88d8c0 100%)',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(120, 194, 173, 0.15)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <img src={logoUrl} alt="logo" style={{
                        width: "100px",
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }} />
                    <span style={{
                        fontSize: '18px',
                        color: '#2d5a3d',
                        fontWeight: '500'
                    }}>
                        🌿 管理画面
                    </span>
                </div>

                <Popconfirm
                    title="ログアウトしますか？"
                    description="作業中のデータが保存されていることを確認してください 💫"
                    onConfirm={handleLogout}
                    okText="ログアウト"
                    cancelText="キャンセル"
                    okButtonProps={{
                        style: {
                            background: '#78c2ad',
                            borderColor: '#78c2ad'
                        }
                    }}
                >
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        style={{
                            color: '#2d5a3d',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                        }}
                    >
                        ログアウト
                    </Button>
                </Popconfirm>
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
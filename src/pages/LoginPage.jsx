import { Button, Form, Input, App, Alert } from 'antd'
import React, { useState, useEffect } from 'react'
import { handleLogin } from '../api/auth_api';
import { useNavigate } from 'react-router';

const LoginPage = () => {
    const { message: messageApi } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Clear any existing tokens when landing on login page
    useEffect(() => {
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
        console.log("Cleared existing tokens on login page");
    }, []);

    const submitLogin = async (values) => {
        const { email, password } = values;
        setLoading(true);
        setError(null);

        try {
            const result = await handleLogin(email, password);
            if (result.success) {
                messageApi.success('ログインに成功しました');
                navigate('/');
            }
        } catch (error) {
            setError(error.message);
            messageApi.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = () => {
        form.setFieldsValue({
            email: 'admin@example.com',
            password: 'password123'
        });
    };

    const handleTestConnection = async () => {
        console.log("Testing backend connection...");
        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BASE}/admin/login`, {
                method: 'OPTIONS',
            });
            console.log("Connection test result:", response.status);
            messageApi.info(`サーバー接続テスト: ${response.status === 200 ? '成功' : '失敗'} (${response.status})`);
        } catch (error) {
            console.error("Connection test failed:", error);
            messageApi.error(`サーバー接続テスト失敗: ${error.message}`);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #a8e6cf 0%, #88d8c0 50%, #78c2ad 100%)',
            padding: '20px'
        }}>
            <div style={{
                width: "420px",
                padding: "50px 40px",
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "24px",
                boxShadow: "0 15px 35px rgba(120, 194, 173, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)"
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '35px'
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '12px'
                    }}>🌸</div>
                    <h1 style={{
                        fontSize: '26px',
                        fontWeight: '600',
                        color: '#2d5a3d',
                        marginBottom: '12px',
                        letterSpacing: '0.5px'
                    }}>
                        管理者ログイン
                    </h1>
                    <p style={{
                        color: '#6b8a7a',
                        margin: 0,
                        fontSize: '15px',
                        lineHeight: '1.5'
                    }}>
                        心地よい管理画面へようこそ ✨
                    </p>
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: 'rgba(120, 194, 173, 0.1)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#2d5a3d'
                    }}>
                        <strong>🔒 デモ用ログイン情報:</strong><br />
                        Email: admin@example.com<br />
                        Password: password123<br />
                        <Button
                            type="link"
                            size="small"
                            onClick={handleQuickLogin}
                            style={{
                                padding: 0,
                                fontSize: '12px',
                                color: '#78c2ad',
                                marginTop: '4px',
                                marginRight: '8px'
                            }}
                        >
                            📝 フォームに自動入力
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={handleTestConnection}
                            style={{
                                padding: 0,
                                fontSize: '12px',
                                color: '#78c2ad',
                                marginTop: '4px'
                            }}
                        >
                            🔗 接続テスト
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: '20px' }}
                    />
                )}

                <Form
                    layout='vertical'
                    onFinish={submitLogin}
                    form={form}
                    size="large"
                >
                    <Form.Item
                        label="メールアドレス"
                        name="email"
                        rules={[
                            { required: true, message: 'メールアドレスを入力してください' },
                            { type: 'email', message: '正しいメールアドレスを入力してください' }
                        ]}
                    >
                        <Input placeholder="admin@example.com" />
                    </Form.Item>

                    <Form.Item
                        label="パスワード"
                        name="password"
                        rules={[
                            { required: true, message: 'パスワードを入力してください' },
                            { min: 6, message: 'パスワードは6文字以上で入力してください' }
                        ]}
                    >
                        <Input.Password placeholder="パスワードを入力" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: '35px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{
                                width: '100%',
                                height: '52px',
                                fontSize: '16px',
                                fontWeight: '500',
                                background: 'linear-gradient(135deg, #78c2ad 0%, #a8e6cf 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 4px 15px rgba(120, 194, 173, 0.3)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            🌟 ログイン
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default LoginPage;
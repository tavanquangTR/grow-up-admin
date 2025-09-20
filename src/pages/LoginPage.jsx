import { Button, Form, Input, App, Alert } from 'antd'
import React, { useState } from 'react'
import { handleLogin } from '../api/auth_api';
import { useNavigate } from 'react-router';

const LoginPage = () => {
    const { message: messageApi } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div style={{
                width: "400px",
                padding: "40px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '30px'
                }}>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '8px'
                    }}>
                        管理者ログイン
                    </h1>
                    <p style={{ color: '#666', margin: 0 }}>
                        管理者アカウントでログインしてください
                    </p>
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

                    <Form.Item style={{ marginBottom: 0, marginTop: '30px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{
                                width: '100%',
                                height: '48px',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            ログイン
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default LoginPage;
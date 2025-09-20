import { Button, Card, Col, Row } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router';
import DashboardStats from '../DashboardStats';

const HomeContent = () => {
    const navigate = useNavigate();

    const cardStyle = {
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 24px rgba(120, 194, 173, 0.15)',
        transition: 'all 0.3s ease',
        overflow: 'hidden'
    };

    return (
        <div className='home-content' style={{
            padding: '32px',
            background: 'linear-gradient(135deg, #f8fdf9 0%, #f0f9f1 100%)',
            minHeight: '100vh'
        }}>
            {/* 統計情報カード */}
            <DashboardStats />

            {/* システム管理セクション */}
            <Row gutter={[24, 24]} style={{ marginTop: '48px' }}>
                <Col xs={24}>
                    <Card
                        style={{
                            ...cardStyle,
                            background: 'linear-gradient(135deg, rgba(120, 194, 173, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)'
                        }}
                        styles={{ body: { padding: '32px' } }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{
                                color: '#2d5a3d',
                                marginBottom: '16px',
                                fontSize: '24px',
                                fontWeight: '600'
                            }}>
                                🌱 システム管理
                            </h2>
                            <p style={{
                                color: '#52a86f',
                                fontSize: '16px',
                                marginBottom: '24px',
                                lineHeight: '1.6'
                            }}>
                                管理者として、ユーザー、ワークショップ、スキルを効率的に管理できます。<br />
                                各カードをクリックして詳細な管理画面にアクセスしてください。
                            </p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '16px',
                                flexWrap: 'wrap'
                            }}>
                                <Button
                                    size="large"
                                    style={{
                                        background: 'linear-gradient(135deg, #78c2ad 0%, #66b397 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontWeight: '500',
                                        padding: '12px 32px',
                                        height: 'auto'
                                    }}
                                    onClick={() => navigate("/users")}
                                >
                                    👥 ユーザー管理
                                </Button>
                                <Button
                                    size="large"
                                    style={{
                                        background: 'linear-gradient(135deg, #78c2ad 0%, #66b397 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontWeight: '500',
                                        padding: '12px 32px',
                                        height: 'auto'
                                    }}
                                    onClick={() => navigate("/workshops")}
                                >
                                    📚 ワークショップ管理
                                </Button>
                                <Button
                                    size="large"
                                    style={{
                                        background: 'linear-gradient(135deg, #78c2ad 0%, #66b397 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontWeight: '500',
                                        padding: '12px 32px',
                                        height: 'auto'
                                    }}
                                    onClick={() => navigate("/skills")}
                                >
                                    🛠️ スキル管理
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HomeContent;
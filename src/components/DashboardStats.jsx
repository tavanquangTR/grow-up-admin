import React, { useState, useEffect, useRef } from 'react';
import { Card, Col, Row, Statistic, Spin, Alert, Button, Switch } from 'antd';
import { ReloadOutlined, UserOutlined, CalendarOutlined, ToolOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { fetchAllStats } from '../api/stats_api';
import { useNavigate } from 'react-router';

const DashboardStats = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        userCount: 0,
        workshopCount: 0,
        skillCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const intervalRef = useRef(null);

    // 自動更新の間隔（ミリ秒）
    const AUTO_REFRESH_INTERVAL = 30000; // 30秒

    // 統計データを取得する関数
    const fetchStats = async () => {
        setLoading(true);
        setError(null);

        try {
            // 新しい統計API を使用して一括取得
            const statsData = await fetchAllStats();

            setStats({
                userCount: statsData.userCount || 0,
                workshopCount: statsData.workshopCount || 0,
                skillCount: statsData.skillCount || 0
            });

            setLastUpdated(new Date());
            console.log('統計データを更新しました:', statsData);

        } catch (error) {
            console.error('統計データの取得に失敗:', error);
            setError('統計データの取得に失敗しました。サーバーが起動していることを確認してください。');
        } finally {
            setLoading(false);
        }
    };

    // コンポーネントマウント時にデータを取得
    useEffect(() => {
        fetchStats();
    }, []);

    // 自動更新の設定
    useEffect(() => {
        if (autoRefresh) {
            intervalRef.current = setInterval(() => {
                console.log('自動更新実行中...');
                fetchStats();
            }, AUTO_REFRESH_INTERVAL);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        // クリーンアップ
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [autoRefresh]);

    // 自動更新の切り替え
    const handleAutoRefreshToggle = (checked) => {
        setAutoRefresh(checked);
        if (checked) {
            console.log('自動更新を開始しました（30秒間隔）');
        } else {
            console.log('自動更新を停止しました');
        }
    };

    // カードスタイル
    const cardStyle = {
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 24px rgba(120, 194, 173, 0.15)',
        transition: 'all 0.3s ease',
        overflow: 'hidden'
    };

    // ホバーエフェクト
    const handleCardHover = (e, isEntering) => {
        if (isEntering) {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(120, 194, 173, 0.25)';
        } else {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(120, 194, 173, 0.15)';
        }
    };

    // エラー表示
    if (error && !loading) {
        return (
            <div style={{ padding: '32px' }}>
                <Alert
                    message="統計データの読み込みエラー"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button
                            size="small"
                            danger
                            onClick={fetchStats}
                            icon={<ReloadOutlined />}
                        >
                            再試行
                        </Button>
                    }
                    style={{ marginBottom: '24px' }}
                />
            </div>
        );
    }

    return (
        <div>
            {/* ヘッダー部分 */}
            <div style={{
                textAlign: 'center',
                marginBottom: '48px'
            }}>
                <h1 style={{
                    fontSize: '48px',
                    color: '#2d5a3d',
                    margin: '0 0 16px 0',
                    fontWeight: '600',
                    textShadow: '0 2px 4px rgba(45, 90, 61, 0.1)'
                }}>
                    📊 ダッシュボード
                </h1>
                <p style={{
                    fontSize: '18px',
                    color: '#52a86f',
                    margin: 0,
                    fontWeight: '300'
                }}>
                    システムの概要と主要な統計情報
                </p>

                {/* 最終更新時刻と再読み込みボタン */}
                <div style={{
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    fontSize: '14px',
                    color: '#6b8a7a',
                    flexWrap: 'wrap'
                }}>
                    {lastUpdated && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ClockCircleOutlined />
                            最終更新: {lastUpdated.toLocaleTimeString('ja-JP')}
                        </span>
                    )}
                    <Button
                        type="text"
                        icon={<ReloadOutlined />}
                        onClick={fetchStats}
                        loading={loading}
                        style={{
                            color: '#78c2ad',
                            fontSize: '14px'
                        }}
                    >
                        手動更新
                    </Button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>自動更新:</span>
                        <Switch
                            checked={autoRefresh}
                            onChange={handleAutoRefreshToggle}
                            size="small"
                            style={{
                                backgroundColor: autoRefresh ? '#78c2ad' : undefined
                            }}
                        />
                        {autoRefresh && (
                            <span style={{ fontSize: '12px', color: '#52c41a' }}>
                                (30秒間隔)
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* 統計カード */}
            <Row gutter={[24, 24]}>
                {/* ユーザー数カード */}
                <Col xs={24} sm={24} md={8}>
                    <Card
                        style={cardStyle}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                        styles={{ body: { padding: '32px 24px' } }}
                    >
                        <Spin spinning={loading}>
                            <div style={{ textAlign: 'center' }}>
                                <UserOutlined style={{
                                    fontSize: '48px',
                                    color: '#78c2ad',
                                    marginBottom: '16px'
                                }} />
                                <Statistic
                                    title={
                                        <span style={{
                                            color: '#2d5a3d',
                                            fontSize: '16px',
                                            fontWeight: '500'
                                        }}>
                                            登録ユーザー数
                                        </span>
                                    }
                                    value={stats.userCount}
                                    valueStyle={{
                                        color: '#78c2ad',
                                        fontSize: '36px',
                                        fontWeight: '700'
                                    }}
                                    suffix="人"
                                />
                                <Button
                                    type="primary"
                                    style={{
                                        marginTop: '16px',
                                        background: 'linear-gradient(135deg, #78c2ad 0%, #66b397 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '8px 24px',
                                        height: 'auto',
                                        fontWeight: '500',
                                        boxShadow: '0 4px 12px rgba(120, 194, 173, 0.3)'
                                    }}
                                    onClick={() => navigate("/users")}
                                >
                                    🔍 詳細を見る
                                </Button>
                            </div>
                        </Spin>
                    </Card>
                </Col>

                {/* ワークショップ数カード */}
                <Col xs={24} sm={24} md={8}>
                    <Card
                        style={cardStyle}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                        styles={{ body: { padding: '32px 24px' } }}
                    >
                        <Spin spinning={loading}>
                            <div style={{ textAlign: 'center' }}>
                                <CalendarOutlined style={{
                                    fontSize: '48px',
                                    color: '#78c2ad',
                                    marginBottom: '16px'
                                }} />
                                <Statistic
                                    title={
                                        <span style={{
                                            color: '#2d5a3d',
                                            fontSize: '16px',
                                            fontWeight: '500'
                                        }}>
                                            ワークショップ数
                                        </span>
                                    }
                                    value={stats.workshopCount}
                                    valueStyle={{
                                        color: '#78c2ad',
                                        fontSize: '36px',
                                        fontWeight: '700'
                                    }}
                                    suffix="件"
                                />
                                <Button
                                    type="primary"
                                    style={{
                                        marginTop: '16px',
                                        background: 'linear-gradient(135deg, #78c2ad 0%, #66b397 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '8px 24px',
                                        height: 'auto',
                                        fontWeight: '500',
                                        boxShadow: '0 4px 12px rgba(120, 194, 173, 0.3)'
                                    }}
                                    onClick={() => navigate("/workshops")}
                                >
                                    📖 詳細を見る
                                </Button>
                            </div>
                        </Spin>
                    </Card>
                </Col>

                {/* スキル数カード */}
                <Col xs={24} sm={24} md={8}>
                    <Card
                        style={cardStyle}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                        styles={{ body: { padding: '32px 24px' } }}
                    >
                        <Spin spinning={loading}>
                            <div style={{ textAlign: 'center' }}>
                                <ToolOutlined style={{
                                    fontSize: '48px',
                                    color: '#78c2ad',
                                    marginBottom: '16px'
                                }} />
                                <Statistic
                                    title={
                                        <span style={{
                                            color: '#2d5a3d',
                                            fontSize: '16px',
                                            fontWeight: '500'
                                        }}>
                                            スキル数
                                        </span>
                                    }
                                    value={stats.skillCount}
                                    valueStyle={{
                                        color: '#78c2ad',
                                        fontSize: '36px',
                                        fontWeight: '700'
                                    }}
                                    suffix="個"
                                />
                                <Button
                                    type="primary"
                                    style={{
                                        marginTop: '16px',
                                        background: 'linear-gradient(135deg, #78c2ad 0%, #66b397 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '8px 24px',
                                        height: 'auto',
                                        fontWeight: '500',
                                        boxShadow: '0 4px 12px rgba(120, 194, 173, 0.3)'
                                    }}
                                    onClick={() => navigate("/skills")}
                                >
                                    ⚒️ 詳細を見る
                                </Button>
                            </div>
                        </Spin>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardStats;
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, App } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { fetchAllWorkshops, deleteWorkshop } from '../api/workshop_api';
import WorkshopEditModal from './WorkshopEditModal';

const WorkshopManagement = () => {
    const { message: messageApi } = App.useApp();
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);
    const [isCreateMode, setIsCreateMode] = useState(false);

    useEffect(() => {
        loadWorkshops();
    }, []);

    const loadWorkshops = async () => {
        setLoading(true);
        try {
            const response = await fetchAllWorkshops();
            if (response?.data) {
                setWorkshops(response.data);
            }
        } catch (error) {
            messageApi.error('ワークショップ一覧の取得に失敗しました');
            console.error('Error loading workshops:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (workshop) => {
        setSelectedWorkshop(workshop);
        setIsCreateMode(false);
        setEditModalVisible(true);
    };

    const handleCreate = () => {
        setSelectedWorkshop(null);
        setIsCreateMode(true);
        setEditModalVisible(true);
    };

    const handleDelete = async (workshopId) => {
        try {
            await deleteWorkshop(workshopId);
            messageApi.success('ワークショップを削除しました');
            loadWorkshops(); // リストを再読み込み
        } catch (error) {
            messageApi.error('ワークショップの削除に失敗しました');
            console.error('Error deleting workshop:', error);
        }
    };

    const handleModalClose = (shouldReload = false) => {
        setEditModalVisible(false);
        setSelectedWorkshop(null);
        setIsCreateMode(false);
        if (shouldReload) {
            loadWorkshops();
        }
    };

    const columns = [
        {
            title: 'ワークショップ名',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            ellipsis: true,
            render: (name) => (
                <div style={{ fontWeight: 'bold' }}>
                    <CalendarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    {name}
                </div>
            ),
        },
        {
            title: '説明',
            dataIndex: 'description',
            key: 'description',
            width: 300,
            ellipsis: true,
            responsive: ['md'],
            render: (description) => description || '-',
        },
        {
            title: '開催日時',
            dataIndex: 'date',
            key: 'date',
            width: 180,
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
            render: (date) => {
                if (!date) return '-';
                const dateObj = new Date(date);
                const formattedDate = dateObj.toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const isUpcoming = dateObj > new Date();
                return (
                    <div style={{ color: isUpcoming ? '#52c41a' : '#8c8c8c' }}>
                        {formattedDate}
                        {isUpcoming && <Tag color="green" style={{ marginLeft: '8px' }}>予定</Tag>}
                    </div>
                );
            },
        },
        {
            title: '主催者',
            dataIndex: 'host',
            key: 'host',
            width: 150,
            ellipsis: true,
            responsive: ['lg'],
            render: (host) => {
                if (!host) return '-';
                return (
                    <div>
                        <UserOutlined style={{ marginRight: '4px' }} />
                        {host.name}
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            {host.email}
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'アクション',
            key: 'action',
            width: 140,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small" direction="vertical">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                        block
                    >
                        編集
                    </Button>
                    <Popconfirm
                        title="ワークショップを削除しますか？"
                        description="この操作は取り消せません。"
                        onConfirm={() => handleDelete(record.id)}
                        okText="削除"
                        cancelText="キャンセル"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            block
                        >
                            削除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '16px' }}>
            <div style={{
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px'
                }}>
                    <h2 style={{ margin: 0, fontSize: 'clamp(18px, 4vw, 24px)' }}>ワークショップ管理</h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        style={{ minWidth: '140px' }}
                    >
                        新規ワークショップ作成
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={workshops}
                rowKey="id"
                loading={loading}
                scroll={{ x: 800, y: 'calc(100vh - 300px)' }}
                size="small"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} / ${total} 件`,
                    responsive: true,
                }}
            />

            <WorkshopEditModal
                visible={editModalVisible}
                workshop={selectedWorkshop}
                isCreateMode={isCreateMode}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default WorkshopManagement;
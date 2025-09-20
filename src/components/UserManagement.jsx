import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Avatar, message, Popconfirm, App } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { fetchAllUser, deleteUser } from '../api/user_api';
import UserEditModal from './UserEditModal';

const UserManagement = () => {
    const { message: messageApi } = App.useApp();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isCreateMode, setIsCreateMode] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await fetchAllUser();
            if (response?.data) {
                setUsers(response.data);
            }
        } catch (error) {
            messageApi.error('ユーザー一覧の取得に失敗しました');
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsCreateMode(false);
        setEditModalVisible(true);
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setIsCreateMode(true);
        setEditModalVisible(true);
    };

    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId);
            messageApi.success('ユーザーを削除しました');
            loadUsers(); // リストを再読み込み
        } catch (error) {
            messageApi.error('ユーザーの削除に失敗しました');
            console.error('Error deleting user:', error);
        }
    };

    const handleModalClose = (shouldReload = false) => {
        setEditModalVisible(false);
        setSelectedUser(null);
        setIsCreateMode(false);
        if (shouldReload) {
            loadUsers();
        }
    };

    const getRoleColor = (role) => {
        return role === 'ADMIN' ? 'red' : 'blue';
    };

    const columns = [
        {
            title: 'プロフィール画像',
            dataIndex: 'profileImageUrl',
            key: 'profileImageUrl',
            width: 80,
            responsive: ['md'],
            render: (profileImageUrl) => (
                <Avatar
                    src={profileImageUrl || null}
                    icon={<UserOutlined />}
                    size={40}
                />
            ),
        },
        {
            title: '名前',
            dataIndex: 'name',
            key: 'name',
            width: 120,
            ellipsis: true,
        },
        {
            title: 'メールアドレス',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            ellipsis: true,
            responsive: ['lg'],
        },
        {
            title: 'ロール',
            dataIndex: 'role',
            key: 'role',
            width: 80,
            render: (role) => (
                <Tag color={getRoleColor(role)}>
                    {role}
                </Tag>
            ),
        },
        {
            title: '部署',
            dataIndex: 'department',
            key: 'department',
            width: 100,
            ellipsis: true,
            responsive: ['md'],
            render: (department) => department || '-',
        },
        {
            title: '役職',
            dataIndex: 'position',
            key: 'position',
            width: 100,
            ellipsis: true,
            responsive: ['lg'],
            render: (position) => position || '-',
        },
        {
            title: 'フォロワー数',
            dataIndex: 'followerCount',
            key: 'followerCount',
            width: 90,
            align: 'center',
            responsive: ['xl'],
        },
        {
            title: 'フォロー数',
            dataIndex: 'followingCount',
            key: 'followingCount',
            width: 90,
            align: 'center',
            responsive: ['xl'],
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
                        title="ユーザーを削除しますか？"
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
                    <h2 style={{ margin: 0, fontSize: 'clamp(18px, 4vw, 24px)' }}>ユーザー管理</h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        style={{ minWidth: '120px' }}
                    >
                        新規ユーザー作成
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={users}
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

            <UserEditModal
                visible={editModalVisible}
                user={selectedUser}
                isCreateMode={isCreateMode}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default UserManagement;
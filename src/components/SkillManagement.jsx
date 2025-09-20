import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, App } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, BookOutlined, CodeOutlined } from '@ant-design/icons';
import { fetchAllSkills, deleteSkill } from '../api/skill_api';
import SkillEditModal from './SkillEditModal';

const SkillManagement = () => {
    const { message: messageApi } = App.useApp();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [isCreateMode, setIsCreateMode] = useState(false);

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        setLoading(true);
        try {
            const response = await fetchAllSkills();
            if (response?.data) {
                // Sort skills by name for better user experience
                const sortedSkills = response.data.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setSkills(sortedSkills);
            }
        } catch (error) {
            messageApi.error('スキル一覧の取得に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (skill) => {
        setSelectedSkill(skill);
        setIsCreateMode(false);
        setEditModalVisible(true);
    };

    const handleCreate = () => {
        setSelectedSkill(null);
        setIsCreateMode(true);
        setEditModalVisible(true);
    };

    const handleDelete = async (skillId) => {
        try {
            await deleteSkill(skillId);
            messageApi.success('スキルを削除しました');
            loadSkills(); // リストを再読み込み
        } catch (error) {
            messageApi.error('スキルの削除に失敗しました');
        }
    };

    const handleModalClose = (shouldReload = false) => {
        setEditModalVisible(false);
        setSelectedSkill(null);
        setIsCreateMode(false);
        if (shouldReload) {
            loadSkills();
        }
    };

    // Clean skill name - remove extra quotes or JSON formatting
    const cleanSkillName = (name) => {
        if (!name) return '';

        // Remove surrounding quotes
        let cleanName = name.replace(/^"|"$/g, '');

        // Try to parse if it looks like JSON
        if (cleanName.startsWith('{') && cleanName.endsWith('}')) {
            try {
                const parsed = JSON.parse(cleanName);
                if (parsed.NAME) return parsed.NAME;
                if (parsed.name) return parsed.name;
            } catch (e) {
                // If parsing fails, return the original clean name
            }
        }

        return cleanName;
    };

    const getSkillCategory = (skillName) => {
        const name = cleanSkillName(skillName).toUpperCase();
        const categories = {
            'FRONTEND': ['REACT', 'VUE', 'ANGULAR', 'HTML', 'CSS', 'JAVASCRIPT', 'TYPESCRIPT'],
            'BACKEND': ['JAVA', 'PYTHON', 'GO', 'NODE', 'PHP', 'RUBY', 'C#'],
            'MOBILE': ['SWIFT', 'KOTLIN', 'DART', 'FLUTTER', 'REACT NATIVE'],
            'DATABASE': ['MYSQL', 'POSTGRESQL', 'MONGODB', 'REDIS'],
            'DEVOPS': ['DOCKER', 'KUBERNETES', 'AWS', 'GCP', 'AZURE']
        };

        for (const [category, skills] of Object.entries(categories)) {
            if (skills.some(skill => name.includes(skill))) {
                return category;
            }
        }
        return 'OTHER';
    };

    const getCategoryColor = (category) => {
        const colors = {
            'FRONTEND': 'blue',
            'BACKEND': 'green',
            'MOBILE': 'purple',
            'DATABASE': 'orange',
            'DEVOPS': 'red',
            'OTHER': 'default'
        };
        return colors[category] || 'default';
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: (a, b) => a.id - b.id,
            responsive: ['md'],
        },
        {
            title: 'スキル名',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            render: (name, record) => {
                const cleanName = cleanSkillName(name);
                const category = getSkillCategory(name);
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CodeOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                {cleanName}
                            </div>
                            <Tag
                                color={getCategoryColor(category)}
                                size="small"
                                style={{ fontSize: '10px', marginTop: '2px' }}
                            >
                                {category}
                            </Tag>
                        </div>
                    </div>
                );
            },
        },
        {
            title: '元データ',
            dataIndex: 'name',
            key: 'rawName',
            width: 200,
            ellipsis: true,
            responsive: ['lg'],
            render: (name) => (
                <code style={{
                    fontSize: '12px',
                    background: '#f5f5f5',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    color: '#666'
                }}>
                    {name}
                </code>
            ),
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
                        title="スキルを削除しますか？"
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

    const skillStats = skills.reduce((acc, skill) => {
        const category = getSkillCategory(skill.name);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

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
                    <h2 style={{ margin: 0, fontSize: 'clamp(18px, 4vw, 24px)' }}>
                        <BookOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        スキル管理
                    </h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        style={{ minWidth: '120px' }}
                    >
                        新規スキル作成
                    </Button>
                </div>

                {/* スキル統計情報 */}
                <div style={{
                    background: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    alignItems: 'center'
                }}>
                    <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
                        総数: {skills.length}
                    </span>
                    {Object.entries(skillStats).map(([category, count]) => (
                        <Tag
                            key={category}
                            color={getCategoryColor(category)}
                            style={{ margin: 0 }}
                        >
                            {category}: {count}
                        </Tag>
                    ))}
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={skills}
                rowKey="id"
                loading={loading}
                scroll={{ x: 600, y: 'calc(100vh - 350px)' }}
                size="small"
                pagination={{
                    pageSize: 15,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} / ${total} 件`,
                    responsive: true,
                }}
            />

            <SkillEditModal
                visible={editModalVisible}
                skill={selectedSkill}
                isCreateMode={isCreateMode}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default SkillManagement;
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, App, Space, Select } from 'antd';
import { BookOutlined, CodeOutlined } from '@ant-design/icons';
import { createSkill, updateSkill } from '../api/skill_api';

const { Option } = Select;

const SkillEditModal = ({ visible, skill, isCreateMode, onClose }) => {
    const { message: messageApi } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Common skills for quick selection
    const commonSkills = [
        { category: 'Frontend', skills: ['React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS'] },
        { category: 'Backend', skills: ['Java', 'Python', 'Go', 'Node.js', 'PHP', 'Ruby', 'C#', '.NET'] },
        { category: 'Mobile', skills: ['Swift', 'Kotlin', 'Dart', 'Flutter', 'React Native'] },
        { category: 'Database', skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle'] },
        { category: 'DevOps', skills: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Jenkins'] },
        { category: 'Other', skills: ['Git', 'Linux', 'Agile', 'Scrum'] }
    ];

    useEffect(() => {
        if (visible) {
            if (isCreateMode) {
                form.resetFields();
            } else if (skill) {
                // Clean the skill name when editing
                const cleanName = cleanSkillName(skill.name);
                form.setFieldsValue({
                    name: cleanName,
                });
            }
        }
    }, [visible, skill, isCreateMode, form]);

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

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const skillData = {
                id: isCreateMode ? 0 : skill.id,
                name: values.name.trim(),
            };

            if (isCreateMode) {
                await createSkill(skillData);
                messageApi.success('スキルを作成しました');
            } else {
                await updateSkill(skill.id, skillData);
                messageApi.success('スキル情報を更新しました');
            }

            onClose(true); // 成功時はリロードを指示
        } catch (error) {
            messageApi.error(
                isCreateMode
                    ? 'スキルの作成に失敗しました'
                    : 'スキルの更新に失敗しました'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose(false);
    };

    const handleQuickSelect = (skillName) => {
        form.setFieldsValue({ name: skillName });
    };

    return (
        <Modal
            title={isCreateMode ? '新規スキル作成' : 'スキル編集'}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width="90%"
            style={{ maxWidth: '600px' }}
            destroyOnHidden
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ maxHeight: '70vh', overflowY: 'auto', padding: '0 8px' }}
            >
                {/* スキルアイコン表示 */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    padding: '16px',
                    background: '#f5f5f5',
                    borderRadius: '8px'
                }}>
                    <BookOutlined
                        style={{
                            fontSize: '48px',
                            color: '#1890ff',
                            marginBottom: '8px'
                        }}
                    />
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        {isCreateMode ? '新しいスキルを作成' : 'スキルを編集'}
                    </div>
                </div>

                <Form.Item
                    name="name"
                    label="スキル名"
                    rules={[
                        { required: true, message: 'スキル名を入力してください' },
                        { min: 1, message: 'スキル名は1文字以上で入力してください' },
                        { max: 50, message: 'スキル名は50文字以内で入力してください' }
                    ]}
                >
                    <Input
                        placeholder="例: React, Java, Python"
                        prefix={<CodeOutlined style={{ color: '#8c8c8c' }} />}
                    />
                </Form.Item>

                {/* よく使用されるスキルの候補 */}
                {isCreateMode && (
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ marginBottom: '12px', fontWeight: 'bold', fontSize: '14px' }}>
                            よく使用されるスキル（クリックで入力）:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {commonSkills.map((category) => (
                                <div key={category.category}>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#666',
                                        marginBottom: '6px',
                                        fontWeight: 'bold'
                                    }}>
                                        {category.category}:
                                    </div>
                                    <Space wrap size="small">
                                        {category.skills.map((skillName) => (
                                            <Button
                                                key={skillName}
                                                size="small"
                                                type="dashed"
                                                onClick={() => handleQuickSelect(skillName)}
                                                style={{ fontSize: '12px' }}
                                            >
                                                {skillName}
                                            </Button>
                                        ))}
                                    </Space>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Form.Item style={{
                    textAlign: 'right',
                    marginBottom: 0,
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '1px solid #f0f0f0'
                }}>
                    <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={handleCancel}
                            style={{ minWidth: '80px' }}
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{ minWidth: '80px' }}
                        >
                            {isCreateMode ? '作成' : '更新'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SkillEditModal;
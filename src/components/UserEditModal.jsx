import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Avatar, App, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { createUser, updateUser } from '../api/user_api';

const { TextArea } = Input;
const { Option } = Select;

const UserEditModal = ({ visible, user, isCreateMode, onClose }) => {
    const { message: messageApi } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [backgroundImageUrl, setBackgroundImageUrl] = useState('');

    useEffect(() => {
        if (visible) {
            if (isCreateMode) {
                form.resetFields();
                setProfileImageUrl('');
                setBackgroundImageUrl('');
            } else if (user) {
                form.setFieldsValue({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department,
                    position: user.position,
                    introduction: user.introduction,
                });
                setProfileImageUrl(user.profileImageUrl || '');
                setBackgroundImageUrl(user.backgroundImageUrl || '');
            }
        }
    }, [visible, user, isCreateMode, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const userData = {
                name: values.name,
                email: values.email,
                birthday: values.birthday,
                gender: values.gender,
                phoneNumber: values.phoneNumber,
                address: values.address,
                biography: values.biography
            }; if (isCreateMode) {
                await createUser(userData);
                messageApi.success('ユーザーを作成しました');
            } else {
                await updateUser(user.id, userData);
                messageApi.success('ユーザー情報を更新しました');
            }

            onClose(true); // 成功時はリロードを指示
        } catch (error) {
            console.error('Error saving user:', error);
            messageApi.error(
                isCreateMode
                    ? 'ユーザーの作成に失敗しました'
                    : 'ユーザーの更新に失敗しました'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose(false);
    };



    return (
        <Modal
            title={isCreateMode ? '新規ユーザー作成' : 'ユーザー編集'}
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
                initialValues={{
                    role: 'USER'
                }}
                style={{ maxHeight: '70vh', overflowY: 'auto', padding: '0 8px' }}
            >
                {/* プロフィール画像表示（編集不可） */}
                {!isCreateMode && (
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '24px',
                        padding: '16px',
                        background: '#f5f5f5',
                        borderRadius: '8px'
                    }}>
                        <Avatar
                            size={{ xs: 60, sm: 70, md: 80 }}
                            src={profileImageUrl || null}
                            icon={<UserOutlined />}
                            style={{ marginBottom: '8px' }}
                        />
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            現在のプロフィール画像
                        </div>
                    </div>
                )}

                <Form.Item
                    name="name"
                    label="名前"
                    rules={[{ required: true, message: '名前を入力してください' }]}
                >
                    <Input placeholder="山田 太郎" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="メールアドレス"
                    rules={
                        isCreateMode ? [
                            { required: true, message: 'メールアドレスを入力してください' },
                            { type: 'email', message: '正しいメールアドレスを入力してください' }
                        ] : []
                    }
                >
                    <Input
                        placeholder="taro.yamada@example.com"
                        disabled={!isCreateMode}
                    />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="ロール"
                    rules={[{ required: true, message: 'ロールを選択してください' }]}
                >
                    <Select>
                        <Option value="USER">USER</Option>
                        <Option value="ADMIN">ADMIN</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="department"
                    label="部署"
                >
                    <Input placeholder="営業部" />
                </Form.Item>

                <Form.Item
                    name="position"
                    label="役職"
                >
                    <Input placeholder="主任" />
                </Form.Item>

                <Form.Item
                    name="introduction"
                    label="自己紹介"
                >
                    <TextArea
                        rows={4}
                        placeholder="営業一筋5年。お客様の課題解決を得意としています。"
                    />
                </Form.Item>



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

export default UserEditModal;
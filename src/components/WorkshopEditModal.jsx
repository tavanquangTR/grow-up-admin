import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, App, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { createWorkshop, updateWorkshop } from '../api/workshop_api';
import dayjs from 'dayjs';

const { TextArea } = Input;

const WorkshopEditModal = ({ visible, workshop, isCreateMode, onClose }) => {
    const { message: messageApi } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            if (isCreateMode) {
                form.resetFields();
            } else if (workshop) {
                form.setFieldsValue({
                    name: workshop.name,
                    description: workshop.description,
                    date: workshop.date ? dayjs(workshop.date) : null,
                });
            }
        }
    }, [visible, workshop, isCreateMode, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const workshopData = {
                name: values.name,
                description: values.description || null,
                date: values.date ? values.date.toISOString() : null,
            };

            if (isCreateMode) {
                await createWorkshop(workshopData);
                messageApi.success('ワークショップを作成しました');
            } else {
                await updateWorkshop(workshop.id, workshopData);
                messageApi.success('ワークショップ情報を更新しました');
            }

            onClose(true); // 成功時はリロードを指示
        } catch (error) {
            console.error('Error saving workshop:', error);
            messageApi.error(
                isCreateMode
                    ? 'ワークショップの作成に失敗しました'
                    : 'ワークショップの更新に失敗しました'
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
            title={isCreateMode ? '新規ワークショップ作成' : 'ワークショップ編集'}
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
                {/* ワークショップアイコン表示 */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    padding: '16px',
                    background: '#f5f5f5',
                    borderRadius: '8px'
                }}>
                    <CalendarOutlined
                        style={{
                            fontSize: '48px',
                            color: '#1890ff',
                            marginBottom: '8px'
                        }}
                    />
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        {isCreateMode ? '新しいワークショップを作成' : 'ワークショップを編集'}
                    </div>
                </div>

                <Form.Item
                    name="name"
                    label="ワークショップ名"
                    rules={[{ required: true, message: 'ワークショップ名を入力してください' }]}
                >
                    <Input placeholder="React基礎講座" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="説明"
                    rules={[{ required: true, message: '説明を入力してください' }]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Reactの基本概念から実践的な使い方まで学習します。"
                    />
                </Form.Item>

                <Form.Item
                    name="date"
                    label="開催日時"
                    rules={[{ required: true, message: '開催日時を選択してください' }]}
                >
                    <DatePicker
                        showTime={{
                            format: 'HH:mm',
                            minuteStep: 15,
                        }}
                        format="YYYY/MM/DD HH:mm"
                        placeholder="開催日時を選択"
                        style={{ width: '100%' }}
                        disabledDate={(current) => {
                            // 過去の日付を無効化
                            return current && current.isBefore(dayjs().startOf('day'));
                        }}
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

export default WorkshopEditModal;
import { Button, Space, Table, Tag, Input, Typography, Tooltip, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import "../../assets/styles/app.css";
import { fetchAllUser } from "../../api/user_api.js";
import { useEffect, useState, useRef } from "react";

const { Title } = Typography;

const UserTable = ({ userData }) => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                const result = await fetchAllUser();
                console.log(">>>Check result", result);

                if (result && Array.isArray(result)) {
                    const temp = result.map((el, index) => ({
                        key: index.toString(),
                        id: el.id || index.toString(),
                        name: el.name || 'N/A',
                        email: el.email || 'N/A',
                        department: el.department || 'N/A',
                        position: el.position || 'N/A',
                        role: el.role || 'user'
                    }));
                    setDataSource(temp);
                } else {
                    message.error('ユーザーデータの取得に失敗しました');
                    setDataSource([]);
                }
            } catch (error) {
                console.error("Error loading users:", error);
                message.error('データの読み込み中にエラーが発生しました');
                setDataSource([]);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`検索...`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        検索
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        リセット
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchText ? (
                <Tooltip title={text}>
                    <span>
                        {text.toString().split(new RegExp(`(${searchText})`, 'gi')).map((fragment, i) =>
                            fragment.toLowerCase() === searchText.toLowerCase() ? (
                                <span key={i} className="highlight">{fragment}</span>
                            ) : (
                                fragment
                            )
                        )}
                    </span>
                </Tooltip>
            ) : (
                <Tooltip title={text}>{text}</Tooltip>
            ),
    });

    const handleEdit = (record) => {
        message.info(`${record.name} の編集`);
        // 編集処理をここに実装
    };

    const handleDelete = (record) => {
        message.warning(`${record.name} を削除しますか？`);
        // 削除処理をここに実装
    };

    const columns = [
        {
            title: '氏名',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            render: (text, record) => (
                <Space>
                    <UserOutlined />
                    <a>{text}</a>
                </Space>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'メール',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
            responsive: ['md'],
        },
        {
            title: '部署',
            dataIndex: 'department',
            key: 'department',
            ...getColumnSearchProps('department'),
            responsive: ['md'],
        },
        {
            title: 'ポジション',
            key: 'position',
            dataIndex: 'position',
            responsive: ['lg'],
        },
        {
            title: '権限',
            key: 'role',
            dataIndex: "role",
            render: (role) => {
                let color = 'blue';
                if (role === 'admin') {
                    color = 'red';
                } else if (role === 'manager') {
                    color = 'orange';
                }
                return <Tag color={color}>{role.toUpperCase()}</Tag>;
            },
            filters: [
                { text: 'ADMIN', value: 'admin' },
                { text: 'MANAGER', value: 'manager' },
                { text: 'USER', value: 'user' },
            ],
            onFilter: (value, record) => record.role.indexOf(value) === 0,
        },
        {
            title: 'アクション',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        編集
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    >
                        削除
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="user-table-container">
            <style jsx>{`
                .user-table-container {
                    padding: 16px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                
                .table-header {
                    margin-bottom: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                :global(.highlight) {
                    background-color: #ffc069;
                    padding: 0;
                }
            `}</style>

            <div className="table-header">
                <Title level={4}>ユーザー一覧</Title>
                <Button type="primary">+ 新規ユーザー</Button>
            </div>

            <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                rowKey="id"
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}件`,
                }}
                scroll={{ x: 'max-content' }}
                bordered
                size="middle"
            />
        </div>
    );
};

export default UserTable;
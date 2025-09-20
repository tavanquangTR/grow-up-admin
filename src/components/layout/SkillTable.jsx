import { Button, Space, Table, Tag } from "antd";
import "../../assets/styles/app.css";

const SkillTable = ({ userData }) => {
    const columns = [
        {
            title: 'スキル名',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },

        {
            title: 'アクション',
            key: 'action',
            dataIndex: "action",
            render: text => <a>
                <Button>edit</Button>
                <Button>delete</Button>

            </a>,
        },
    ];
    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
            role: "User",
            action: "delete"
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
    ];

    return <Table columns={columns} dataSource={data} />;

};

export default SkillTable;
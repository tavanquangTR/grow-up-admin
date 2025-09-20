import { Button, Space, Table, Tag } from "antd";
import "../../assets/styles/app.css";
import { BookTwoTone } from "@ant-design/icons";

const WorkshopTable = ({ userData }) => {
    const columns = [
        {
            title: '勉強会名',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: '詳細',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '開催者',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '開催日',
            key: 'tags',
            dataIndex: 'tags',

        },
        {
            title: 'アクション',
            key: 'action',
            dataIndex: 'action',
            render: text => <a>
                <Button>edit</Button>
                <Button>delete</Button>

            </a>,

        }
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

export default WorkshopTable;
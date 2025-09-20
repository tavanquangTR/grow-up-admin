import React, { useState } from 'react'
import UserTable from '../layout/UserTable'
import { Button, Modal } from 'antd'
import '../../assets/styles/app.css'

const UserContent = () => {
    const [isShow, setIsShow] = useState(false);
    const showModal = () => {
        setIsShow(!isShow);
    }
    const closeModal = () => {
        setIsShow(false);
    }

    return (
        <div className='form-table'>
            <div className='table-header'>
                <strong>ユーザー一覧</strong>
                <Button onClick={showModal} type='primary'>ユーザー作成</Button>
            </div>
            <hr />
            <UserTable />
            <Modal
                title="ユーザー作成"
                closable={true}
                open={isShow}
                onOk={closeModal}
                onCancel={closeModal}
            ></Modal>
        </div>

    )
}

export default UserContent
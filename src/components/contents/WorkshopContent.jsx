import React, { useState } from 'react'
import WorkshopTable from '../layout/WorkshopTable'
import { Button, Modal } from 'antd'

const WorkshopContent = () => {
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
                <strong>勉強会一覧</strong>
                <Button onClick={showModal} type='primary'>勉強会作成</Button>
            </div>
            <hr />
            <WorkshopTable />
            <Modal
                title="勉強会作成"
                closable={true}
                open={isShow}
                onOk={closeModal}
                onCancel={closeModal}
            ></Modal>
        </div>
    )
}

export default WorkshopContent
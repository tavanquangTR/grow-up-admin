import React, { useState } from 'react'
import SkillTable from '../layout/SkillTable'
import '../../assets/styles/app.css'
import { Button, Modal } from 'antd'

const SkillContent = () => {
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
                <strong>スキル一覧</strong>
                <Button onClick={showModal} type='primary'>スキル作成</Button>
            </div>
            <hr />
            <SkillTable />
            <Modal
                title="スキル作成"
                closable={true}
                open={isShow}
                onOk={closeModal}
                onCancel={closeModal}
            ></Modal>
        </div>
    )
}

export default SkillContent
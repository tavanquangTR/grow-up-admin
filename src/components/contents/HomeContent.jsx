import { Button, Card, Col, Row } from 'antd'
import React from 'react'
import { useNavigate, useOutletContext } from 'react-router';
import { countUsersAPI } from '../../api/user_api';

const HomeContent = () => {
    const naviagte = useNavigate();


    const [userNum, workshopNum, skillNum] = useOutletContext();

    return (
        <div className='home-content'>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title={`Users (${userNum})`} variant="borderless">
                        <Button onClick={() => { naviagte("/users"); }}>詳細</Button>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={`Workshops (${workshopNum})`} variant="borderless">

                        <Button onClick={() => { naviagte("/workshops"); }}>詳細</Button>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={`Skills (${skillNum})`} variant="borderless">

                        <Button onClick={() => { naviagte("/skills"); }}>詳細</Button>
                    </Card>
                </Col>
            </Row>

        </div >
    )
}

export default HomeContent
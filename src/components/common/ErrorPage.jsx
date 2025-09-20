import { Button, Result } from 'antd'
import React from 'react'
import { Link } from 'react-router'

const ErrorPage = () => {
    return (
        <div>
            <Result
                status="500"
                title="500"
                subTitle="Sorry, something went wrong."
                extra={<Button type='primary'><Link to="/">Back Home</Link></Button>}
            />
        </div>
    )
}

export default ErrorPage

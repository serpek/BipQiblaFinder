import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Button, Drawer, Layout, Menu, MenuProps } from 'antd'
import { MenuOutlined } from '@ant-design/icons'

import './BasicLayout.scss'

const { Header, Content, Footer } = Layout

const BasicLayout: React.FC = () => {
  const appVersion = import.meta.env.APP_VERSION || 'Bilinmeyen Versiyon'

  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const goto = (path: string) => {
    navigate(path)
    onClose()
  }

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
  }

  return (
    <>
      <Layout className="layout-main">
        <Header className="layout-header">
          <Button
            type="text"
            variant="text"
            color="green"
            icon={<MenuOutlined />}
            onClick={showDrawer}
          />
        </Header>

        <Content className="layout-content">
          <Outlet />
        </Content>

        <Footer className="layout-footer"></Footer>
        <Drawer
          title="BiP Kıble Bul"
          size="default"
          styles={{
            content: { backgroundColor: '#fafafa' }
          }}
          placement="left"
          onClose={onClose}
          open={open}>
          <div className="drawer-logo"></div>
          <p style={{ textAlign: 'center' }}>
            <small>v.{appVersion}</small>
          </p>
          <Menu
            onClick={onClick}
            items={[
              {
                key: 'm0',
                label: 'Kıble Bul',
                onClick: () => goto('/')
              },
              // {
              //   key: 'm10',
              //   label: 'blank',
              //   onClick: () => goto('blank/')
              // },
              { type: 'divider' },
              {
                key: 'm21',
                label: 'Kıble Pusulası nasıl çalışır?',
                onClick: () => goto('/how-does-it-work')
              }
              // {
              //   key: 'm22',
              //   label: 'Terms of Use',
              //   onClick: () => goto('/terms')
              // },
              // {
              //   key: 'm23',
              //   label: ' Privacy Notice',
              //   onClick: () => goto('/privacy')
              // },
              // {
              //   key: 'm24',
              //   label: 'Cookie Policy',
              //   onClick: () => goto('/cookie')
              // }
            ]}
            style={{ border: 0, background: 'transparent' }}
          />
        </Drawer>
      </Layout>
    </>
  )
}

export default BasicLayout

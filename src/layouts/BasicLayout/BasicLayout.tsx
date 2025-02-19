import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Button, Drawer, Image, Layout, Menu, MenuProps } from 'antd'
import { MenuOutlined } from '@ant-design/icons'

import './BasicLayout.scss'

const { Header, Content, Footer } = Layout

const BasicLayout: React.FC = () => {
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

      <Footer className="layout-footer">
        <Image
          preview={false}
          alt="Bip Message"
          width={100}
          src="/assets/bip_logo.png"
        />
      </Footer>
      <Drawer
        title="Bip Kıble Bul"
        size="default"
        styles={{
          content: { backgroundColor: '#fafafa' }
        }}
        placement="left"
        onClose={onClose}
        open={open}>
        <div style={{ textAlign: 'center', marginBottom: 100 }}>
          <Image
            preview={false}
            alt="Bip Message"
            width={150}
            src="/assets/bip_ramadan_logo.png"
          />
        </div>
        <Menu
          onClick={onClick}
          items={[
            {
              key: 'm0',
              label: 'Kıble Bul',
              onClick: () => goto('/')
            },
            { type: 'divider' },
            {
              key: 'm2',
              label: 'Terms of Use',
              onClick: () => goto('/terms')
            },
            {
              key: 'm3',
              label: ' Privacy Notice',
              onClick: () => goto('/privacy')
            },
            {
              key: 'm4',
              label: 'Cookie Policy',
              onClick: () => goto('/cookie')
            }
          ]}
          style={{ border: 0, background: 'transparent' }}
        />
      </Drawer>
    </Layout>
  )
}

export default BasicLayout

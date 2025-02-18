import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Button, Drawer, Image, Layout, Menu, MenuProps } from 'antd'
import { MenuOutlined } from '@ant-design/icons'

import './BasicLayout.css'

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
    <Layout
      style={{
        height: '100vh',
        backgroundColor: 'transparent'
      }}>
      <Header className="layout-header">
        <Button
          type="text"
          variant="text"
          color="green"
          icon={<MenuOutlined />}
          onClick={showDrawer}
        />
      </Header>

      <Content style={{ padding: '20px', overflow: 'scroll', height: '100vh' }}>
        <Outlet />
      </Content>

      <Footer className="layout-footer">
        <p>
          <Image
            alt="Bip Message"
            width={200}
            src="/assets/bip_logo_beyaz.png"
          />
        </p>
      </Footer>
      <Drawer
        title="Bip Kıble Bul"
        size="default"
        placement="left"
        onClose={onClose}
        open={open}>
        <Menu
          onClick={onClick}
          items={[
            {
              key: 'm0',
              label: 'Home',
              onClick: () => goto('/')
            },
            {
              key: 'm10',
              label: 'Compass 0',
              onClick: () => goto('/q0')
            },
            {
              key: 'm11',
              label: 'Compass 1',
              onClick: () => goto('/q1')
            },
            {
              key: 'm12',
              label: 'Compass 2',
              onClick: () => goto('/q2')
            },
            {
              key: 'm13',
              label: 'Compass 3',
              onClick: () => goto('/q3')
            },
            {
              key: 'm14',
              label: 'Compass 4',
              onClick: () => goto('/q4')
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
          style={{ border: 0 }}
        />
      </Drawer>
    </Layout>
  )
}

export default BasicLayout

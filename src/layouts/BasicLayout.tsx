import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer, Layout, Menu, MenuProps } from "antd";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import './BasicLayout.css'

const { Header, Content, Footer } = Layout;

const BasicLayout: React.FC = () => {
  const [open, setOpen] = useState(false);
  let navigate = useNavigate();

  const goto = (path: string) => {
    navigate(path)
    onClose()
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header className="layout-header">
        <Button type="text" variant="text" icon={<MenuOutlined />} onClick={showDrawer} />
      </Header>

      <Content style={{ margin: '20px', overflow: 'scroll' }}>
        <Outlet />
      </Content>

      <Footer className="layout-footer">
        <p>Tüm Hakları Saklıdır @ 2025</p>
      </Footer>
      <Drawer title="Bip Kıble Bul" size="default" placement="left" onClose={onClose} open={open}>
        <Menu
          onClick={onClick}
          items={[
            {
              key: 'm0',
              label: 'Home',
              onClick: () => goto('/')
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
  );
};

export default BasicLayout;
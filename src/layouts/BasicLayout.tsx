import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer, Layout, Menu, MenuProps } from "antd";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import './BasicLayout.css'

const { Header, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'm1',
    label: 'Kullanım Koşulları'
  },
  {
    key: 'm2',
    label: 'Aydınlatma Metni'
  },
  {
    key: 'm3',
    label: 'Çerez Aydınlatma Metni'
  }
];

const BasicLayout: React.FC = () => {
  const [open, setOpen] = useState(false);
  let navigate = useNavigate();


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
              onClick: () => navigate('/')
            },
            {
              key: 'm1',
              label: 'Kible Yön Tayini',
              onClick: () => navigate('/q1')
            },
            { type: 'divider' },
            {
              key: 'm2',
              label: 'Terms of Use',
              onClick: () => navigate('/terms')
            },
            {
              key: 'm3',
              label: ' Privacy Notice',
              onClick: () => navigate('/privacy')
            },
            {
              key: 'm4',
              label: 'Cookie Policy',
              onClick: () => navigate('/cookie')
            }
          ]}
          style={{ border: 0 }}
        />
      </Drawer>
    </Layout>
  );
};

export default BasicLayout;
import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer, Layout, Menu, MenuProps } from "antd";
import { useState } from "react";
import { Outlet } from "react-router";
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
    <Layout>
      <Header className="layout-header">
        <Button type="text" variant="text" icon={<MenuOutlined />} onClick={showDrawer} />
      </Header>

      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <Outlet />
      </Content>

      <Footer className="layout-footer">
        <p>Tüm Hakları Saklıdır @ 2025</p>
      </Footer>
      <Drawer title="Bip Kıble Bul" size="default" placement="left" onClose={onClose} open={open}>
        <Menu
          onClick={onClick}
          items={items}
          style={{ border: 0 }}
        />
      </Drawer>
    </Layout>
  );
};

export default BasicLayout;
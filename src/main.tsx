import { createRoot } from 'react-dom/client'
import { ConfigProvider, ThemeConfig } from 'antd';
import trTR from 'antd/locale/tr_TR';

import './index.css'
import App from './App.tsx'
import LogRocket from 'logrocket';
import { BrowserRouter, Routes, Route } from 'react-router';
import BasicLayout from './layouts/BasicLayout.tsx';

LogRocket.init('r4dzqd/sample-app');

const config: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    fontFamily: 'Nunito'
  },
};

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={trTR} theme={config}>
    <BrowserRouter>
      <Routes>
        <Route element={<BasicLayout />}>
          <Route index element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ConfigProvider>,
)
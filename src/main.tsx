import { createRoot } from 'react-dom/client'
import { ConfigProvider, ThemeConfig } from 'antd';
import trTR from 'antd/locale/tr_TR';
import '@ant-design/v5-patch-for-react-19';

import './index.css'
import LogRocket from 'logrocket';
import { BrowserRouter, Routes, Route } from 'react-router';
import BasicLayout from './layouts/BasicLayout.tsx';
import { QiblaCompass, KibleYonTayini, CookiePolicy, PrivacyPolicy, TermsOfUse, QiblaFinder } from './pages';

import setupLogRocketReact from 'logrocket-react';

LogRocket.init('r4dzqd/sample-app');

setupLogRocketReact(LogRocket);
LogRocket.identify(location.origin);

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
          <Route index element={<QiblaCompass />} />
          <Route path='/q1' element={<KibleYonTayini />} />
          <Route path='/q2' element={<QiblaFinder />} />
          <Route path='/terms' element={<TermsOfUse />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/cookie' element={<CookiePolicy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ConfigProvider>,
)
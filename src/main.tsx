import { createRoot } from 'react-dom/client'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ClientJS } from 'clientjs'
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { ConfigProvider, ThemeConfig } from 'antd';
import trTR from 'antd/locale/tr_TR';
import '@ant-design/v5-patch-for-react-19';

import {BasicLayout} from './layouts';
import { QiblaCompass, CookiePolicy, PrivacyPolicy, TermsOfUse, Compass1, Compass2, Compass3 } from './pages';

import './index.css'

const client = new ClientJS();
const fingerprint = client.getFingerprint();

var CPU = client.getCPU(); // Get CPU Architecture

console.log( CPU );


LogRocket.init('r4dzqd/sample-app');
LogRocket.identify(`${fingerprint}`);

setupLogRocketReact(LogRocket);

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
          <Route path='/q1' element={<Compass1 />} />
          <Route path='/q2' element={<Compass2 />} />
          <Route path='/q3' element={<Compass3 />} />
          <Route path='/terms' element={<TermsOfUse />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/cookie' element={<CookiePolicy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ConfigProvider>,
)
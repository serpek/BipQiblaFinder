import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ClientJS } from 'clientjs'
import LogRocket from 'logrocket'
import { ConfigProvider, ThemeConfig } from 'antd'
import trTR from 'antd/locale/tr_TR'

import '@ant-design/v5-patch-for-react-19'

import { BasicLayout } from './layouts'
import {
  Compass0,
  Compass1,
  Compass2,
  Compass3,
  Compass4,
  CookiePolicy,
  PrivacyPolicy,
  QiblaCompass,
  TermsOfUse
} from './pages'

import './index.css'
import { ModalProvider } from './hooks'

const client = new ClientJS()
const fingerprint = client.getFingerprint()

LogRocket.init('r4dzqd/sample-app')
LogRocket.identify(`${fingerprint}`)

const config: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    fontFamily: 'Nunito'
  }
}

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={trTR} theme={config}>
    <ModalProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<BasicLayout />}>
            <Route index element={<QiblaCompass />} />
            <Route path="/q0" element={<Compass0 />} />
            <Route path="/q1" element={<Compass1 />} />
            <Route path="/q2" element={<Compass2 />} />
            <Route path="/q3" element={<Compass3 />} />
            <Route path="/q4" element={<Compass4 />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookie" element={<CookiePolicy />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  </ConfigProvider>
)

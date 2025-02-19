import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ClientJS } from 'clientjs'
import LogRocket from 'logrocket'
import { ConfigProvider, ThemeConfig } from 'antd'
import trTR from 'antd/locale/tr_TR'

import { BasicLayout } from './layouts'
import { ModalProvider } from './hooks'
import {
  Blank,
  CookiePolicy,
  PrivacyPolicy,
  QiblaCompass,
  TermsOfUse
} from './pages'

import '@ant-design/v5-patch-for-react-19'
import './index.css'

const client = new ClientJS()
const fingerprint = client.getFingerprint()

LogRocket.init('r4dzqd/sample-app')
LogRocket.identify(`${fingerprint}`)

const config: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    fontFamily: 'Nunito'
  },
  components: {
    Layout: {}
  }
}

createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={trTR} theme={config}>
    <ModalProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<BasicLayout />}>
            <Route index element={<QiblaCompass />} />
            <Route path="*" element={<QiblaCompass />} />
            <Route path="/b0" element={<Blank />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookie" element={<CookiePolicy />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  </ConfigProvider>
)

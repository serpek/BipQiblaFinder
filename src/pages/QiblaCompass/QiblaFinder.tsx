import React, { useEffect, useMemo, useState } from 'react'
import { useCookie, useGeolocation, useWindowSize } from 'react-use'
import {
  Button,
  Card,
  Col,
  Layout,
  notification,
  Row,
  Space,
  Spin,
  Statistic
} from 'antd'

import { useModal, useOrientation } from '../../hooks'
import { getDirectionName, Qibla } from '../../utils'
import { CompassWithHTML } from '../../components'
import { CalibrateView, ErrorView } from '../../views'

import './QiblaFinder.scss'

const Pusula: React.FC = () => {
  // const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
  //   useGeolocated({
  //     positionOptions: {
  //       enableHighAccuracy: true
  //     },
  //     userDecisionTimeout: 5000
  //   })
  const { modal } = useModal()
  const [api, contextHolder] = notification.useNotification()
  const [cookie, setCookie] = useCookie('_calibrated')

  const {
    loading: loadingGeolocation,
    error: errorGeolocation,
    latitude,
    longitude
  } = useGeolocation({ enableHighAccuracy: true })
  const {
    loading: loadingOrientation,
    error: errorOrientation,
    alpha,
    absolute,
    log,
    requestPermission
  } = useOrientation()
  const size = useWindowSize()

  const [debug, setDebug] = useState<boolean>(false)
  const [offset, setOffset] = useState<number>(0)
  const [deviceAngle, setDeviceAngle] = useState<number>(0)
  const [qiblaAngle, setQiblaAngle] = useState<number>(0)
  const [deviceDirection, setDeviceDirection] = useState<string>('')
  const [qiblaDirection, setQiblaDirection] = useState<string>('')

  useEffect(() => {
    setDebug(false)
    if (cookie) {
      api.destroy()
      setCookie('1', { expires: Date.now() + 60 * 10e3 })
      api.open({
        key: `open${Date.now()}`,
        message: '',
        description: 'Şimdi pusulanızın doğru yönü gösterdiğinden emin olalım.',
        placement: 'bottom',
        duration: 0,
        closeIcon: false,
        btn: (
          <Space>
            <Button
              type="link"
              size="small"
              onClick={() => {
                api.destroy()
                modal.info({
                  icon: null,
                  title: 'Pusulanızı Kalibre Edin',
                  content: <CalibrateView />
                })
              }}>
              Pusulayı kalibre et
            </Button>
          </Space>
        )
      })
    }
  }, [api, cookie, modal, setCookie])

  useEffect(() => {
    if (alpha) {
      const angle = (360 - (alpha + offset)) % 360
      const direction = getDirectionName(angle)
      setDeviceDirection(direction.name)
      setDeviceAngle(angle)
    }
  }, [offset, alpha])

  useEffect(() => {
    if (latitude && longitude) {
      const angle = Qibla.degreesFromTrueNorth(latitude, longitude)
      setQiblaAngle(angle)
      const direction = getDirectionName(angle)
      setQiblaDirection(direction.name)
    }
  }, [latitude, longitude])

  const isError = useMemo(() => {
    console.log({ errorGeolocation, errorOrientation })
    return !!(errorGeolocation || errorOrientation)
  }, [errorOrientation, errorGeolocation])

  const loading = useMemo(() => {
    return loadingGeolocation || loadingOrientation
  }, [loadingGeolocation, loadingOrientation])

  return (
    <>
      {isError && (
        <Button
          type="primary"
          key="console"
          onClick={() => requestPermission?.()}>
          Haydi Başlayalım
        </Button>
      )}
      <Spin spinning={loading} delay={500}>
        {contextHolder}
        {log}
        <Layout
          style={{
            backgroundColor: 'transparent'
          }}>
          {isError && (
            <ErrorView
              message={[
                errorGeolocation?.message,
                errorOrientation?.message
              ].filter((e) => typeof e === 'string')}
            />
          )}
          {!isError && (
            <>
              <CompassWithHTML
                angle={deviceAngle}
                qible={qiblaAngle}
                width={size.width - 60}
                height={size.width - 60}
              />

              {debug && (
                <>
                  <Row gutter={16} style={{ marginBottom: 5 }}>
                    <Col className="gutter-row" span={24}>
                      <Card bordered={false} title="Kalibrasyon Düzeltmesi">
                        <input
                          style={{ width: '100%' }}
                          type="range"
                          min="-50"
                          max="50"
                          value={offset}
                          onChange={(e) => setOffset(Number(e.target.value))}
                        />
                        <p>Offset: {offset}°</p>
                        <p
                          style={{
                            color: absolute ? 'red' : 'green'
                          }}>
                          {absolute
                            ? 'Manyetik Kuzey Kullanılıyor'
                            : 'Gerçek Kuzey Kullanılıyor'}
                        </p>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginBottom: 5 }}>
                    <Col className="gutter-row" span={12}>
                      <Card bordered={false} title="Pusula Yönü">
                        <Row align="stretch" justify="center">
                          <Col>
                            <svg
                              width="50"
                              height="50"
                              viewBox="0 0 100 100"
                              style={{
                                transform: `rotate(${deviceAngle}deg)`,
                                margin: '0 auto',
                                transition: 'transform 0.5s ease-out',
                                background: '#efefef',
                                borderRadius: '50%'
                              }}>
                              <polygon
                                points="50,10 60,40 50,30 40,40"
                                fill="red"
                              />
                            </svg>
                            <Statistic
                              title={deviceDirection}
                              value={((360 - deviceAngle) % 360).toFixed(0)}
                              precision={2}
                              suffix={`°`}
                            />
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                    <Col className="gutter-row" span={12}>
                      <Card bordered={false} title="Kıble Yönü">
                        <Row align="stretch" justify="center">
                          <Col>
                            <svg
                              width="50"
                              height="50"
                              viewBox="0 0 100 100"
                              style={{
                                transform: `rotate(${qiblaAngle}deg)`,
                                margin: '0 auto',
                                transition: 'transform 0.5s ease-out',
                                background: '#efefef',
                                borderRadius: '50%'
                              }}>
                              <polygon
                                points="50,10 60,40 50,30 40,40"
                                fill="red"
                              />
                            </svg>
                            <Statistic
                              title={qiblaDirection}
                              value={qiblaAngle.toFixed(0)}
                              suffix="°"
                            />
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </>
              )}
            </>
          )}
        </Layout>
      </Spin>
    </>
  )
}

export default Pusula

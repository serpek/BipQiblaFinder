import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Layout, Row, Spin, Statistic } from 'antd'
import { useGeolocation, useWindowSize } from 'react-use'

import { useOrientation } from '../../hooks'
import { getDirectionName, Qibla } from '../../utils'

import { CompassWithHTML } from '../../components'

import './QiblaFinder.scss'
import { ErrorView } from '../../views'

const Pusula: React.FC = () => {
  // const { modal } = useModal()
  const { orientation, isOrientationGranted, requestPermission, errorMessage } =
    useOrientation()
  // const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
  //   useGeolocated({
  //     positionOptions: {
  //       enableHighAccuracy: true
  //     },
  //     userDecisionTimeout: 5000
  //   })
  const state = useGeolocation()
  const size = useWindowSize()

  const [debug, setDebug] = useState<boolean>(false)
  const [offset, setOffset] = useState<number>(0)
  const [deviceAngle, setDeviceAngle] = useState<number>(0)
  const [qiblaAngle, setQiblaAngle] = useState<number>(0)
  const [deviceDirection, setDeviceDirection] = useState<string>('')
  const [qiblaDirection, setQiblaDirection] = useState<string>('')

  // useEffect(() => {
  //   if (!orientation?.absolute) {
  //     modal.info({
  //       icon: null,
  //       title: 'Pusulanızı Kalibre Edin',
  //       content: <CalibrateView />
  //     })
  //   }
  // }, [orientation])

  useEffect(() => {
    setDebug(false)
  }, [])

  useEffect(() => {
    if (orientation?.alpha) {
      //const angle = (orientation.alpha + 360) % 360
      const angle = (360 - (orientation.alpha + offset)) % 360
      const direction = getDirectionName(angle)
      setDeviceDirection(direction.name)
      setDeviceAngle(angle)
    }
  }, [offset, orientation])

  useEffect(() => {
    if (!state.loading && !state.error && state.latitude && state.longitude) {
      const angle = Qibla.degreesFromTrueNorth(state.latitude, state.longitude)
      setQiblaAngle(angle)
      const direction = getDirectionName(angle)
      setQiblaDirection(direction.name)
    }
  }, [state])

  const isError = !!state.error || !isOrientationGranted

  return (
    <Layout
      style={{
        backgroundColor: 'transparent'
      }}>
      {state.error && (
        <ErrorView message={[state.error?.message, `${errorMessage}`]} />
      )}
      {!isError && (
        <Spin spinning={state.loading} delay={500}>
          {state && (
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
                            color: orientation?.absolute ? 'red' : 'green'
                          }}>
                          {orientation?.absolute
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
          {!state && (
            <>
              <Button onClick={requestPermission}>Sensör Bilgilerini Al</Button>
            </>
          )}
        </Spin>
      )}
    </Layout>
  )
}

export default Pusula

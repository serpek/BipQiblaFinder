import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, Layout, Row, Statistic } from 'antd'

import { useGeolocated, useModal, useOrientation } from '../../hooks'
import { getDirectionName, getQiblaAngle, toFixed } from '../../utils'

import { CompassWithHTML } from '../../components'
import { CalibrateView, ErrorView } from '../../views'

import './QiblaFinderQ5.css'

const Pusula: React.FC = () => {
  const { modal } = useModal()
  const { orientation, isOrientationGranted, requestPermission } =
    useOrientation()
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true
      },
      userDecisionTimeout: 5000
    })

  const [deviceAngle, setDeviceAngle] = useState<number>(0)
  const [deviceDirection, setDeviceDirection] = useState<string>('')
  const [qiblaAngle, setQiblaAngle] = useState<number>(0)
  const [qiblaDirection, setQiblaDirection] = useState<string>('')
  //const lastRotation = useRef<number>(0);
  /*const smoothRotation = (newAngle: number) => {
                                                  let delta = newAngle - lastRotation.current;
                                                  if (delta > 180) delta -= 360;
                                                  if (delta < -180) delta += 360;
  
                                                  lastRotation.current = (lastRotation.current + delta) % 360;
                                                  if (lastRotation.current < 0) lastRotation.current += 360;
  
                                                  return lastRotation.current;
                                              };*/

  useEffect(() => {
    if (!orientation?.absolute) {
      modal.info({
        icon: null,
        title: 'Pusulanızı Kalibre Edin',
        content: <CalibrateView />
      })
    }
  }, [orientation])

  useEffect(() => {
    if (orientation?.alpha) {
      setDeviceAngle((360 - orientation.alpha) % 360)
    }
  }, [orientation])

  useEffect(() => {
    if (coords) {
      setQiblaAngle(() => getQiblaAngle(coords.latitude, coords.longitude))
    }
  }, [coords])

  useEffect(() => {
    const direction = getDirectionName(deviceAngle)
    setDeviceDirection(direction.name)
  }, [deviceAngle])

  useEffect(() => {
    if (qiblaAngle) {
      const direction = getDirectionName(qiblaAngle)
      setQiblaDirection(direction.name)
    }
  }, [qiblaAngle])

  const anglePoint = useCallback(() => {
    return (
      (qiblaAngle < Math.abs(deviceAngle) &&
        qiblaAngle + 15 > Math.abs(deviceAngle)) ||
      qiblaAngle > Math.abs(deviceAngle + 15) ||
      qiblaAngle < Math.abs(deviceAngle)
    )
  }, [deviceAngle])

  //const rotation = smoothRotation((360 - deviceAngle) % 360);
  const isError = !(
    isGeolocationAvailable ||
    isGeolocationEnabled ||
    isOrientationGranted
  )

  return (
    <Layout>
      {isError && (
        <ErrorView
          locationActive={isGeolocationAvailable}
          locationGranted={isGeolocationEnabled}
          orientationGranted={isOrientationGranted}
          requestPermissionClick={() => window.location.reload()}
        />
      )}

      {!isError && (
        <>
          {coords ? (
            <>
              <Row gutter={16} justify="center" style={{ marginBottom: 5 }}>
                <Col className="gutter-row" span={24}>
                  <Card bordered={false} title="Kıble Pusulası">
                    {/*<CompassWithCanvas
                      rotate={deviceAngle}
                      qible={qiblaAngle}
                      width={300}
                      height={300}
                    />*/}
                    <CompassWithHTML
                      rotate={deviceAngle}
                      qible={qiblaAngle}
                      width={300}
                      height={300}
                    />
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
                          value={deviceAngle.toFixed(0)}
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
          ) : (
            <>
              <Row gutter={16} justify="center">
                <Col className="gutter-row">
                  <Button onClick={getPosition}>Pozisyonu Al</Button>
                </Col>
                <Col className="gutter-row">
                  <Button onClick={requestPermission}>
                    Sensör Bilgilerini Al
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </>
      )}

      <Row gutter={16}>
        <Col className="gutter-row" span={24}>
          {coords && (
            <table className="compass-table">
              <tbody>
                <tr>
                  <th>anglePoint</th>
                  <td>{`${anglePoint()}`}</td>
                </tr>
                <tr>
                  <th>latitude</th>
                  <td>{toFixed(coords.latitude, 2)}</td>
                </tr>
                <tr>
                  <th>longitude</th>
                  <td>{toFixed(coords.longitude, 2)}</td>
                </tr>
                <tr>
                  <th>absolute</th>
                  <td>{orientation?.absolute ? '1' : '0'}</td>
                </tr>
                <tr>
                  <th>alpha</th>
                  <td>{orientation?.alpha}</td>
                </tr>
                <tr>
                  <th>Notrh</th>
                  <td>
                    <span
                      style={{
                        color: !orientation?.absolute ? 'green' : 'red'
                      }}>
                      {!orientation?.absolute
                        ? 'Gerçek Kuzey Kullanılıyor'
                        : 'Manyetik Kuzey Kullanılıyor'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </Col>
      </Row>
    </Layout>
  )
}

export default Pusula

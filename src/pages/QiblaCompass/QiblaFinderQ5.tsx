import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Layout, Row, Statistic } from 'antd'

import { useGeolocated, useOrientation } from '../../hooks'
import { getDirectionName, Qibla, toFixed } from '../../utils'

import { CompassWithHTML } from '../../components'
import { ErrorView } from '../../views'

import './QiblaFinderQ5.css'

const Pusula: React.FC = () => {
  // const { modal } = useModal()
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
    if (orientation?.alpha) {
      const declination = 4.2
      const trueNorth = (orientation.alpha + declination + 360) % 360
      const correctedAngle = trueNorth % 360

      console.log({
        alpha: orientation.alpha,
        trueNorth,
        correctedAngle
      })

      // const angle = (360 - orientation.alpha) % 360
      const direction = getDirectionName(correctedAngle)
      setDeviceDirection(direction.name)
      setDeviceAngle(correctedAngle)
    }
  }, [orientation])

  useEffect(() => {
    if (coords) {
      const angle = Qibla.degreesFromTrueNorth(
        coords.latitude,
        coords.longitude
      )
      setQiblaAngle(angle)
      const direction = getDirectionName(angle)
      setQiblaDirection(direction.name)
    }
  }, [coords])

  const anglePoint = useMemo(() => {
    let diff = Math.abs(deviceAngle - qiblaAngle)
    diff = Math.min(diff, 360 - diff) // 0° ve 360° geçişini düzeltir
    return diff <= 10
  }, [qiblaAngle, deviceAngle])

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
                  <td>{`${anglePoint}`}</td>
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

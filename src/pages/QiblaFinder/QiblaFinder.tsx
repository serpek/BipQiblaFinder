import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCookie, useGeolocation } from 'react-use'
import { Button, Layout, message, notification, Space } from 'antd'

import { useModal, useOrientation } from '../../hooks'
import { isUndefinedOrEmpty, Qibla } from '../../utils'
import { Compass } from '../../components'
import { CalibrateView, ErrorView } from '../../views'

import './QiblaFinder.scss'

const QiblaFinder: React.FC = () => {
  const { modal } = useModal()
  const [notifApi, notificationContextHolder] = notification.useNotification()
  const [, messageContextHolder] = message.useMessage()

  const [cookie, setCookie] = useCookie('_calibrated')

  const {
    error: errorGeolocation,
    latitude,
    longitude
  } = useGeolocation({ enableHighAccuracy: true })

  const { error: errorOrientation, alpha, requestPermission } = useOrientation()

  const [searchParams] = useSearchParams({ lon: '', lat: '' })

  const [mounted, setMounted] = useState<boolean>(false)
  const [qiblaAngle, setQiblaAngle] = useState<number>(0)
  const [errorMessages, setErrorMessages] = useState<{
    location: boolean
    sensor: boolean
  }>({ location: false, sensor: false })

  const qiblaCalculation = useCallback(
    (lat: number, lon: number) => {
      if (lat && lon) {
        const angle = Qibla.degreesFromTrueNorth(lat, lon)
        setQiblaAngle(angle)
      }
    },
    [setQiblaAngle]
  )

  useEffect(() => {
    // const location = {
    //   ank: {
    //     latitude: 39.929624,
    //     longitude: 32.8545828
    //   },
    //   ist: {
    //     latitude: 41.0120885,
    //     longitude: 28.9738743
    //   }
    // }
    let lat = 0 //location.ank.latitude
    let lon = 0 //location.ank.longitude
    let locationError = false

    const [a, b] = [searchParams.get('lon'), searchParams.get('lat')]
    if (!isUndefinedOrEmpty(a) && !isUndefinedOrEmpty(b)) {
      lon = parseFloat(a)
      lat = parseFloat(b)
      locationError = false
    } else {
      if (errorGeolocation) {
        locationError = true
      } else {
        if (longitude !== null && latitude !== null) {
          lon = longitude
          lat = latitude
          locationError = false
        } else {
          locationError = true
        }
      }
    }

    if (lon && lat) {
      qiblaCalculation(lat, lon)
    }
    setErrorMessages((prevState) => ({ ...prevState, location: locationError }))
  }, [errorGeolocation, latitude, longitude, qiblaCalculation, searchParams])

  useEffect(() => {
    if ((errorOrientation as any)?.code === 1) {
      setErrorMessages((prevState) => ({ ...prevState, sensor: true }))
    }
  }, [errorOrientation])

  // const loading = useMemo(() => {
  //   return loadingGeolocation || loadingOrientation
  // }, [loadingGeolocation, loadingOrientation])

  // const handlePositionSelected = ([latitude, longitude]: [
  //   lat: number,
  //   lon: number
  // ]) => {
  //   if (latitude && longitude) {
  //     qiblaCalculation(latitude, longitude)
  //   }
  //   console.log({ latitude, longitude })
  // }

  useEffect(() => {
    if (latitude && longitude) {
      qiblaCalculation(latitude, longitude)
    }
  }, [latitude, longitude, qiblaCalculation])

  useEffect(() => {
    if (!cookie) {
      notifApi.destroy()
      notifApi.open({
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
                notifApi.destroy()
                modal.info({
                  icon: null,
                  title: 'Pusulanızı Kalibre Edin',
                  content: <CalibrateView />,
                  okText: 'Bitti',
                  onOk() {
                    setCookie('1', {
                      expires: new Date(Date.now() + 6 * 60 * 10e3)
                    })
                  }
                })
              }}>
              Pusulayı kalibre et
            </Button>
          </Space>
        )
      })
    }
  }, [notifApi, cookie, modal, setCookie])

  const isError = useMemo(() => {
    return errorMessages.location || errorMessages.sensor
  }, [errorMessages])

  return (
    <Layout className="compass-layout">
      {notificationContextHolder}
      {messageContextHolder}
      {/*<p>{log?.split('|').map((l, i) => <div key={i}>{l}</div>)}</p>*/}
      {/*<MapPicker onPositionSelected={handlePositionSelected} />*/}
      {!mounted ? (
        <div className="start-screen">
          <div className="bip-logo"></div>
          <p>
            <Button
              type="primary"
              size="large"
              style={{
                backgroundColor: '#48b3e8',
                paddingLeft: 30,
                paddingRight: 30
              }}
              onClick={() => {
                requestPermission?.()
                setMounted(true)
              }}>
              Kıbleyi Bul
            </Button>
          </p>
        </div>
      ) : (
        <>
          {isError && <ErrorView message={errorMessages} />}
          {!isError && alpha > -1 && (
            <Compass alpha={alpha} qible={qiblaAngle} />
          )}
        </>
      )}
    </Layout>
  )
}

export default QiblaFinder

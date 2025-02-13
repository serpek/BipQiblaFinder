import { PropsWithChildren } from 'react'
import { Button, Result, Typography } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'

const { Paragraph, Text } = Typography

type ErrorViewProps = PropsWithChildren<{
  locationGranted: boolean
  locationActive: boolean
  orientationGranted: boolean
  requestPermissionClick: () => void
}>

export const ErrorView = (props: ErrorViewProps) => {
  if (props.locationActive && props.locationGranted && props.orientationGranted)
    return null

  return (
    <Result
      status="error"
      title="Tarayıcı Desteklenmiyor"
      subTitle="Tarayıcı konum veya sensör bilgilerine erişemiyor"
      extra={[
        <Button
          type="primary"
          key="console"
          onClick={props.requestPermissionClick}>
          Yetki vermek denemek için tıklayınız
        </Button>
      ]}>
      <div className="desc">
        <Paragraph>
          <Text strong style={{ fontSize: 16 }}>
            Sebebi aşağıdakilerden biri olabilir.
          </Text>
        </Paragraph>
        {!props.orientationGranted && (
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" />{' '}
            Tarayıcınızın sensör bilgileri okunamıyor.
          </Paragraph>
        )}
        {!props.locationActive && (
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" />{' '}
            Tarayıcınızın lokasyon bilgileri sağlamıyor.
          </Paragraph>
        )}
        {!props.locationGranted && (
          <>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" />{' '}
              Tarayıcınızda lokasyon yetkilerini vermemiş veya reddetmiş
              olabilirsiniz.
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" />{' '}
              Sisteminizdeki güvenlik kuralları lokasyon bilgileri paylaşmanıza
              izin vermiyor olabilir.
            </Paragraph>
          </>
        )}
      </div>
    </Result>
  )
}

import { PropsWithChildren } from 'react'
import { Button, Result, Typography } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'

const { Paragraph, Text } = Typography

type ErrorViewProps = PropsWithChildren<{
  message?: {
    location: boolean
    sensor: boolean
  }
}>

export const ErrorView = (props: ErrorViewProps) => {
  return (
    <Result
      style={{
        padding: '20px 0',
        overflow: 'scroll',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 20
      }}
      status="error"
      title="Tarayıcı Desteklenmiyor"
      subTitle="Tarayıcı konum veya sensör bilgilerine erişemiyor"
      extra={[
        <Button
          type="primary"
          key="console"
          onClick={() => window.location.reload()}>
          Sayfayı Yenileyin
        </Button>
      ]}>
      <div className="desc">
        <Paragraph>
          <Text strong style={{ fontSize: 16 }}>
            Sebebi aşağıdakilerden biri olabilir.
          </Text>
        </Paragraph>
        {props.message?.location && (
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" />
            <span> Tarayıcınızın lokasyon bilgilerine erişemiyor.</span>
          </Paragraph>
        )}
        {props.message?.sensor && (
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" />
            <span> Sensör bilgilerine erişemiyor.</span>
          </Paragraph>
        )}
        {/*{props.orientationGranted && (
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" />
            Tarayıcınızın sensör bilgileri okunamıyor.
          </Paragraph>
        )}
        {props.locationActive && (
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" />
            Tarayıcınızın lokasyon bilgileri sağlamıyor.
          </Paragraph>
        )}
        {props.locationGranted && (
          <>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" />
              Tarayıcınızda lokasyon yetkilerini vermemiş veya reddetmiş
              olabilirsiniz.
            </Paragraph>
            <Paragraph style={{ color: 'white' }}>
              <CloseCircleOutlined className="site-result-demo-error-icon" />
              Sisteminizdeki güvenlik kuralları lokasyon bilgileri paylaşmanıza
              izin vermiyor olabilir.
            </Paragraph>
          </>
        )}*/}
      </div>
    </Result>
  )
}

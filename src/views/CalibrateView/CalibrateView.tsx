import { Card } from 'antd'
import compass_calibration from '../../assets/compass-calibration-1.gif'

const { Meta } = Card

export const CalibrateView = () => {
  /*const items: TabsProps['items'] = [
                                            {
                                              key: '1',
                                              icon: <AppleOutlined />,
                                              label: 'IOS',
                                              children: (
                                                <Carousel arrows infinite={false}>
                                                  <div>
                                                    <Card
                                                      title="iPhone Pusula Kalibrasyonu Nasıl Açılır"
                                                      style={{ width: '100%', border: 0 }}
                                                      cover={
                                                        <img
                                                          alt="1. Adım"
                                                          style={{ width: '50%' }}
                                                          src="assets/img_0344.webp"
                                                        />
                                                      }>
                                                      <Meta
                                                        title="1. Adım"
                                                        description="Ayarlar uygulamasını açın ve Gizlilik ve Güvenlik'e dokunun."
                                                      />
                                                    </Card>
                                                  </div>
                                                  <div>
                                                    <Card
                                                      title="iPhone Pusula Kalibrasyonu Nasıl Açılır"
                                                      style={{ width: '100%', border: 0 }}
                                                      cover={
                                                        <img
                                                          alt="2. Adım"
                                                          style={{ width: '50%' }}
                                                          src="assets/img_0345.webp"
                                                        />
                                                      }>
                                                      <Meta
                                                        title="2. Adım"
                                                        description="Konum Servisleri'ne dokunun."
                                                      />
                                                    </Card>
                                                  </div>
                                                  <div>
                                                    <Card
                                                      title="iPhone Pusula Kalibrasyonu Nasıl Açılır"
                                                      style={{ width: '100%', border: 0 }}
                                                      cover={
                                                        <img
                                                          alt="3. Adım"
                                                          style={{ width: '50%' }}
                                                          src="assets/img_0346.webp"
                                                        />
                                                      }>
                                                      <Meta
                                                        title="3. Adım"
                                                        description="Sayfanın alt kısmındaki Sistem Hizmetleri'ne dokunun."
                                                      />
                                                    </Card>
                                                  </div>
                                                  <div>
                                                    <Card
                                                      title="iPhone Pusula Kalibrasyonu Nasıl Açılır"
                                                      style={{ width: '100%', border: 0 }}
                                                      cover={
                                                        <img
                                                          alt="4. Adım"
                                                          style={{ width: '50%' }}
                                                          src="/assets/img_0347.webp"
                                                        />
                                                      }>
                                                      <Meta
                                                        title="4. Adım"
                                                        description="Pusula Kalibrasyonunun açık olduğundan emin olun . Etkinleştirildiğinde, geçiş yeşil ve sağda olacaktır."
                                                      />
                                                    </Card>
                                                  </div>
                                                  <div>
                                                    <Card
                                                      title="True North'un Kapalı Olduğundan Emin Olun"
                                                      style={{ width: '100%', border: 0 }}
                                                      cover={
                                                        <img
                                                          alt="1. Adım"
                                                          style={{ width: '50%' }}
                                                          src="/assets/img_0348_0.webp"
                                                        />
                                                      }>
                                                      <Meta
                                                        title="1. Adım"
                                                        description="Ayarlar uygulamasını açın ve Uygulamalar'a dokunun."
                                                      />
                                                    </Card>
                                                  </div>
                                                  <div>
                                                    <Card
                                                      title="True North'un Kapalı Olduğundan Emin Olun"
                                                      style={{ width: '100%', border: 0 }}
                                                      cover={
                                                        <img
                                                          alt="2. Adım"
                                                          style={{ width: '50%' }}
                                                          src="/assets/img_0349.webp"
                                                        />
                                                      }>
                                                      <Meta
                                                        title="2. Adım"
                                                        description="Pusula uygulamasını listede kaydırarak veya arama çubuğunu kullanarak bulabilirsiniz."
                                                      />
                                                    </Card>
                                                  </div>
                                                  <div>
                                                    <Card
                                                      title="True North'un Kapalı Olduğundan Emin Olun"
                                                      style={{ width: '100%', border: 0 }}
                                                      cover={
                                                        <img
                                                          alt="3. Adım"
                                                          style={{ width: '50%' }}
                                                          src="/assets/img_0350_1.webp"
                                                        />
                                                      }>
                                                      <Meta
                                                        title="3. Adım"
                                                        description="Gerçek Kuzeyi sola doğru çevirin , böylece yeşil renkten gri renge döner."
                                                      />
                                                    </Card>
                                                  </div>
                                                </Carousel>
                                              )
                                            },
                                            {
                                              key: '2',
                                              icon: <AndroidOutlined />,
                                              label: 'Android',
                                              children: (
                                                <Carousel arrows infinite={false}>
                                                  <div>
                                                    <Card
                                                      style={{ width: '100%', border: 0 }}
                                                      cover={
                                                        <img alt="example" src="assets/compass-calibration-1.gif" />
                                                      }>
                                                      <Meta title="1. Yöntem: Şekil 8 desen yöntemi" />
                                        
                                                      <Paragraph>
                                                        <Paragraph>- Android cihazınızı açın.</Paragraph>
                                                        <Paragraph>
                                                          - Telefonunuzu tutun ve pusulanız kalibre olana kadar havada
                                                          bir 8 rakamı deseni yapın. Genellikle, 8 rakamı hareketini
                                                          sadece birkaç kez yapmanız gerekecektir.
                                                        </Paragraph>
                                                        <Paragraph>
                                                          - Pusulanın doğru yönü gösterdiğini doğrulamak için tercih
                                                          ettiğiniz navigasyon uygulamasını (örneğin, Google Haritalar)
                                                          açın.
                                                        </Paragraph>
                                                      </Paragraph>
                                                    </Card>
                                                  </div>
                                                  <div>
                                                    <Card
                                                      style={{ width: '100%', border: 0 }}
                                                      cover={
                                                        <img alt="example" src="/assets/compass-calibration-2.gif" />
                                                      }>
                                                      <Meta title="2. Yöntem: Telefon Eğimi yöntemi" />
                                                      <Paragraph>
                                                        <Paragraph>- Android cihazınızı açın</Paragraph>
                                                        <Paragraph>
                                                          - Telefonunuzu öne arkaya eğmeye başlayın. (Başınızı aşağı
                                                          yukarı sallamak gibi).
                                                        </Paragraph>
                                                        <Paragraph>- SOL taraftan SAĞ tarafa TAŞI.</Paragraph>
                                                        <Paragraph>
                                                          - Tekrar eğin, ancak bu sefer SOL'a ve sonra SAĞ'a eğin
                                                        </Paragraph>
                                                        <Paragraph>
                                                          - Pusulanızın yeniden kalibre edildiğini görene kadar bu
                                                          adımları tekrarlamaya devam edin.
                                                        </Paragraph>
                                                      </Paragraph>
                                                    </Card>
                                                  </div>
                                                </Carousel>
                                              )
                                            }
                                          ]*/

  // return <Tabs defaultActiveKey="1" centered={true} items={items} />
  return (
    <div style={{ textAlign: 'center' }}>
      <img
        alt="example"
        src={compass_calibration}
        width={250}
        style={{
          margin: '0 auto'
        }}
      />
      <Meta
        description="Konum sapmalarını gidermek için kalibrasyon yapılmalıdır. Pusulanınızı kalibre etmek için
         telefonunuzla 8 çizmeniz gerekmektedir. Cihazınızı aşağıdaki şekilde 3 kez eğin ve hareket ettirin. Tamamladığınızda Bitti’yi tıklayın."
      />
    </div>
  )
}

export default function HowDoesItWork() {
  return (
    <div
      style={{
        overflow: 'hidden',
        overflowY: 'scroll',
        height: '100%',
        color: 'white'
      }}>
      <h1>
        <strong>Kıble Pusulası nasıl çalışır?</strong>
      </h1>
      <p>
        <h3>Kıble nedir?</h3>
      </p>
      <p>
        Kıble, Müslümanların namaz kılarken yöneldikleri istikamettir. Kâbe’nin
        bulunduğu yön Kıble olarak kabul edilir. Kâbe, Suudi Arabistan'ın Mekke
        şehrinde yer almaktadır.
      </p>
      <p>
        <h3>Kıble'yi nasıl hesaplıyoruz?</h3>
      </p>
      <p>
        Kabe'nin konumunu (Enlem 21.4224779 Boylam 39.8251832) ve (GPS ile veya
        manuel olarak sağlanan) geçerli konumunuzu kullanarak büyük daire
        mesafesi olarak da bilinen, dünya üzerindeki iki nokta arasındaki en
        dolaysız rotayı belirleriz. Bu, haversine formülü kullanılarak
        hesaplanır. Düz bir haritada görüntülendiğinde, dünyanın
        yuvarlaklığından dolayı çizgi bazen bükülmüş gibi görünebilir.
      </p>
      <p>
        <h3>Neden kalibrasyon yapmanız isteniyor?</h3>
      </p>
      <p>
        <strong>Bip Kıble Pusulası</strong>, cihazınızın pusulasıyla çalışır.
        Pusula’nın mümkün olduğunca doğru yönü gösterdiğinden emin olmak için
        kullanmaya başlamadan önce pusulanız için kalibrasyon yapmanızı
        öneririz.
      </p>
      <p>
        <ul>
          <li>Pusulalar, manyetik alana bağlı olarak yönü belirler.</li>
          <li>
            Yakındaki metal nesneler, elektronik cihazlar veya manyetik alan
            kaynakları pusulaların sapmasına sebep olabilir.
          </li>
          <li>
            Kalibrasyon yapılmadığında ise bu manyetik sapmalar düzeltilmez ve
            pusulalar yönü yanlış gösterebilir.
          </li>
        </ul>
      </p>
      <p>
        <h3>Kıble Pusulası için neden izniniz isteniyor?</h3>
      </p>
      <p>
        <strong>Bip Kıble Pusulası</strong>, telefonunuzun GPS ve kamera
        işlevleriyle çalışmak üzere tasarlanmıştır. Size en iyi deneyimi
        sağlamak üzere bu özelliklere erişmek için izin istememiz gerekmektedir.
        Bu bilgiler hiçbir zaman kaydedilmez ve
        <strong>Bip Kıble Pusulası</strong>
        uygulaması dışında paylaşılmaz. İzinleri istediğiniz zaman
        tarayıcınızdan değiştirebilirsiniz.
      </p>
      <p>
        <h3>İzinleriniz nasıl değiştirilebilir?</h3>
      </p>
      <p>
        İzinleri değiştirmek için tarayıcınızın izin ayarlarına gitmeniz ve bu
        sitenin konumunuza erişmesine izin vermeniz (ya da verdiğiniz izni
        kaldırmanız) yeterlidir.
      </p>
    </div>
  )
}

# Difa Defence — Web Sitesi + Yönetim Paneli

PDF tasarımından yapılmış tek sayfalık tanıtım sitesi ve içeriği düzenlemek
için bir yönetim paneli. Derleme (build) gerektirmez; saf HTML/CSS/JS.

## YENİ: Çok dil + interaktif harita
- **3 dil: Türkçe, Arapça, İngilizce.** Site, ziyaretçinin tarayıcı diline
  göre otomatik açılır. Üstteki dil menüsünden (globe simgesi) elle de
  değiştirilebilir. Arapça'da düzen otomatik sağdan-sola (RTL) döner.
- **İnteraktif harita (OpenStreetMap, API anahtarı gerektirmez).** Panelden
  adres yazıp "Haritada bul" ile konumu otomatik bulabilir ya da enlem/boylam
  ve zoom değerlerini elle girebilirsiniz. İnternet yoksa otomatik olarak
  yedek harita görseline döner.

## Dosyalar
    index.html            → Web sitesi
    admin.html            → Yönetim paneli
    assets/
      css/style.css       → Site tasarımı (+ RTL, dil menüsü, harita)
      css/admin.css       → Panel tasarımı
      js/content.js       → Varsayılan içerik (3 dil + harita verisi)
      js/store.js         → Ortak yardımcılar + dil yönetimi
      js/site.js          → Siteyi içerikten üretir (i18n, harita)
      js/admin.js         → Panel mantığı
      img/                → PDF'den optimize görseller
      data/content.json   → İçeriğin dışa aktarılabilir kopyası

## Çalıştırma
`file://` ile AÇMAYIN — panel ile önizlemenin aynı origin'i paylaşması ve
harita/font kaynaklarının yüklenmesi için basit bir yerel sunucu kullanın.
`index.html`'in bulunduğu klasörde:

    python3 -m http.server 8000

Sonra:
- Site:  http://localhost:8000/
- Panel: http://localhost:8000/admin.html

## Panelde düzenleme
1. `admin.html`'i açın.
2. En üstteki **Düzenlenen dil** çubuğundan dili seçin (Türkçe/Arapça/İngilizce).
   Her metin kutusunun yanındaki küçük **EN/TR/AR** rozeti, o an hangi dili
   düzenlediğinizi gösterir. Görseller, telefon, e-posta, koordinatlar tüm
   dillerde ortaktır.
3. Değişiklikler sağdaki **canlı önizlemede** anında görünür.
4. **Save changes** ile bu tarayıcıya kaydedin.

### Harita
İletişim & Harita panelinde:
- **Adresten bul:** yer adı yazın → "Haritada bul" → enlem/boylam otomatik dolar.
- **Elle:** Enlem (lat), Boylam (lng), Zoom (1–19) girin.
- **Pin etiketi:** haritadaki işaretçinin üstünde çıkan metin (dile göre).

## Değişiklikleri kalıcı yayınlama
Panel düzenlemeleri tarayıcı hafızasına yazar (sizin cihazınızda görünür).
Herkese yayınlamak için:
1. Panelde **Export JSON** → `content.json` iner.
2. Bu dosyanın içeriğini `assets/js/content.js` içindeki
   `window.DIFA_DEFAULT_CONTENT = { ... }` ile değiştirin.
3. Dosyaları hosting'e yükleyin.

- **Import**: dışa aktardığınız `content.json`'ı geri yükler.
- **Reset**: her şeyi orijinal içeriğe döndürür.

## Notlar
- Yazı tipleri Google Fonts'tan gelir (Latin için Poppins, Arapça için Cairo);
  internet yoksa sistem yazı tipiyle sorunsuz gösterilir.
- Harita OpenStreetMap + Leaflet ile çalışır; ikisi de ücretsiz ve anahtarsızdır.
- Site mobil/tablet/masaüstü uyumludur; klavye erişimi ve "reduced motion"
  desteklenir.

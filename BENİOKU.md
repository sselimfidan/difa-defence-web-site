# Difa Defence — Web Sitesi + Yönetim Paneli

PDF'deki tasarımdan yapılmış, tek sayfalık tanıtım sitesi ve içeriği
düzenlemek için bir yönetim paneli. Sunucu gerektirmez; tüm dosyalar
statiktir ve herhangi bir hosting'e (ya da doğrudan tarayıcıda) çalışır.

## Dosyalar

    index.html            → Herkese açık web sitesi
    admin.html            → Yönetim paneli (içerik düzenleme)
    assets/
      css/style.css       → Sitenin tasarımı
      css/admin.css       → Panelin tasarımı
      js/content.js       → Varsayılan içerik (metinler, görsel yolları)
      js/store.js         → Ortak yardımcılar
      js/site.js          → Siteyi içerikten oluşturur
      js/admin.js         → Panel mantığı
      img/                → PDF'den çıkarılmış optimize görseller
      data/content.json   → İçeriğin dışa aktarılabilir kopyası

## Siteyi açma

`index.html` dosyasına çift tıklayın ya da bir web sunucusuna yükleyin.

> İpucu: En sorunsuz deneyim için basit bir yerel sunucu kullanabilirsiniz:
> klasörde `python3 -m http.server` çalıştırıp `http://localhost:8000`
> adresine gidin.

## İçeriği düzenleme (yönetim paneli)

1. `admin.html` dosyasını açın.
2. Soldaki panellerden bölümleri açıp metinleri, bağlantıları ve
   görselleri düzenleyin. Sağdaki **canlı önizleme** anında güncellenir.
3. Görsel değiştirmek için **Upload** ile bilgisayarınızdan resim seçin
   ya da kutuya bir yol/URL yazın.
4. **Save changes** (Kaydet) ile değişiklikleri bu tarayıcıya kaydedin.

Panelde neler düzenlenebilir: marka adı ve slogan, menü bağlantıları,
ana görsel (hero) başlığı/metni/görseli, Hakkımızda paragrafları ve
görselleri, Faaliyetler metni ve görselleri, Ürün kartları, İletişim
bilgileri ve harita, alt bilgi (footer).

## Değişiklikleri kalıcı yayınlama

Panel, düzenlemeleri tarayıcının hafızasına (localStorage) kaydeder — bu
sizin cihazınızda anında görünür. Değişiklikleri **siteye kalıcı olarak**
taşımak için:

1. Panelde **Export JSON**'a tıklayın; `content.json` inecek.
2. Bu dosyanın içeriğini `assets/js/content.js` içindeki
   `window.DIFA_DEFAULT_CONTENT = { ... }` nesnesiyle değiştirin
   (ya da geliştiricinize verin).
3. Güncellenmiş dosyaları hosting'e yükleyin. Böylece herkes güncel
   içeriği görür.

- **Import**: Daha önce dışa aktardığınız bir `content.json`'ı geri
  yükler.
- **Reset**: Tüm düzenlemeleri silip orijinal (PDF) içeriğe döner.

## Notlar

- Yazı tipi Poppins Google Fonts'tan yüklenir; internet yoksa sistem
  yazı tipiyle sorunsuz gösterilir.
- Görseller PDF'den alınıp web için optimize edilmiştir (~1 MB toplam).
- Site mobil, tablet ve masaüstünde uyumludur; klavye erişimi ve
  "reduced motion" tercihi desteklenir.

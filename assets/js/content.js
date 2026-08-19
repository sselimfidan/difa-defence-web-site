/* ============================================================
   Difa Defence — default content (seed data)
   Trilingual: every translatable string is an object
   { en, tr, ar }.  Shared values (images, links, coordinates)
   are plain values used across all languages.
   ============================================================ */
window.DIFA_LANGS = ["en", "tr", "ar"];
window.DIFA_LANG_NAMES = { en: "English", tr: "Türkçe", ar: "العربية" };
window.DIFA_RTL_LANGS = ["ar"];

/* Built-in interface micro-copy (not shown in the admin editor). */
window.DIFA_UI = {
  scroll:       { en: "Scroll",        tr: "Kaydır",       ar: "مرّر" },
  whoWeAre:     { en: "Who we are",    tr: "Biz kimiz",    ar: "من نحن" },
  whatWeDo:     { en: "What we do",    tr: "Ne yapıyoruz", ar: "ماذا نفعل" },
  capabilities: { en: "Capabilities",  tr: "Yetkinlikler", ar: "القدرات" },
  openInMaps:   { en: "Open in Maps",  tr: "Haritada aç",  ar: "افتح في الخرائط" },
  language:     { en: "Language",      tr: "Dil",          ar: "اللغة" }
};

window.DIFA_DEFAULT_CONTENT = {
  brand: {
    name: "Difa Defence",
    tagline: {
      en: "Defense Initiative for Fortifying the Action",
      tr: "Harekâtı güçlendiren savunma girişimi",
      ar: "مبادرة دفاعية لتعزيز العمل الميداني"
    }
  },

  nav: [
    { label: { en: "Home",       tr: "Ana Sayfa",  ar: "الرئيسية" }, href: "#home" },
    { label: { en: "About Us",   tr: "Hakkımızda", ar: "من نحن" },   href: "#about" },
    { label: { en: "Products",   tr: "Ürünler",    ar: "المنتجات" }, href: "#products" },
    { label: { en: "Contact Us", tr: "İletişim",   ar: "اتصل بنا" }, href: "#contact" }
  ],

  hero: {
    eyebrow: {
      en: "Defense Initiative for Fortifying the Action",
      tr: "Harekâtı güçlendiren savunma girişimi",
      ar: "مبادرة دفاعية لتعزيز العمل الميداني"
    },
    title: {
      en: "Defence technology, delivered worldwide.",
      tr: "Dünya çapında sunulan savunma teknolojisi.",
      ar: "تقنيات دفاعية تُقدَّم في جميع أنحاء العالم."
    },
    subtitle: {
      en: "Unmanned systems, electronic warfare, armament and integrated military solutions for the institutions that safeguard sovereignty.",
      tr: "Egemenliği koruyan kurumlar için insansız sistemler, elektronik harp, silah sistemleri ve entegre askeri çözümler.",
      ar: "أنظمة غير مأهولة، وحرب إلكترونية، وتسليح، وحلول عسكرية متكاملة للمؤسسات التي تحمي السيادة."
    },
    ctaLabel: {
      en: "Explore our work",
      tr: "Çalışmalarımızı keşfedin",
      ar: "استكشف أعمالنا"
    },
    ctaHref: "#about",
    image: "assets/img/hero.jpg"
  },

  about: {
    title: { en: "About Us", tr: "Hakkımızda", ar: "من نحن" },
    paragraphs: [
      {
        en: "Difa Defence is a company fully registered to perform foreign trade activities of unmanned aerial vehicles (UAV), electronic warfare systems, armament, military equipment and other defense solutions.",
        tr: "Difa Defence; insansız hava araçları (İHA), elektronik harp sistemleri, silah, askeri teçhizat ve diğer savunma çözümlerine yönelik dış ticaret faaliyetlerini yürütmek üzere tam yetkili olarak kayıtlı bir şirkettir.",
        ar: "ديفا ديفنس شركة مُسجَّلة بالكامل لمزاولة أنشطة التجارة الخارجية في الطائرات بدون طيار (UAV)، وأنظمة الحرب الإلكترونية، والتسليح، والمعدات العسكرية وغيرها من الحلول الدفاعية."
      },
      {
        en: "We are dedicated to our company mission to provide equipment and services which help state institutions protect their sovereignty and territorial integrity.",
        tr: "Misyonumuz, devlet kurumlarının egemenliklerini ve toprak bütünlüklerini korumalarına yardımcı olan teçhizat ve hizmetleri sağlamaktır.",
        ar: "نلتزم بمهمتنا في توفير المعدات والخدمات التي تساعد مؤسسات الدولة على حماية سيادتها وسلامة أراضيها."
      },
      {
        en: "Our experienced team of experts, together with a widespread network of suppliers, makes us one of the leading companies in the region. Our management has successfully operated with numerous governments around the globe on projects supplying military equipment for the needs of various military corps.",
        tr: "Deneyimli uzman ekibimiz ve geniş tedarikçi ağımız, bizi bölgenin önde gelen şirketlerinden biri yapıyor. Yönetimimiz, dünya genelinde çok sayıda hükümetle, çeşitli askeri birliklerin ihtiyaçları için askeri teçhizat tedariki projelerinde başarıyla çalışmıştır.",
        ar: "يجعلنا فريقنا من الخبراء وشبكتنا الواسعة من المورّدين من الشركات الرائدة في المنطقة. وقد عملت إدارتنا بنجاح مع العديد من الحكومات حول العالم في مشاريع توريد المعدات العسكرية لاحتياجات مختلف الوحدات العسكرية."
      },
      {
        en: "It would be our great pleasure to become your partner in success and to bring to your attention our services and wide range of products. We can open up new horizons of commercial collaboration by establishing long-term cooperation.",
        tr: "Başarıda ortağınız olmak, hizmetlerimizi ve sunabileceğimiz geniş ürün yelpazesini dikkatinize sunmak bizim için büyük memnuniyet olacaktır. Uzun vadeli iş birliği kurarak yeni ticari ufuklar açabiliriz.",
        ar: "يسعدنا أن نصبح شريككم في النجاح، وأن نضع بين أيديكم خدماتنا ومجموعتنا الواسعة من المنتجات. يمكننا فتح آفاق تجارية جديدة من خلال إقامة تعاون طويل الأمد."
      }
    ],
    image1: "assets/img/vehicle-front.jpg",
    image2: "assets/img/drone-a.jpg"
  },

  activities: {
    title: { en: "Our Activities", tr: "Faaliyetlerimiz", ar: "أنشطتنا" },
    body: {
      en: "Difa Defence is a foreign trade brand specialized in sales, representation, and strategic business development, offering high-technology defence industry products to international markets. Aiming to position the production power, advanced technological capabilities, and national solutions of the defence industry on a global scale, Difa Defence operates in close cooperation with government institutions and private sector manufacturers.",
      tr: "Difa Defence; satış, temsil ve stratejik iş geliştirme faaliyetlerinde uzmanlaşmış, yüksek teknolojili savunma sanayi ürünlerini uluslararası pazarlara sunan bir dış ticaret markasıdır. Savunma sanayisinin üretim gücünü, ileri teknolojik yeteneklerini ve millî çözümlerini küresel ölçekte konumlandırmayı hedefleyen Difa Defence, kamu kurumları ve özel sektör üreticileriyle yakın iş birliği içinde çalışır.",
      ar: "ديفا ديفنس علامة تجارية للتجارة الخارجية متخصصة في المبيعات والتمثيل وتطوير الأعمال الاستراتيجية، تقدّم منتجات صناعة الدفاع عالية التقنية للأسواق الدولية. وسعياً لتعزيز القدرة الإنتاجية والإمكانات التكنولوجية المتقدمة والحلول الوطنية لصناعة الدفاع على المستوى العالمي، تعمل ديفا ديفنس بتعاون وثيق مع المؤسسات الحكومية ومصنّعي القطاع الخاص."
    },
    images: [
      "assets/img/drone-b.jpg",
      "assets/img/field.jpg",
      "assets/img/vehicle-road.jpg"
    ]
  },

  products: {
    title: { en: "Products", tr: "Ürünler", ar: "المنتجات" },
    subtitle: {
      en: "A curated range across the modern battlefield — air, ground, and the electromagnetic spectrum.",
      tr: "Modern muharebe sahasının tamamına yönelik seçkin bir yelpaze — hava, kara ve elektromanyetik spektrum.",
      ar: "مجموعة مختارة تغطي ساحة المعركة الحديثة — الجو والبر والطيف الكهرومغناطيسي."
    },
    items: [
      {
        title: { en: "Unmanned Aerial Systems", tr: "İnsansız Hava Sistemleri", ar: "الأنظمة الجوية غير المأهولة" },
        desc: {
          en: "Reconnaissance and strike-capable UAV platforms for persistent situational awareness.",
          tr: "Kalıcı durumsal farkındalık için keşif ve taarruz kabiliyetli İHA platformları.",
          ar: "منصات طائرات بدون طيار للاستطلاع والهجوم لضمان وعي ميداني مستمر."
        },
        image: "assets/img/drone-a.jpg"
      },
      {
        title: { en: "Armoured Vehicles", tr: "Zırhlı Araçlar", ar: "المركبات المدرّعة" },
        desc: {
          en: "Protected mobility and tactical vehicles engineered for demanding terrain.",
          tr: "Zorlu arazi için tasarlanmış korumalı hareket kabiliyeti ve taktik araçlar.",
          ar: "قدرة حركة محمية ومركبات تكتيكية مصمّمة للتضاريس الصعبة."
        },
        image: "assets/img/vehicle-road.jpg"
      },
      {
        title: { en: "Electronic Warfare", tr: "Elektronik Harp", ar: "الحرب الإلكترونية" },
        desc: {
          en: "Detection, jamming and signal-intelligence systems for spectrum dominance.",
          tr: "Spektrum üstünlüğü için tespit, karıştırma ve sinyal istihbaratı sistemleri.",
          ar: "أنظمة كشف وتشويش واستخبارات إشارات للسيطرة على الطيف."
        },
        image: "assets/img/field.jpg"
      }
    ]
  },

  contact: {
    title: { en: "Contact Us", tr: "İletişim", ar: "اتصل بنا" },
    address: {
      en: "Building 125, Street 850, Zone 66,\nWest Bay, Doha, Qatar",
      tr: "Building 125, Street 850, Zone 66,\nWest Bay, Doha, Katar",
      ar: "مبنى 125، شارع 850، منطقة 66،\nالخليج الغربي، الدوحة، قطر"
    },
    phone: "+974 5512 5224",
    email: "info@difadefance.com",
    map: {
      lat: 25.3213,
      lng: 51.5310,
      zoom: 13,
      label: { en: "West Bay, Doha", tr: "West Bay, Doha", ar: "الخليج الغربي، الدوحة" }
    },
    mapImage: "assets/img/map.jpg"
  },

  footer: {
    note: {
      en: "© 2026 Difa Defence. All rights reserved.",
      tr: "© 2026 Difa Defence. Tüm hakları saklıdır.",
      ar: "© 2026 ديفا ديفنس. جميع الحقوق محفوظة."
    }
  }
};

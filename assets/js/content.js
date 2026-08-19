/* ============================================================
   Difa Defence — default content (seed data)
   This object is the single source of truth for the public site.
   The admin panel edits a copy of it and saves overrides to the
   browser (localStorage). Nothing here needs a server.
   ============================================================ */
window.DIFA_DEFAULT_CONTENT = {
  brand: {
    name: "Difa Defence",
    tagline: "Defense Initiative for Fortifying the Action",
    lang: "EN"
  },

  nav: [
    { label: "Home",       href: "#home" },
    { label: "About Us",   href: "#about" },
    { label: "Products",   href: "#products" },
    { label: "Contact Us", href: "#contact" }
  ],

  hero: {
    eyebrow: "Defense Initiative for Fortifying the Action",
    title: "Defence technology, delivered worldwide.",
    subtitle: "Unmanned systems, electronic warfare, armament and integrated military solutions for the institutions that safeguard sovereignty.",
    ctaLabel: "Explore our work",
    ctaHref: "#about",
    image: "assets/img/hero.jpg"
  },

  about: {
    title: "About Us",
    paragraphs: [
      "Difa Defence is a company fully registered to perform foreign trade activities of unmanned aerial vehicles (UAV), electronic warfare systems, armament, military equipment and other defense solutions.",
      "We are dedicated to our company mission to provide equipment and services which help state institutions protect their sovereignty and territorial integrity.",
      "Our experienced team of experts, together with a widespread network of suppliers, makes us one of the leading companies in the region. Our management has successfully operated with numerous governments around the globe on projects supplying military equipment for the needs of various military corps.",
      "It would be our great pleasure to become your partner in success and to bring to your attention our services and wide range of products. We can open up new horizons of commercial collaboration by establishing long-term cooperation."
    ],
    image1: "assets/img/vehicle-front.jpg",
    image2: "assets/img/drone-a.jpg"
  },

  activities: {
    title: "Our Activities",
    body: "Difa Defence is a foreign trade brand specialized in sales, representation, and strategic business development, offering high-technology defence industry products to international markets. Aiming to position the production power, advanced technological capabilities, and national solutions of the defence industry on a global scale, Difa Defence operates in close cooperation with government institutions and private sector manufacturers.",
    images: [
      "assets/img/drone-b.jpg",
      "assets/img/field.jpg",
      "assets/img/vehicle-road.jpg"
    ]
  },

  products: {
    title: "Products",
    subtitle: "A curated range across the modern battlefield — air, ground, and the electromagnetic spectrum.",
    items: [
      {
        title: "Unmanned Aerial Systems",
        desc: "Reconnaissance and strike-capable UAV platforms for persistent situational awareness.",
        image: "assets/img/drone-a.jpg"
      },
      {
        title: "Armoured Vehicles",
        desc: "Protected mobility and tactical vehicles engineered for demanding terrain.",
        image: "assets/img/vehicle-road.jpg"
      },
      {
        title: "Electronic Warfare",
        desc: "Detection, jamming and signal-intelligence systems for spectrum dominance.",
        image: "assets/img/field.jpg"
      }
    ]
  },

  contact: {
    title: "Contact Us",
    address: "Building 125, Street 850, Zone 66,\nWest Bay, Doha, Qatar",
    phone: "+974 5512 5224",
    email: "info@difadefance.com",
    mapImage: "assets/img/map.jpg",
    mapLink: "https://www.google.com/maps/search/?api=1&query=West+Bay+Doha+Qatar"
  },

  footer: {
    note: "© " + new Date().getFullYear() + " Difa Defence. All rights reserved."
  }
};

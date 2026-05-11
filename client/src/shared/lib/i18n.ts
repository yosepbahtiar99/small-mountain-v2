import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "studio_name": "Small Mountain™",
      "studio_tagline": "Creating stories, brick by brick.",
      "featured_game": "Featured Game",
      "released_games": "Released Games",
      "devlogs": "Development Logs",
      "merch_store": "Merch Store",
      "feedback": "Leave Feedback",
      "feedback_placeholder": "What do you think about our games?",
      "send": "Send",
      "visit_store": "Visit Shopee Store",
      "under_development": "Under Development",
      "status": "Status",
      "play_now": "Play Now",
      "read_more": "Read More"
    }
  },
  id: {
    translation: {
      "studio_name": "Small Mountain™",
      "studio_tagline": "Menciptakan cerita, bata demi bata.",
      "featured_game": "Game Unggulan",
      "released_games": "Game Rilis",
      "devlogs": "Catatan Pengembangan",
      "merch_store": "Toko Merch",
      "feedback": "Kirim Masukan",
      "feedback_placeholder": "Apa pendapatmu tentang game kami?",
      "send": "Kirim",
      "visit_store": "Kunjungi Toko Shopee",
      "under_development": "Sedang Dikembangkan",
      "status": "Status",
      "play_now": "Mainkan Sekarang",
      "read_more": "Baca Selengkapnya"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lng') || "en", 
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

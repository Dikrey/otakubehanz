// utils/search.ts
import axios from 'axios';
import scrapeSearchResult from '@/lib/scrapeSearchResult';
import { searchResultAnime } from '@/types/types';

const search = async (keyword: string): Promise<searchResultAnime[]> => {
  // Validasi input
  if (!keyword || typeof keyword !== 'string') {
    return [];
  }

  const BASEURL = process.env.BASEURL;
  if (!BASEURL) {
    console.error('BASEURL environment variable is not set');
    return [];
  }

  try {
    const encodedKeyword = encodeURIComponent(keyword.trim());
    const url = `${BASEURL}/?s=${encodedKeyword}&post_type=anime`;

    // Tambahkan timeout & header untuk hindari blokir
    const response = await axios.get(url, {
      timeout: 10000, // 10 detik
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });

    const html = response.data;

    // Opsional: cek apakah respons berisi pesan "Tidak ditemukan"
    if (typeof html !== 'string' || html.length === 0) {
      return [];
    }

    return scrapeSearchResult(html);
  } catch (error: any) {
    // Log error untuk debugging di Vercel
    console.error('Search scraping error:', {
      keyword,
      url: `${BASEURL}/?s=...&post_type=anime`,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    // Jangan lempar error — kembalikan array kosong agar API tidak 500
    return [];
  }
};

export default search;

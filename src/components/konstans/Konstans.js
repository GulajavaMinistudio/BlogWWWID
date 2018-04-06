// https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fwwwid
const BASE_URLS = 'https://api.rss2json.com/v1/api.json';
const PARAM_REQUEST_FEEDS = '?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fwwwid';
export { BASE_URLS, PARAM_REQUEST_FEEDS };

const KEY_STORAGE_FEEDS = 'feeds_data';
const KEY_STORAGE_TAG_CATEGORY = 'category_data';
const KEY_STORAGE_BERITAFEEDMODEL = 'berita_model_feed';
export { KEY_STORAGE_FEEDS, KEY_STORAGE_TAG_CATEGORY, KEY_STORAGE_BERITAFEEDMODEL };

const KEY_MILIS_WAKTU_DISIMPAN = 'waktu_milis_simpan';
const BATAS_CACHE_5MENIT = 300000;
export { BATAS_CACHE_5MENIT, KEY_MILIS_WAKTU_DISIMPAN };

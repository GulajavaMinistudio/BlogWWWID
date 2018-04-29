// import axios from 'axios';
import { LocalStorageHelpers } from '@/components/konstans/LocalStorageHelpers';
import BeritaFeedsModel from '@/components/models/BeritaFeedsModel';
import FeedItem from '@/components/models/FeedItem';
import { ParserDaftarArtikel, ParserKategori } from '@/components/konstans/ParserDatas';
import {
  BASE_URLS, PARAM_REQUEST_FEEDS,
  KEY_STORAGE_FEEDS, KEY_STORAGE_TAG_CATEGORY,
  KEY_STORAGE_BERITAFEEDMODEL,
  BATAS_CACHE_5MENIT, KEY_MILIS_WAKTU_DISIMPAN,
} from '@/components/konstans/Konstans';
import axios from '../../../node_modules/axios/dist/axios.min';

// import komponen untuk list artikel
const ListItemComponent = () => import(/* webpackChunkName: "list-item-artikel" */'@/components/beritafeeds/ListItemFeeds');

const HeaderComponent = () => import(/* webpackChunkName: "header-halaman-blog-feed" */'@/components/sharedscomponent/HeaderWeb');

const ProgressBarComponent = () => import(/* webpackChunkName: "progress-bar-home" */'@/components/sharedscomponent/ProgressBarComponent');

// ambil berita dari cache terlebih dahulu
// jika berita di cache kosong, maka ambil dari internet
// kemudian simpan ke cache
// dan ambil dari cache lagi

export default {
  name: 'BeritaFeedComponent',
  components: {
    'list-item': ListItemComponent,
    'header-web': HeaderComponent,
    progressbar: ProgressBarComponent,
  },
  data() {
    return {
      beritafeeds: [],
      beritafeedscache: [],
      isShowProgress: false,
      beritaFeedModel: new BeritaFeedsModel(),
      listKategoriArtikel: [],
      localstorageHelper: new LocalStorageHelpers(),
      parserDaftarArtikel: new ParserDaftarArtikel(),
      parserKategori: new ParserKategori(),
    };
  },
  methods: {
    /**
     * Ambil daftar berita yang tersimpan di dalam cache
     */
    getFeedBeritaCached() {
      this.showProgressBar(true);
      const promiseGetBeritaCached = new Promise((resolve) => {
        const beritacacheString = this.localstorageHelper.getDataWithKey(KEY_STORAGE_FEEDS);
        const beritacache = JSON.parse(beritacacheString);
        const beritaFeedModelString = this.localstorageHelper
          .getDataWithKey(KEY_STORAGE_BERITAFEEDMODEL);
        this.beritaFeedModel = JSON.parse(beritaFeedModelString);
        resolve(beritacache);
      });

      promiseGetBeritaCached
        .then((beritacached) => {
          if (beritacached && beritacached.length > 0) {
            this.beritafeeds = beritacached;
            this.getCekWaktuCached();
            this.showProgressBar(false);
          } else {
            this.getBeritaFeeds();
          }
        })
        .catch((err) => {
          console.log(err);
          this.getBeritaFeeds();
          this.showProgressBar(false);
        });
    },
    /**
     * Ambil daftar berita dari server Medium WWWID
     */
    getBeritaFeeds() {
      this.showProgressBar(true);
      // ambil data feed medium dari server
      const urlBerita = BASE_URLS + PARAM_REQUEST_FEEDS;
      axios.get(urlBerita)
        .then(resp => new Promise((resolve) => {
          const datajson = resp.data;
          const feeds = datajson.feed;

          const feedItem = new FeedItem(feeds.url, feeds.title, feeds.link,
            feeds.author, feeds.description, feeds.image);

          this.beritafeeds = this.parserDaftarArtikel.parseSusunArtikel(datajson.items);
          // susun model artikel yang sudah baku
          this.beritaFeedModel = new BeritaFeedsModel(datajson.status, feedItem, this.beritafeeds);
          resolve(true);
        }))
        .then(() => new Promise((resolve) => {
          // susun daftar kategori artikel
          this.listKategoriArtikel = this.parserKategori
            .parseKategoriSemuaArtikel(this.beritaFeedModel.items);
          resolve(true);
        }))
        .then(() => {
          this.cekHasilGetBerita();
        })
        .catch((err) => {
          console.log(err);
          this.listKategoriArtikel = [];
          this.beritafeeds = [];
          this.cekHasilGetBerita();
          this.showProgressBar(false);
        });
    },
    cekHasilGetBerita() {
      if (this.listKategoriArtikel && this.listKategoriArtikel.length > 0) {
        this.simpanFeedKategori();
      } else {
        this.getFeedKategoriCached();
      }

      if (this.beritafeeds && this.beritafeeds.length > 0) {
        this.simpanFeedBerita();
        this.simpanWaktuCached();
      } else {
        this.getFeedBeritaCached();
      }
      this.showProgressBar(false);
    },
    simpanFeedBerita() {
      const promiseSaveBerita = new Promise((resolve) => {
        this.localstorageHelper.removeDataWithKey(KEY_STORAGE_FEEDS);
        this.localstorageHelper.removeDataWithKey(KEY_STORAGE_BERITAFEEDMODEL);
        this.localstorageHelper.addDataLocalStorage(KEY_STORAGE_FEEDS,
          JSON.stringify(this.beritafeeds));
        this.localstorageHelper.addDataLocalStorage(KEY_STORAGE_BERITAFEEDMODEL,
          JSON.stringify(this.beritaFeedModel));
        resolve(true);
      });

      promiseSaveBerita
        .then(() => {
          // sukses simpan data ke local storage
          this.getFeedBeritaCached();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    simpanFeedKategori() {
      const simpanKategoriPromised = new Promise((resolve) => {
        this.localstorageHelper.removeDataWithKey(KEY_STORAGE_TAG_CATEGORY);
        this.localstorageHelper.addDataLocalStorage(KEY_STORAGE_TAG_CATEGORY,
          JSON.stringify(this.listKategoriArtikel));
        resolve(true);
      });

      simpanKategoriPromised
        .then(() => {
          this.getFeedKategoriCached();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getFeedKategoriCached() {
      const getDataKategoriPromised = new Promise((resolve) => {
        const listKategoriCacheString = this.localstorageHelper
          .getDataWithKey(KEY_STORAGE_TAG_CATEGORY);
        const listKategoriCache = JSON.parse(listKategoriCacheString);
        resolve(listKategoriCache);
      });

      getDataKategoriPromised
        .then((listkategori) => {
          this.listKategoriArtikel = listkategori;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    simpanWaktuCached() {
      const saveWaktuPromised = new Promise((resolve) => {
        const tanggalWaktu = new Date().getTime();
        this.localstorageHelper.removeDataWithKey(KEY_MILIS_WAKTU_DISIMPAN);
        this.localstorageHelper.addDataLocalStorage(KEY_MILIS_WAKTU_DISIMPAN,
          tanggalWaktu.toString());
        resolve('true');
      });

      saveWaktuPromised.then(() => {
        // tidak melakukan apa apa
      })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * Cek dan periksa waktu data disimpan, jika sudah lebih dari 5 menit, maka
     * ambil data yang baru lagi
     */
    getCekWaktuCached() {
      const getWaktuCachedPromised = new Promise((resolve) => {
        const waktucached = this.localstorageHelper.getDataWithKey(KEY_MILIS_WAKTU_DISIMPAN);
        const waktuCachedLong = Number(waktucached);
        resolve(waktuCachedLong);
      });

      getWaktuCachedPromised.then((waktuCache) => {
        const waktuSekarang = new Date().getTime();
        const waktuSelisih = waktuSekarang - waktuCache;
        if (waktuSelisih > BATAS_CACHE_5MENIT) {
          console.log('cache sudah lebih dari 5 menit');
          this.getBeritaFeeds();
        }
      })
        .catch((error) => {
          console.log(error);
          this.getBeritaFeeds();
        });
    },
    navigasiHalamanDetail(artikelmodel, indeks) {
      const judulArtikel = artikelmodel.title;
      this.$router.push({ name: 'BeritaDetail', params: { idberita: indeks, judulhalaman: judulArtikel } });
    },
    showProgressBar(isShowed) {
      this.isShowProgress = isShowed;
    },
  },
  computed: {

  },
  mounted() {
    // cek status local storage apakah kompatibel atau tidak
    this.localstorageHelper.checkLocalStorageCompatible();
    // ambil data dari server
    this.getFeedBeritaCached();
  },
};

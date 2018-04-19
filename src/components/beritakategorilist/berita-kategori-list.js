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

const HeaderWebDetail = () => import(/* webpackChunkName: "header-halaman-kategori" */'@/components/sharedscomponent/HeaderWeb');

export default {
  name: 'BeritaKategoriList',
  components: {
    'header-web': HeaderWebDetail,
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
    getKategoriCached() {
      const getDataKategoriPromised = new Promise((resolve) => {
        const listKategoriCacheString = this.localstorageHelper
          .getDataWithKey(KEY_STORAGE_TAG_CATEGORY);
        const listKategoriCache = JSON.parse(listKategoriCacheString);
        resolve(listKategoriCache);
      });

      getDataKategoriPromised
        .then((listkategori) => {
          if (listkategori && listkategori.length > 0) {
            this.listKategoriArtikel = listkategori;
            this.cekUmurCacheInternet();
          } else {
            this.getKategoriInternet();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getKategoriInternet() {
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
          this.simpanKategoriCached();
        })
        .catch((err) => {
          console.log(err);
          this.listKategoriArtikel = [];
          this.beritafeeds = [];
          this.simpanKategoriCached();
        });
    },
    simpanKategoriCached() {
      const simpanKategoriPromised = new Promise((resolve) => {
        this.localstorageHelper.removeDataWithKey(KEY_STORAGE_TAG_CATEGORY);
        this.localstorageHelper.removeDataWithKey(KEY_STORAGE_FEEDS);
        this.localstorageHelper.removeDataWithKey(KEY_STORAGE_BERITAFEEDMODEL);
        this.localstorageHelper.addDataLocalStorage(KEY_STORAGE_TAG_CATEGORY,
          JSON.stringify(this.listKategoriArtikel));
        this.localstorageHelper.addDataLocalStorage(KEY_STORAGE_FEEDS,
          JSON.stringify(this.beritafeeds));
        this.localstorageHelper.addDataLocalStorage(KEY_STORAGE_BERITAFEEDMODEL,
          JSON.stringify(this.beritaFeedModel));
        resolve(true);
      });

      simpanKategoriPromised.then(() => {
        this.getKategoriCached();
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
    cekUmurCacheInternet() {
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
          this.getKategoriInternet();
        }
      })
        .catch((error) => {
          console.log(error);
          this.getKategoriInternet();
        });
    },
    navigasiBalikHalaman() {

    },
    navigasiDaftarBeritaKategori(value) {
      this.$router.push({ name: 'BeritaDenganKategori', params: { idkategori: value } });
    },
  },
  computed: {

  },
  mounted() {
    // cek status local storage apakah kompatibel atau tidak
    this.localstorageHelper.checkLocalStorageCompatible();
    this.getKategoriCached();
  },
};

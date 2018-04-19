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


const HeaderDetailWeb = () => import(/* webpackChunkName: "header-detail-web" */'@/components/sharedscomponent/HeaderWebDetail');

export default {
  name: 'DetailBeritaComponent',
  components: {
    'header-detail': HeaderDetailWeb,
  },
  data() {
    return {
      idberita: this.$route.params.idberita,
      judulhalaman: this.$route.params.judulhalaman,
      artikelModel: {},
      beritafeeds: [],
      beritafeedscache: [],
      listKategoriArtikel: [],
      beritaFeedModel: new BeritaFeedsModel(),
      localstorageHelper: new LocalStorageHelpers(),
      parserDaftarArtikel: new ParserDaftarArtikel(),
      parserKategori: new ParserKategori(),
      rawhtml: '',
      judulArtikel: '',
      penulis: '',
      pubDate: '',
    };
  },
  methods: {
    getBeritaCached() {
      const promiseGetBeritaCached = new Promise((resolve) => {
        const beritaFeedModelString = this.localstorageHelper
          .getDataWithKey(KEY_STORAGE_BERITAFEEDMODEL);
        const beritamodel = JSON.parse(beritaFeedModelString);
        resolve(beritamodel);
      });

      promiseGetBeritaCached.then((beritamodel) => {
        if (beritamodel) {
          this.beritaFeedModel = beritamodel;
          this.beritafeeds = this.beritaFeedModel.items;
          this.getDetailBeritaCached();
        } else {
          this.getDaftarBerita();
        }
      })
        .catch((err) => {
          console.log(err);
          this.getDaftarBerita();
        });
    },
    getDaftarBerita() {
      // karena data cache kosong, maka ambil daftar berita
      const urlberita = BASE_URLS + PARAM_REQUEST_FEEDS;
      axios.get(urlberita)
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
        .catch((error) => {
          console.log(error);
          this.listKategoriArtikel = [];
          this.beritafeeds = [];
          this.cekHasilGetBerita();
        });
    },
    cekHasilGetBerita() {
      if (this.listKategoriArtikel && this.listKategoriArtikel.length > 0) {
        this.simpanFeedKategoriBerita();
      } else {
        this.getFeedKategoriCached();
      }

      if (this.beritafeeds && this.beritafeeds.length > 0) {
        this.simpanFeedBerita();
        this.simpanWaktuCached();
      } else {
        this.getFeedBeritaCached();
      }
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
    simpanFeedKategoriBerita() {
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
    getDetailBeritaCached() {
      // gunakan filter untuk mencari berita pertama sesuai judulnya
      const promiseFilter = new Promise((resolve) => {
        const arrayBeritaCocok = this.beritafeeds.filter(valueindex =>
          this.judulhalaman === valueindex.title);
        const artikelModel = arrayBeritaCocok[0];
        resolve(artikelModel);
      });

      promiseFilter.then((artikel) => {
        this.artikelModel = artikel;
        // jika artikel model benar didapat dan bukan
        // undefined
        if (this.artikelModel) {
          // this.$refs.content_detail.innerHTML = this.artikelModel.content;
          // const elementId = document.getElementById('content_detail');
          // elementId.innerHTML = this.artikelModel.content;
          this.rawhtml = this.artikelModel.content;
          this.judulArtikel = this.artikelModel.title;
          this.penulis = this.artikelModel.author;
          this.pubDate = this.artikelModel.pubDate;
          this.applyStyleJquery();
          this.getCekWaktuCached();
        } else {
          // navigasi balik ke halaman utama
          this.navigasiBalikHalamanUtama();
        }
      })
        .catch((err) => {
          console.log(err);
          // error karena daftar berita salah atau url salah
          // navigasi balik ke halaman utama
          this.navigasiBalikHalamanUtama();
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
          this.getDaftarBerita();
        }
      })
        .catch((error) => {
          console.log(error);
          this.getDaftarBerita();
        });
    },
    navigasiBalikHalamanUtama() {
      this.$route.push({ name: 'BeritaFeeds' });
    },
    navigasiHalamanAsli() {
      window.open(this.artikelModel.link, '_blank');
    },
    applyStyleJquery() {
      setTimeout(() => {
        $('figure img').addClass('responsive-img');
      }, 1500);
    },
  },
  computed: {

  },
  mounted() {
    // cek status local storage apakah kompatibel atau tidak
    this.localstorageHelper.checkLocalStorageCompatible();
    // ambil data dari router dan cache
    this.idberita = this.$route.params.idberita;
    this.judulhalaman = this.$route.params.judulhalaman;
    this.getBeritaCached();
  },
};

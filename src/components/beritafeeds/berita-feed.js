import axios from 'axios';
import { LocalStorageHelpers } from '@/components/konstans/LocalStorageHelpers';
import BeritaFeedsModel from '@/components/models/BeritaFeedsModel';
import FeedItem from '@/components/models/FeedItem';
import { ParserDaftarArtikel, ParserKategori } from '@/components/konstans/ParserDatas';
import {
  BASE_URLS, PARAM_REQUEST_FEEDS,
  KEY_STORAGE_FEEDS, KEY_STORAGE_TAG_CATEGORY,
  KEY_STORAGE_BERITAFEEDMODEL,
} from '@/components/konstans/Konstans';

// import komponen untuk list artikel
const ListItemComponent = () => import(/* webpackChunkName: "list-item-artikel" */'@/components/beritafeeds/ListItemFeeds');

const HeaderComponent = () => import(/* webpackChunkName: "header-halaman-blog-feed" */'@/components/sharedscomponent/HeaderWeb');

export default {
  name: 'BeritaFeedComponent',
  components: {
    'list-item': ListItemComponent,
    'header-web': HeaderComponent,
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
     * Ambil daftar berita dari server Medium WWWID
     */
    getBeritaFeeds() {
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
      } else {
        this.getFeedBeritaCached();
      }
    },
    simpanFeedBerita() {
      const promiseSaveBerita = new Promise((resolve) => {
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
    getFeedBeritaCached() {
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
          this.beritafeeds = beritacached;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    simpanFeedKategori() {
      const simpanKategoriPromised = new Promise((resolve) => {
        this.localstorageHelper.addDataLocalStorage(KEY_STORAGE_TAG_CATEGORY,
          this.listKategoriArtikel);
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
        const listKategoriCache = this.localstorageHelper.getDataWithKey(KEY_STORAGE_TAG_CATEGORY);
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
  },
  computed: {

  },
  mounted() {
    // cek status local storage apakah kompatibel atau tidak
    this.localstorageHelper.checkLocalStorageCompatible();
    // ambil data dari server
    this.getBeritaFeeds();
  },
};

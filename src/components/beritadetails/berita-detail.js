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
      beritaFeedModel: new BeritaFeedsModel(),
      localstorageHelper: new LocalStorageHelpers(),
      parserDaftarArtikel: new ParserDaftarArtikel(),
      parserKategori: new ParserKategori(),
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

    },
    cekHasilGetBerita() {

    },
    simpanFeedBerita() {

    },
    simpanFeedKategoriBerita() {

    },
    getDetailBeritaCached() {
      this.artikelModel = this.beritafeeds[this.idberita];
      this.$refs.content_detail.innerHTML = this.artikelModel.content;
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

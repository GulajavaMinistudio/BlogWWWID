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
    };
  },
  methods: {
    getDaftarBerita() {

    },
    cekHasilGetBerita() {

    },
    simpanFeedBerita() {

    },
    getBeritaCached() {

    },
    simpanFeedKategoriBerita() {

    },
    getDetailBeritaCached() {

    },
  },
  computed: {

  },
  mounted() {
    this.idberita = this.$route.params.idberita;
    this.judulhalaman = this.$route.params.judulhalaman;
  },
};

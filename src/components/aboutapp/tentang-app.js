const HeaderWeb = () => import(/* webpackChunkName: "header-web-tentang" */'@/components/sharedscomponent/HeaderWeb');

export default {
  name: 'DetailBeritaComponent',
  components: {
    'header-web-tentang': HeaderWeb,
  },
  data() {
    return {

    };
  },
  methods: {

  },
  computed: {
    getTanggalSekarang() {
      const dates = new Date();
      const tanggalSekarang = dates.getFullYear();
      return tanggalSekarang;
    },
  },
};


const HeaderDetailWeb = () => import(/* webpackChunkName: "header-detail-web" */'@/components/sharedscomponent/HeaderWebDetail');

export default {
  name: 'DetailBeritaComponent',
  components: {
    'header-detail': HeaderDetailWeb,
  },
  data() {
    return {
      param_url_details: '',
    };
  },
  methods: {

  },
  computed: {

  },
  mounted() {

  },
};

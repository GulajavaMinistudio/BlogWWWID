import ArtikelModel from '@/components/models/ArtikelModel';

export default {
  name: 'ListItemComponent',
  props: {
    propsArtikelItem: {
      type: Object,
      default() {
        return new ArtikelModel();
      },
    },
  },
  data() {
    return {
      artikelItem: this.propsArtikelItem,
      categoryartikel: this.propsArtikelItem.categories,
      linkGambar: '',
    };
  },
  methods: {
    navigasiDetailHalaman() {

    },
  },
  computed: {

  },
  filters: {
    snippetFilter(value) {
      const slicedDesc = `${value.toString().slice(0, 300)}...`;
      return slicedDesc;
    },
  },
  mounted() {
    this.linkGambar = this.propsArtikelItem.thumbnail;
  },
};

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
    };
  },
  methods: {

  },
  computed: {

  },
  filters: {
    snippetFilter(value) {
      const slicedDesc = `${value.toString().slice(0, 100)}...`;
      return slicedDesc;
    },
  },
  mounted() {

  },
};

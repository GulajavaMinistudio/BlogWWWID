import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const BeritaFeedHome = () => import(/* webpackChunkName: "home-berita" */'@/components/beritafeeds/BeritaFeeds');

const BeritaDetail = () => import(/* webpackChunkName: "detail-berita" */'@/components/beritadetails/BeritaDetail');

const KategoriBerita = () => import(/* webpackChunkName: "daftar-kategori-berita" */'@/components/beritakategorilist/BeritaKategoriList');

const baseRouter = [
  {
    path: '/',
    name: 'BeritaFeeds',
    component: BeritaFeedHome,
  },
  {
    path: '/detail/:idberita/:judulhalaman',
    name: 'BeritaDetail',
    component: BeritaDetail,
  },
  {
    path: '/daftar-kategori-berita',
    name: 'BeritaKategoriList',
    component: KategoriBerita,
  },
  {
    path: '*',
    redirect: {
      name: 'BeritaFeeds',
    },
  },
];

export default new Router({
  routes: baseRouter,
});

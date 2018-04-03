import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const BeritaFeedHome = () => import(/* webpackChunkName: "home-berita" */'@/components/beritafeeds/BeritaFeeds');

const BeritaDetail = () => import(/* webpackChunkName: "detail-berita" */'@/components/beritadetails/BeritaDetail');

const baseRouter = [
  {
    path: '/',
    name: 'BeritaFeeds',
    component: BeritaFeedHome,
  },
  {
    path: '/detail/:idtitle/:judulhalaman',
    name: 'BeritaDetail',
    component: BeritaDetail,
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

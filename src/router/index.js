import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const BeritaFeedHome = () => import(/* webpackChunkName: "home-berita" */'@/components/beritafeeds/BeritaFeeds');

const baseRouter = [
  {
    path: '/',
    name: 'BeritaFeeds',
    component: BeritaFeedHome,
  },
];

export default new Router({
  routes: baseRouter,
});

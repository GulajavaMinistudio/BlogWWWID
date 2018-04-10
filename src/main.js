// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

// penggunaan untuk proses pengembangan saja
// jika sudah selesai, pake yang CDN saja
// require('lazysizes');
require('../src/librarys/progressive-image.min.css');
require('../src/librarys/progressive-image.min.js');
require('jquery');
require('../semantic/dist/semantic.min.js');
require('../semantic/dist/semantic.min.css');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});

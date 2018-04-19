// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'jquery';
import Vue from 'vue';
import App from './App';
import router from './router';
// import '../semantic/dist/semantic.min.css';
// import '../semantic/dist/semantic.min';
import '../src/librarys/progressive-image.min.css';
import '../src/librarys/progressive-image.min';

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});

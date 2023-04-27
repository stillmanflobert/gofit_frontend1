import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify'
import VueToast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import store from '@/store/index.js';

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  VueToast,
  store: store,
  render: h => h(App)
}).$mount('#app')

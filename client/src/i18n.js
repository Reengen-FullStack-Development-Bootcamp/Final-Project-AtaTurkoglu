import en from './assets/i18n/en.json';
import tr from './assets/i18n/tr.json';
import VueI18n from 'vue-i18n';
import Vue from 'vue';

Vue.use(VueI18n);

export default new VueI18n({
  locale: 'en',
  messages: {
    en: en,
    tr: tr,
  },
});

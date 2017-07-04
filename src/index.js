import Ajax from './utils/Ajax'
import UTree from './components/tree/UTree.vue';
import UFormGrid from './components/form-grid/UFormGrid.vue';

const ueboot = {
  UTree,
  UFormGrid
};

const install = function (Vue, opts = {}) {

  Object.keys(ueboot).forEach((key) => {
    Vue.component(key, ueboot[key]);
  });

  Vue.prototype.$ajax = Ajax;
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

module.exports = Object.assign(ueboot, {install});   // eslint-disable-line no-undef


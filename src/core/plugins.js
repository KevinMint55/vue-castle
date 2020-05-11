/**
 * [plugins]
 * @author Kevin on 2018/05/16.
 */
import {
  loadIn,
  loadInFull,
  toast,
  log,
} from 'ajax';

import Vue from 'vue';
import apis from 'apis';
import utils from 'utils';
import WwButton from 'components/WwButton';
import clickoutside from './directives/clickoutside';
import './element';

Vue.directive('clickoutside', clickoutside);

Vue.prototype.$apis = apis;
Vue.prototype.$utils = utils;
Vue.prototype.$loadIn = loadIn;
Vue.prototype.$loadInFull = loadInFull;
Vue.prototype.$toast = toast;
Vue.prototype.$log = log;

Vue.component('KmButton', WwButton);

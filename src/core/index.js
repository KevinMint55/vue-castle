/**
 * [plugins]
 * @author Kevin on 2018/05/16.
 */
import {
  loadIn,
  loadInFull,
  toast,
  regExp,
} from 'utils';

import Vue from 'vue';
import WwButton from 'components/WwButton';
import clickoutside from './directives/clickoutside';
import './element';

Vue.directive('clickoutside', clickoutside);

Vue.prototype.$loadIn = loadIn;
Vue.prototype.$loadInFull = loadInFull;
Vue.prototype.$toast = toast;
Vue.prototype.$regExp = regExp;

Vue.component('KmButton', WwButton);

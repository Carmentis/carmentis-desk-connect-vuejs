import type { App, Plugin } from 'vue';
import CarmentisAuthPopup from './components/CarmentisAuthPopup.vue';
import CarmentisApprovalPopup from './components/CarmentisApprovalPopup.vue';
import CarmentisPopupBase from './components/CarmentisPopupBase.vue';
import CarmentisJsonRpcPopup from './components/CarmentisJsonRpcPopup.vue';
import type { CarmentisPluginOptions } from './types';

export { CarmentisAuthPopup, CarmentisApprovalPopup, CarmentisPopupBase, CarmentisJsonRpcPopup };
export * from './types';
export * from './composables/useCarmentisSession';

const CarmentisConnectPlugin: Plugin = {
  install(app: App, options?: CarmentisPluginOptions) {
    app.component('CarmentisAuthPopup', CarmentisAuthPopup);
    app.component('CarmentisApprovalPopup', CarmentisApprovalPopup);
    app.component('CarmentisJsonRpcPopup', CarmentisJsonRpcPopup);

    // Optionally store global options
    if (options) {
      app.provide('carmentisOptions', options);
    }
  },
};

export default CarmentisConnectPlugin;

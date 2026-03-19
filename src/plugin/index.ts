import type { App, Plugin } from 'vue';
import CarmentisAuthPopup from './components/CarmentisAuthPopup.vue';
import CarmentisApprovalPopup from './components/CarmentisApprovalPopup.vue';
import CarmentisPopupBase from './components/CarmentisPopupBase.vue';
import type { CarmentisPluginOptions } from './types';

export { CarmentisAuthPopup, CarmentisApprovalPopup, CarmentisPopupBase };
export * from './types';
export * from './composables/useCarmentisSession';

const CarmentisConnectPlugin: Plugin = {
  install(app: App, options?: CarmentisPluginOptions) {
    app.component('CarmentisAuthPopup', CarmentisAuthPopup);
    app.component('CarmentisApprovalPopup', CarmentisApprovalPopup);

    // Optionally store global options
    if (options) {
      app.provide('carmentisOptions', options);
    }
  },
};

export default CarmentisConnectPlugin;

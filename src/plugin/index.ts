import type { App, Plugin } from 'vue';
import CarmentisConnectPopup from './components/CarmentisConnectPopup.vue';
import type { CarmentisPluginOptions } from './types';

export { CarmentisConnectPopup };
export * from './types';
export * from './composables/useCarmentisSession';

const CarmentisConnectPlugin: Plugin = {
  install(app: App, options?: CarmentisPluginOptions) {
    app.component('CarmentisConnectPopup', CarmentisConnectPopup);

    // Optionally store global options
    if (options) {
      app.provide('carmentisOptions', options);
    }
  },
};

export default CarmentisConnectPlugin;

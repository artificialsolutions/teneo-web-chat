import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default function registerMessageComponents() {
  const requireComponent = require.context(
    '../components/messages',
    true,
    /Message/
  );

  Vue.component('loading', Loading);

  requireComponent.keys().forEach((fileName) => {
    let messageComponentConfig = requireComponent(fileName);

    messageComponentConfig =
      messageComponentConfig.default || messageComponentConfig;

    const messageComponentName =
      messageComponentConfig.name ||
      fileName.replace(/^.+\//, '').replace(/\.\w+$/, '');

    Vue.component(messageComponentName, messageComponentConfig);
  });
}

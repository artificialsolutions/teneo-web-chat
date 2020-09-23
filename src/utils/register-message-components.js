import Vue from 'vue';

export default function registerMessageComponents() {
  if((process.env.NODE_ENV === 'undefined')||(process.env.NODE_ENV !== 'test')){
    const requireComponent = require.context(
      '../components/messages',
      true,
      /Message/
    );

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
}

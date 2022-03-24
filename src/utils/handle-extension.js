import Vue from 'vue';

const tmpVue = new Vue();

export default async function handleExtension(method_name, payload) {
  const extensionCallbacks = tmpVue.$extensionMethods.get(method_name);
  if (Array.isArray(extensionCallbacks) && extensionCallbacks.length) {
    for (let i = 0; i < extensionCallbacks.length; ++i) {
      try {
        if (typeof extensionCallbacks[i] === 'function') {
          await extensionCallbacks[i](payload);
        }
      } catch (err) {
        console.error(err);
      }
    }
    return true;
  } else {
    return false;
  }
}

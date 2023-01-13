const getCallbacksForMethod = (methodName) => {
    const callbacks = {
      beforeCreate: [],
      created: [],
      beforeMount: [],
      mounted: [],
      beforeUpdate: [],
      updated: [],
      beforeDestroy: [],
      destroyed: [],
      activated: [],
      deactivated: [],
      errorCaptured: [],
      renderTracked: [],
      renderTriggered: [],
    };

    if (methodName in callbacks) {
      return callbacks[methodName];
    }

return false;

  };

export default async function handleExtension(method_name, payload) {

    /*
     *  Get list of callback functions for method name
     * Vue 3 does not support the use of $ extension methods, instead, you can use the new composition API
     */
    const extensionCallbacks = getCallbacksForMethod(method_name);
    // Execute each callback one after another

    if (!extensionCallbacks || extensionCallbacks.length === 0) {
 return false;
}
    let i = 0;

    do {
        // Get the extension function and execute it:
        await extensionCallbacks[i](payload);
    } while (++i !== extensionCallbacks.length);

return true;
}

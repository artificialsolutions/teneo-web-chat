import Vue from 'vue';

const tmpVue = new Vue();

export default async function handleExtension(method_name, payload) {
    // get list of callback functions for method name
    const extensionCallbacks = tmpVue.$extensionMethods.get(method_name);
    // execute each callback one after another
    if (!extensionCallbacks || extensionCallbacks.length === 0) return false;
    var i = 0;
    do {
        //Get the extension function and execute it:
        await extensionCallbacks[i](payload);
    } while (++i !== extensionCallbacks.length);
    return true;
}

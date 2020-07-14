import Vue from 'vue';
const tmpVue = new Vue();

export default async function handleExtension(method_name,payload) {

    var extensionCallback = tmpVue.$extensionMethods.get(method_name)
    if(extensionCallback){
        payload = await extensionCallback(payload);
    }
    return payload

}
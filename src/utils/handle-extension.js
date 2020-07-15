import Vue from 'vue';
const tmpVue = new Vue();

export default async function handleExtension(method_name,payload) {

    var extensionCallback = tmpVue.$extensionMethods.get(method_name)
    console.log("extensionCallback", extensionCallback)
    if(extensionCallback){
        for (let i = 0; i < extensionCallback.length; ++i) {
            let extension = extensionCallback[i];
            payload = await extension(payload);
        }
    }
    return payload
}
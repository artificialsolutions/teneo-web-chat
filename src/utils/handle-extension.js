import Vue from 'vue';
const tmpVue = new Vue();

export default async function handleExtension(method_name,payload) {
    // get list of callback functions for method name
    var extensionCallback = tmpVue.$extensionMethods.get(method_name)

    // execute each callback one after another
    if(extensionCallback){
        for (let i = 0; i < extensionCallback.length; ++i) {
            
            // temporary var to store result of extension
            var updatedPayload;

            // get the extension function
            let extension = extensionCallback[i];

            // execute fuction and store result in temporary var
            updatedPayload = await extension(payload);

            // only overwrite payload if it was updated
            if (updatedPayload !== undefined) {
                payload = updatedPayload
            }
        }
    }
    return payload
}
# TWC Messages JSON Schema

## Background

The file `messageschema.json` contains a [JSON Schema](https://json-schema.org/specification) for all valid messages which TWC can process. This file has been created from the [documentation on teneo.ai](https://developers.teneo.ai/resource/channels/teneo-web-chat#message-types)

This message schema is being included in the Web Chat code and will be used to validate incoming messages against the spec - if the message does not match the spec a warning will be logged in the console

The validation is performed using [ajv](https://ajv.js.org/api.html). This was chosen as it is [commonly used](https://www.npmjs.com/package/ajv), and is actually already in the project because it is [dependency of eslint](https://www.npmjs.com/package/eslint?activeTab=dependencies) - so it should be reliable.

## Updating the Schema

If the schema is changed there is a process to follow _after_ modifying the `messageschema.json` file

### Pre-compilation / Content Security Policy

When using ajv in a page with CSP enabled [certain considerations](https://ajv.js.org/security.html#content-security-policy) are needed. To this end there is a process to pre-compile the json schema into a validator class which is then included in the code and used at runtime.

This pre-compilation is achieved with the [ajv CLI](https://github.com/ajv-validator/ajv-cli#compile-schemas), and assuming it is run from the folder containing this documentation the [output flag](https://github.com/ajv-validator/ajv-cli?tab=readme-ov-file#-o---output-file-for-compiled-validation-function-module) can be used to directly update the compiled js in the source code with the follow command (this assumes ajv is installed):

```
ajv compile -s "messageschema.json" -o "..\..\src\utils\validate-message-schema.js"
```

### Import

There should be no changes needed here, other than rebuilding. The updated js file is imported by `src\utils\parse-teneo-response.js` and this should pick up the new version after re-compiling.
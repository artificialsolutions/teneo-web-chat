const capitalize = (s) => `${s[0].toUpperCase()}${s.slice(1).toLowerCase()}`;

const allowedTypeName = /^[a-z]+(-[a-z]+)*$/;

export default function messageComponentName(type) {
  if (!type.match(allowedTypeName)) {
    throw new TypeError(`'${type}' is not an allowed type name.`);
  }

  const words = type.split('-');
  const componentName = `${words.map(capitalize).join('')}Message`;

  return componentName;
}

const capitalize = (s) => {
  if (!s) {
    return s;
  }

  return `${s[0].toUpperCase()}${s.slice(1)}`;
};

export default function messageComponentName(type) {
  return `${capitalize(type)}Message`;
}

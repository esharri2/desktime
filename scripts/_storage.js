const setPreference = (event) => {
  const target = event.target;
  const { value, id, type, name } = target;
  if (type === "text") {
    localStorage.setItem(id, value);
    return;
  }
  localStorage.setItem(name, value);
};

const getPreference = (id) => {
  return localStorage.getItem(id);
};

export { setPreference, getPreference };

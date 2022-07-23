const setPreference = (event) => {
  const { value, id, type, name } = event.target;
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

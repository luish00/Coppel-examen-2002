const KEY_TOKEN = "@token";

function saveStorage({ value, key }) {
  localStorage.setItem(key, value)
}

function getStorage(key) {
  return localStorage.getItem(key);
}

function saveSessionStorage({ value, key }) {
  return sessionStorage.setItem(key, value)
}

function getSessionStorage(key) {
  return sessionStorage.getItem(key);
}

export function saveToken({ value, remember = false }) {
  const data = { key: KEY_TOKEN, value };

  if (remember) {
    saveStorage(data);
  } else {
    saveSessionStorage({ key: KEY_TOKEN, value });
  }
}

export async function getToken() {
  let token = await getSessionStorage(KEY_TOKEN);

  if (!token) {
    token = await getStorage(KEY_TOKEN);
  }

  return token;
}
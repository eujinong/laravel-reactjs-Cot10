class Storage {
  get(key, defaultValue) {
    const value = localStorage.getItem(key, defaultValue);
    return value;
  }

  set(key, value) {
    localStorage.setItem(key, value);
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  removeAll() {
    localStorage.clear();
  }

  saveToken(value) {
    this.set('token', value);
  }

  getToken() {
    return this.get('token');
  }

  setExpireDate(value) {
    this.set('expire_date', value);
  }

  getExpireDate() {
    return this.get('expire_date');
  }

  deleteAuthData() {
    this.remove('token');
    this.remove('expire_date');
  }

  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}

const storage = new Storage();

export default storage;

const useDictStore = defineStore("dict", {
  state: () => ({
    dict: {},
  }),
  actions: {
    // 获取字典
    getDict(_key) {
      if (_key == null && _key == "") {
        return null;
      }
      if (!!this.dict[_key]) {
        return this.dict[_key];
      } else {
        return null;
      }
    },
    // 设置字典
    setDict(_key, value) {
      if (_key !== null && _key !== "") {
        this.dict[_key] = value;
      }
    },
    // 删除字典
    removeDict(_key) {
      if (!!this.dict[_key]) {
        delete this.dict[_key];
        return true;
      } else {
        return false;
      }
    },
    // 清空字典
    cleanDict() {
      this.dict = {};
    },
    // 初始字典
    initDict() {},
  },
});

export default useDictStore;

const useConfigStore = defineStore("config", {
    state: () => ({
      config: {},
    }),
    actions: {
      // 获取
      getConfig(_key) {
        if (_key == null && _key == "") {
          return null;
        }
        if (!!this.config[_key]) {
          return this.config[_key];
        } else {
          return null;
        }
      },
      // 设置
      setConfig(_key, value) {
        if (_key !== null && _key !== "") {
          this.config[_key] = value;
        }
      },
      // 删除
      removeConfig(_key) {
        if (!!this.config[_key]) {
          delete this.config[_key];
          return true;
        } else {
          return false;
        }
      },
      // 清空
      cleanConfig() {
        this.config = {};
      },
      // 初始化
      initConfig() {},
    },
  });
  
  export default useConfigStore;
  
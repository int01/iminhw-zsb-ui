const useConfigStore = defineStore("config", {
    state: () => ({
      config: new Array(),
    }),
    actions: {
      // 获取
      getConfig(_key) {
        if (_key == null && _key == "") {
          return null;
        }
        try {
          for (let i = 0; i < this.config.length; i++) {
            if (this.config[i].key == _key) {
              return this.config[i].value;
            }
          }
        } catch (e) {
          return null;
        }
      },
      // 设置
      setConfig(_key, value) {
        if (_key !== null && _key !== "") {
          this.config.push({
            key: _key,
            value: value,
          });
        }
      },
      // 删除
      removeConfig(_key) {
        var bln = false;
        try {
          for (let i = 0; i < this.config.length; i++) {
            if (this.config[i].key == _key) {
              this.config.splice(i, 1);
              return true;
            }
          }
        } catch (e) {
          bln = false;
        }
        return bln;
      },
      // 清空字典
      cleanConfig() {
        this.config = new Array();
      },
      // 初始字典
      initConfig() {},
    },
  });
  
  export default useDictStore;
  
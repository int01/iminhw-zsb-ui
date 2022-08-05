import { getConfigKey } from "@/api/system/config";
import useConfigStore from "@/store/modules/config";

/**
 * 获取参数数据
 */
export function useConfig(...args) {
  const res = ref({});
  return (() => {
    args.forEach((configType) => {
      res.value[configType] = [];
      const configs = useConfigStore().getConfig(configType);
      if (configs) {
        res.value[configType] = configs;
      } else {
        getConfigKey(configType).then((resp) => {
          res.value[configType] = resp.msg;
          useConfigStore().setConfig(configType, res.value[configType]);
        });
      }
    });
    return toRefs(res.value);
  })();
}

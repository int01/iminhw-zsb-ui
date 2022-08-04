import { getConfigKey } from "@/api/system/config";
import useConfigStore from "@/store/modules/config";

/**
 * 获取参数数据
 */
export function useConfig(...args) {
  const res = ref({});
  return (() => {
    args.forEach((configType, index) => {
      res.value[configType] = [];
      const dicts = useConfigStore().getConfig(config);
      if (dicts) {
        res.value[configType] = dicts;
      } else {
        getConfigKey(configType).then((resp) => {
          res.value[configType] = resp.data.map((p) => ({
            label: p.dictLabel,
            value: p.dictValue,
            elTagType: p.listClass,
            elTagClass: p.cssClass,
          }));
          useConfigStore().setConfig(configType, res.value[configType]);
        });
      }
    });
    return toRefs(res.value);
  })();
}

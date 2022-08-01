import { getDicts } from "@/api/system/dict/data";
import useDictStore from "@/store/modules/dict";

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        getDicts(dictType).then((resp) => {
          res.value[dictType] = resp.data.map((p) => ({
            label: p.dictLabel,
            value: p.dictValue,
            elTagType: p.listClass,
            elTagClass: p.cssClass,
          }));
          useDictStore().setDict(dictType, res.value[dictType]);
        });
      }
    });
    return toRefs(res.value);
  })();
}

export function dictTagFun(options, key) {
  if (key == null) {
    return "";
  }
  const items = options.value;
  for (const index in items) {
    if (items[index].value == key) {
      return items[index].label;
    }
  }
  return key;
}

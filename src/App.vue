<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from "@/store/modules/settings";
import { handleThemeStyle } from "@/utils/theme";

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme);
  });
});

console.log(
  "%c 招生办管理系统 %c v2.1.0 ",
  "color:#fff;background-color:blue;line-height:20px;border-radius: 5px 0 0 5px",
  "color:#fff;background-color:orange;line-height:20px;border-radius: 0 5px 5px 0"
);

console.log(
  "%c Developer Email %c iminhw@qq.com ",
  "line-height:20px;background-color:blue;color:#fff; border-radius: 5px 0 0 5px",
  "line-height:20px; background-color:#008000; color:#fff; border-radius: 0 5px 5px 0"
);

console.log(
  "%c%c Any sufficiently advanced technology, at first glance, is indistinguishable from magic! ",
  "line-height:20px;color:#000;",
  "line-height:20px;background-image:-webkit-gradient(linear,left top,right top,color-stop(0,#ff22ff),color-stop(1,#5500ff));color:transparent;-webkit-background-clip:text;color:#fff; border-radius:5px;"
);
</script>

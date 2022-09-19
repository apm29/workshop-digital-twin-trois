import path from "path";
import { defineConfig } from "vite";
import vitePluginVue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Unocss from "unocss/vite";
import { splitVendorChunkPlugin } from "vite";
// https://vitejs.dev/config/
export default defineConfig({
  base: "/digital-twin-trois/",
  build: {
    minify: false
  },
  optimizeDeps: {
  },
  resolve: {
    // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    alias: [
      {
        find: "~/",
        replacement: `${path.resolve(__dirname, "src")}/`,
      },
    ],
  },
  plugins: [
    vitePluginVue(),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ["vue", "vue/macros", "@vueuse/core"],
      dts: true,
      dirs: ["./src/composables"],
      vueTemplate: true,
    }),
    // Components({
    //   resolvers: [ElementUiResolver()]
    // }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),
    splitVendorChunkPlugin(),
  ],
  server: {
    port: 6923,
    proxy: {
      "/java": {
        target: "http://atcc-workshoptest.ciih.net",
        changeOrigin: true,
      },
    },
  },
});

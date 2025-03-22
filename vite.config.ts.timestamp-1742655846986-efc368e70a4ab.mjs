// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/Work/mamlaka-map/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Work/mamlaka-map/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///D:/Work/mamlaka-map/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/Work/mamlaka-map/node_modules/unplugin-vue-components/dist/vite.js";
var __vite_injected_original_import_meta_url = "file:///D:/Work/mamlaka-map/vite.config.ts";
var vite_config_default = defineConfig({
  server: {
    port: 8080
    // proxy: {
    //   '/api': {
    //     target: "https://admin-rcmc.zimamapps.com/api/",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  },
  plugins: [
    vue(),
    AutoImport({
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json"
      },
      imports: ["vue", "vue-router", "@vueuse/core", "@vueuse/math", "pinia", "vue-i18n"],
      vueTemplate: true
    }),
    Components({
      dirs: [
        "src/components"
        // 'src/components/global',
      ],
      dts: true
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxXb3JrXFxcXG1hbWxha2EtbWFwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxXb3JrXFxcXG1hbWxha2EtbWFwXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Xb3JrL21hbWxha2EtbWFwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnO1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBUZXJzZXIgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJztcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogODA4MCxcclxuICAgIC8vIHByb3h5OiB7XHJcbiAgICAvLyAgICcvYXBpJzoge1xyXG4gICAgLy8gICAgIHRhcmdldDogXCJodHRwczovL2FkbWluLXJjbWMuemltYW1hcHBzLmNvbS9hcGkvXCIsXHJcbiAgICAvLyAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgLy8gICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJylcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfVxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgZXNsaW50cmM6IHtcclxuICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgIGZpbGVwYXRoOiAnLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvbidcclxuICAgICAgfSxcclxuICAgICAgaW1wb3J0czogWyd2dWUnLCAndnVlLXJvdXRlcicsICdAdnVldXNlL2NvcmUnLCAnQHZ1ZXVzZS9tYXRoJywgJ3BpbmlhJywgJ3Z1ZS1pMThuJ10sXHJcbiAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlXHJcbiAgICB9KSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICBkaXJzOiBbXHJcbiAgICAgICAgJ3NyYy9jb21wb25lbnRzJ1xyXG4gICAgICAgIC8vICdzcmMvY29tcG9uZW50cy9nbG9iYWwnLFxyXG4gICAgICBdLFxyXG4gICAgICBkdHM6IHRydWVcclxuICAgIH0pXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVAsU0FBUyxlQUFlLFdBQVc7QUFFcFIsU0FBUyxvQkFBNEI7QUFDckMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBTDRILElBQU0sMkNBQTJDO0FBUXBNLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBUVI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFdBQVc7QUFBQSxNQUNULFVBQVU7QUFBQSxRQUNSLFNBQVM7QUFBQSxRQUNULFVBQVU7QUFBQSxNQUNaO0FBQUEsTUFDQSxTQUFTLENBQUMsT0FBTyxjQUFjLGdCQUFnQixnQkFBZ0IsU0FBUyxVQUFVO0FBQUEsTUFDbEYsYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsTUFBTTtBQUFBLFFBQ0o7QUFBQTtBQUFBLE1BRUY7QUFBQSxNQUNBLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

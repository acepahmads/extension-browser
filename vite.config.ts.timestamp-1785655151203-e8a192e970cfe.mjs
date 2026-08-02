// vite.config.ts
import { defineConfig } from "file:///D:/cbi-project-src/BGN-Extension/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/cbi-project-src/BGN-Extension/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import { viteStaticCopy } from "file:///D:/cbi-project-src/BGN-Extension/node_modules/vite-plugin-static-copy/dist/index.js";
var __vite_injected_original_dirname = "D:\\cbi-project-src\\BGN-Extension";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: "src/manifest/manifest.json",
          dest: "."
        },
        {
          src: "public/icons/*",
          dest: "icons"
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === "development",
    rollupOptions: {
      input: {
        popup: resolve(__vite_injected_original_dirname, "src/popup/index.html"),
        options: resolve(__vite_injected_original_dirname, "src/options/index.html"),
        background: resolve(__vite_injected_original_dirname, "src/background/index.ts"),
        content: resolve(__vite_injected_original_dirname, "src/content/index.ts")
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background" || chunkInfo.name === "content") {
            return `${chunkInfo.name}/index.js`;
          }
          return "assets/[name]-[hash].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjYmktcHJvamVjdC1zcmNcXFxcQkdOLUV4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcY2JpLXByb2plY3Qtc3JjXFxcXEJHTi1FeHRlbnNpb25cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NiaS1wcm9qZWN0LXNyYy9CR04tRXh0ZW5zaW9uL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyB2aXRlU3RhdGljQ29weSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5JztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIHZpdGVTdGF0aWNDb3B5KHtcbiAgICAgIHRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogJ3NyYy9tYW5pZmVzdC9tYW5pZmVzdC5qc29uJyxcbiAgICAgICAgICBkZXN0OiAnLidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogJ3B1YmxpYy9pY29ucy8qJyxcbiAgICAgICAgICBkZXN0OiAnaWNvbnMnXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKVxuICAgIH1cbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICBzb3VyY2VtYXA6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIHBvcHVwOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9wb3B1cC9pbmRleC5odG1sJyksXG4gICAgICAgIG9wdGlvbnM6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL29wdGlvbnMvaW5kZXguaHRtbCcpLFxuICAgICAgICBiYWNrZ3JvdW5kOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9iYWNrZ3JvdW5kL2luZGV4LnRzJyksXG4gICAgICAgIGNvbnRlbnQ6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2NvbnRlbnQvaW5kZXgudHMnKVxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogKGNodW5rSW5mbykgPT4ge1xuICAgICAgICAgIGlmIChjaHVua0luZm8ubmFtZSA9PT0gJ2JhY2tncm91bmQnIHx8IGNodW5rSW5mby5uYW1lID09PSAnY29udGVudCcpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtjaHVua0luZm8ubmFtZX0vaW5kZXguanNgO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJztcbiAgICAgICAgfSxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uW2V4dF0nXG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1IsU0FBUyxvQkFBb0I7QUFDclQsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUN4QixTQUFTLHNCQUFzQjtBQUgvQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixlQUFlO0FBQUEsTUFDYixTQUFTO0FBQUEsUUFDUDtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQy9CO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsYUFBYTtBQUFBLElBQ2IsV0FBVyxRQUFRLElBQUksYUFBYTtBQUFBLElBQ3BDLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE9BQU8sUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxRQUNoRCxTQUFTLFFBQVEsa0NBQVcsd0JBQXdCO0FBQUEsUUFDcEQsWUFBWSxRQUFRLGtDQUFXLHlCQUF5QjtBQUFBLFFBQ3hELFNBQVMsUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxNQUNwRDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCLENBQUMsY0FBYztBQUM3QixjQUFJLFVBQVUsU0FBUyxnQkFBZ0IsVUFBVSxTQUFTLFdBQVc7QUFDbkUsbUJBQU8sR0FBRyxVQUFVLElBQUk7QUFBQSxVQUMxQjtBQUNBLGlCQUFPO0FBQUEsUUFDVDtBQUFBLFFBQ0EsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

import react from "@vitejs/plugin-react";
import "dotenv/config";

/**
 * @type {import('vite').UserConfig}
 */
export default {
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
    "process.env.SHOP": JSON.stringify(process.env.SHOP),
    "process.env.X_SHOPIFY_ACCESS_TOKEN": JSON.stringify(
      process.env.X_SHOPIFY_ACCESS_TOKEN
    ),
    "process.env.X_SHOPIFY_STOREFRONT_ACCESS_TOKEN": JSON.stringify(
      process.env.X_SHOPIFY_STOREFRONT_ACCESS_TOKEN
    ),
    "process.env.HOST": JSON.stringify(process.env.HOST),
  },
  resolve: {
    alias: {
      // I needed this to make dev mode work.
      "react/jsx-runtime": "react/jsx-runtime.js",
    },
  },
  plugins: [react()],
  // plugins: [
  //   react({
  //     babel: {
  //       plugins: [
  //         ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],
  //       ],
  //     },
  //   }),
  // ],
};

import nextVitals from "eslint-config-next/core-web-vitals";

export default [
  {
    ignores: ["**/.next/**", "**/coverage/**", "**/dist/**", "**/node_modules/**"],
  },
  ...nextVitals,
];

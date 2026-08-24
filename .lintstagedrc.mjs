export default {
  "app-frontend/**/*.{ts,tsx,js,jsx}":
    "npm --prefix app-frontend exec -- eslint --config app-frontend/eslint.config.mjs --fix --max-warnings 0 --no-warn-ignored",
  "app-frontend/**/*.{ts,tsx,js,jsx,css,md}":
    "npm --prefix app-frontend exec -- prettier --write",
};

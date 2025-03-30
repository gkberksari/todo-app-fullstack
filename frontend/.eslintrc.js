module.exports = {
    extends: [
      "react-app",
      "react-app/jest",
      "prettier"
    ],
    plugins: [
      "prettier"
    ],
    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }
  };
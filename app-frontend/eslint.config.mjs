// @ts-check
import { dirname } from "path";
import { fileURLToPath } from "url";

import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginImport from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Main config ──────────────────────────────────────────────────────────────
export default tseslint.config(
    // ── Global ignores ──────────────────────────────────────────────────────
    {
        ignores: [
            ".next/**",
            "node_modules/**",
            "out/**",
            "dist/**",
            "coverage/**",
            "*.config.{js,cjs,mjs,ts}",
            "postcss.config.*",
        ],
    },

    // ── Next.js core config (native flat config) ────────────────────────────
    ...nextCoreWebVitals,

    // ── TypeScript-aware rules ───────────────────────────────────────────────
    ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: __dirname,
            },
        },
    },

    // ── Project-wide settings and rules ─────────────────────────────────────
    {
        settings: {
            react: { version: "detect" },
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.json",
                },
            },
        },

        rules: {
            // ── TypeScript ──────────────────────────────────────────────────
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/consistent-type-imports": [
                "error",
                { prefer: "type-imports", fixStyle: "inline-type-imports" },
            ],
            "@typescript-eslint/consistent-type-exports": "error",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/no-misused-promises": [
                "error",
                { checksVoidReturn: { attributes: false } },
            ],
            "@typescript-eslint/no-unnecessary-type-assertion": "error",
            "@typescript-eslint/prefer-nullish-coalescing": "warn",
            "@typescript-eslint/prefer-optional-chain": "warn",
            "@typescript-eslint/no-unsafe-assignment": "warn",
            "@typescript-eslint/no-unsafe-call": "warn",
            "@typescript-eslint/no-unsafe-member-access": "warn",
            "@typescript-eslint/no-unsafe-return": "warn",
            "@typescript-eslint/no-unsafe-argument": "warn",
            "@typescript-eslint/restrict-template-expressions": "warn",

            // ── React ───────────────────────────────────────────────────────
            "react/react-in-jsx-scope": "off", // Not needed in React 17+
            "react/prop-types": "off", // TypeScript handles this
            "react/jsx-no-target-blank": "error",
            "react/jsx-key": ["error", { checkFragmentShorthand: true }],
            "react/no-array-index-key": "warn",
            "react/no-unstable-nested-components": "error",
            "react/self-closing-comp": "warn",
            "react/hook-use-state": "warn",
            "react/jsx-boolean-value": ["warn", "never"],
            "react/jsx-curly-brace-presence": [
                "warn",
                { props: "never", children: "never" },
            ],
            "react/no-danger": "error",
            "react/display-name": "error",

            // ── React Hooks ─────────────────────────────────────────────────
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // ── Accessibility (jsx-a11y) ────────────────────────────────────
            "jsx-a11y/alt-text": "error",
            "jsx-a11y/anchor-has-content": "error",
            "jsx-a11y/anchor-is-valid": "error",
            "jsx-a11y/aria-props": "error",
            "jsx-a11y/aria-proptypes": "error",
            "jsx-a11y/aria-role": "error",
            "jsx-a11y/aria-unsupported-elements": "error",
            "jsx-a11y/click-events-have-key-events": "warn",
            "jsx-a11y/interactive-supports-focus": "warn",
            "jsx-a11y/label-has-associated-control": "error",
            "jsx-a11y/no-noninteractive-element-interactions": "warn",
            "jsx-a11y/role-has-required-aria-props": "error",
            "jsx-a11y/role-supports-aria-props": "error",

            // ── Import ordering & hygiene ───────────────────────────────────
            "import/no-duplicates": "error",
            "import/no-self-import": "error",
            "import/no-cycle": "warn",
            "import/no-useless-path-segments": "warn",
            "import/first": "error",
            "import/newline-after-import": "error",
            "import/no-default-export": "off", // Next.js pages require default exports
            "import/consistent-type-specifier-style": [
                "error",
                "prefer-inline",
            ],

            // ── General best practices ──────────────────────────────────────
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "error",
            "no-alert": "error",
            eqeqeq: ["error", "always", { null: "ignore" }],
            "prefer-const": "error",
            "no-var": "error",
            "object-shorthand": ["warn", "always"],
            "prefer-template": "warn",
            "no-nested-ternary": "warn",
            curly: ["error", "all"],
            "no-return-assign": "error",
            "no-param-reassign": [
                "error",
                {
                    props: true,
                    ignorePropertyModificationsFor: [
                        "acc", // Reducer accumulators
                        "ref", // React refs
                    ],
                },
            ],
            "no-shadow": "off", // Use TS version instead
            "@typescript-eslint/no-shadow": "error",
        },
    },

    // ── Relaxed rules for config / script files ──────────────────────────────
    {
        files: ["**/*.config.{js,ts,mjs,cjs}", "scripts/**/*.{js,ts}"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
            "import/no-default-export": "off",
            "no-console": "off",
        },
    },
);

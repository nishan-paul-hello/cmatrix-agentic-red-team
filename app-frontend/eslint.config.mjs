// @ts-check
import { dirname } from "path";
import { fileURLToPath } from "url";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

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
        plugins: {
            "unused-imports": unusedImports,
        },
        settings: {
            react: { version: "detect" },
            next: {
                rootDir: "app-frontend/",
            },
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
            "@typescript-eslint/no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
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
            "@typescript-eslint/prefer-nullish-coalescing": "error",
            "@typescript-eslint/prefer-optional-chain": "error",
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            "@typescript-eslint/no-unnecessary-condition": [
                "error",
                { allowConstantLoopConditions: true },
            ],
            "@typescript-eslint/no-confusing-void-expression": [
                "error",
                { ignoreArrowShorthand: true },
            ],
            "@typescript-eslint/no-meaningless-void-operator": "error",
            "@typescript-eslint/no-unnecessary-template-expression": "error",

            // ── React ───────────────────────────────────────────────────────
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "react/prop-types": "off",
            "react/jsx-no-target-blank": "error",
            "react/jsx-key": ["error", { checkFragmentShorthand: true }],
            "react/no-array-index-key": "error",
            "react/no-unstable-nested-components": "error",
            "react/self-closing-comp": "error",
            "react/hook-use-state": "off",
            "react/jsx-boolean-value": ["error", "never"],
            "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
            "react/no-danger": "error",
            "react/display-name": "error",
            "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
            "react/no-children-prop": "error",
            "react/no-direct-mutation-state": "error",

            // ── React Hooks ─────────────────────────────────────────────────
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "error",

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
            "import/no-cycle": "error",
            "import/no-useless-path-segments": "error",
            "import/first": "error",
            "import/newline-after-import": "error",
            "import/no-default-export": "off",
            "import/consistent-type-specifier-style": ["error", "prefer-inline"],

            // ── General best practices ──────────────────────────────────────
            "no-console": ["error", { allow: ["warn", "error"] }],
            "no-debugger": "error",
            "no-alert": "error",
            eqeqeq: ["error", "always", { null: "ignore" }],
            "prefer-const": "error",
            "no-var": "error",
            "object-shorthand": ["error", "always"],
            "prefer-template": "error",
            "no-nested-ternary": "error",
            curly: ["error", "all"],
            "no-return-assign": "error",
            "no-param-reassign": [
                "error",
                {
                    props: true,
                    ignorePropertyModificationsFor: ["acc", "ref", "e", "ev", "event"],
                },
            ],
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "error",
            "no-sequences": "error",
            "no-fallthrough": "error",
            "default-case": "error",
            "no-cond-assign": ["error", "always"],
            "no-duplicate-case": "error",
            "no-extra-boolean-cast": "error",
            "no-unreachable": "error",
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

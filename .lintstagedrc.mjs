import path from "node:path";

const buildEslintCommand = filenames =>
    `eslint --fix ${filenames
        .map(f => path.relative(process.cwd(), f))
        .join(" ")}`;

const lintStagedConfig = {
    "*.{json,jsonc,md,mjs,yml,yaml}": "prettier --write",
    "*.{js,jsx,ts,tsx}": [buildEslintCommand, "prettier --write"]
};

export default lintStagedConfig;

import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/src-vscode/**', '**/.vscode-test-web/**', '**/media/assets/**', '**/esbuild.js', '**/esbuild.web.js'],
  },
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": 'warn',
      "@typescript-eslint/no-empty-object-type": 'warn',
      "@typescript-eslint/no-unused-vars": ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    }
  },
];
export default {
  // Pass absolute file paths to the frontend's lint and format commands
  'app-frontend/**/*.{ts,tsx,js,jsx}': (filenames) =>
    `bash -c "cd app-frontend && npm exec -- eslint --fix --max-warnings 0 --no-warn-ignored ${filenames.join(' ')}"`,
  'app-frontend/**/*.{ts,tsx,js,jsx,css,md}': (filenames) =>
    `bash -c "cd app-frontend && npm exec -- prettier --write ${filenames.join(' ')}"`,
  // Future: 'app-backend/**/*.py': (filenames) => [ ... ]
};

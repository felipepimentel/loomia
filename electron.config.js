module.exports = {
  appId: 'com.myapp.electron',
  directories: {
    output: 'dist',
  },
  files: ['dist/**/*'],
  mac: {
    category: 'public.app-category.productivity',
  },
  win: {
    target: 'nsis',
  },
  linux: {
    target: 'AppImage',
    category: 'Utility',
  },
};

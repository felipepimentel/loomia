module.exports = {
    stories: ['../packages/components/src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-essentials'],
    framework: '@storybook/react',
    core: {
      builder: 'storybook-builder-vite'
    }
  };
  
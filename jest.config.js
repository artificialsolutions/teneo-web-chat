module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
    testPathIgnorePatterns: ['/node_modules/'],
    moduleFileExtensions: ['js', 'jsx', 'ejs', 'ejx'],
    setupFilesAfterEnv: ['<rootDir>/tests/unit/teneoWebChatComponentsTest.spec.js']
  }
  
module.exports = {
  verbose: true,
  bail: true,
  roots: [
    'src'
  ],
  testRegex: '/__tests__/.+\\.spec\\.tsx?$',
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node'
  ],
  testURL: 'http://localhost'
};

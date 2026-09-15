module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', '<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-expo|react-native|expo(nent)?|@expo(nent)?/.*|@react-native-community|@react-native|expo-modules-core|expo-file-system|expo-media-library))'
  ],
};

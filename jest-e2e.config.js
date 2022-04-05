module.exports = {
  roots: ['.'],
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/modules/**/*.ts',
    '!<rootDir>/src/modules/**/*.module.ts',
    '!<rootDir>/src/modules/**/*.exception.ts'
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
}

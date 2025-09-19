// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        'app/graphql/gql/**',
        '**/*.d.ts',
      ],
    },
    projects: [
      // Unit tests (no Nuxt runtime)
      {
        test: {
          name: 'unit',
          include: ['./tests/unit/**/*.test.ts'],
          setupFiles: ['./tests/setup-unit.ts'],
          environment: 'node',
        },
      },
      // Nuxt-integrated tests
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['./tests/nuxt/**/*.test.ts'],
          setupFiles: ['./tests/setup.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})

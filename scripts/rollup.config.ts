import path from 'path'

import replace from '@rollup/plugin-replace'
import type { RollupOptions, ExternalOption } from 'rollup'
import esbuild, { minify } from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

const rootDir = path.resolve(__dirname, '..')

const plugin = {
  dts: dts(),
  esbuild: esbuild({
    target: 'ES2019'
  }),
  minify: minify({
    target: 'ES2019'
  }),
  replace: {
    esm: replace({
      preventAssignment: true,
      objectGuard: true,
      __DEV__: "(process.env.NODE_ENV !== 'production')"
    }),
    dev: replace({
      preventAssignment: true,
      objectGuard: true,
      __DEV__: true,
      'process.env.NODE_ENV': null
    }),
    prod: replace({
      preventAssignment: true,
      objectGuard: true,
      __DEV__: false,
      'process.env.NODE_ENV': "'production'"
    })
  }
} as const

type PackageName = 'example'

const input = (name: PackageName, file = 'index') =>
  `packages/${name}/src/${file}.ts`

const baseExternals: ExternalOption = []

const configs: RollupOptions[] = [
  {
    input: input('example'),
    output: {
      file: 'packages/example/dist/index.mjs',
      format: 'esm'
    },
    plugins: [plugin.replace.esm, plugin.esbuild]
  },
  {
    input: input('example'),
    output: [
      {
        file: `packages/example/dist/index.cjs`,
        format: 'cjs'
      },
      {
        file: `packages/example/dist/index.iife.js`,
        format: 'iife',
        name: 'Example',
        extend: true
      }
    ],
    plugins: [plugin.replace.dev, plugin.esbuild]
  },
  {
    input: input('example'),
    output: [
      {
        file: `packages/example/dist/index.min.cjs`,
        format: 'cjs',
        plugins: [plugin.minify]
      },
      {
        file: `packages/example/dist/index.iife.min.js`,
        format: 'iife',
        name: 'Example',
        extend: true,
        plugins: [plugin.minify]
      }
    ],
    plugins: [plugin.replace.prod, plugin.esbuild]
  },
  {
    input: input('example'),
    output: {
      file: 'packages/example/dist/index.d.ts',
      format: 'esm'
    },
    plugins: [plugin.dts]
  }
]

configs.forEach(config => {
  if (config.external) {
    if (!Array.isArray(config.external)) {
      throw new Error('External must be an array')
    }
    config.external.push(...baseExternals)
  } else {
    config.external = baseExternals
  }
})

export default configs

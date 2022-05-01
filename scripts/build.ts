import { run } from './utils'

await run('rollup', ['--config'])

console.log()
console.log('Formatting declaration files ...')
await run('pnpm', ['exec', 'prettier', '--write', '**/dist/index.d.ts'])

console.log()
console.log('Done! 🎉')

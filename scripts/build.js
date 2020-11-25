const cmd = require('node-cmd')
console.log(process.cwd())
console.log('\nbuilding...')
console.log('\nlinting...')

function execCmd(_cmd) {
  const proc = cmd.runSync(_cmd)

  proc.stderr && console.log(proc.stderr)
  console.log(proc.err ? proc.err : proc.data)
}

execCmd('npm run lint')

console.log('\ncleaning everything...')

execCmd('npm run clean')

console.log('\ncompiling...')

execCmd('npm run transpile')

execCmd('cp -r ./dist/src/* ./dist')
execCmd('rm -rf ./dist/src')

console.log('\nBuild Completed.')

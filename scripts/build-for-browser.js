import { join } from 'path'
import { readFileSync } from 'fs'

const maskCode = readFileSync(join(__dirname, `../lib/mask.js`), {
  encoding: 'utf8'
})

process.stdout.write(maskCode.replace('export default', 'this.mask = '))

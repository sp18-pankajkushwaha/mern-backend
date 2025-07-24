import fs from 'fs/promises'

console.log(1)

fs.readFile('asyncWrite.doc', 'utf8')
.then(data=>console.log('File read Successfully:',data))
.catch(err=>console.log(err))

console.log(2)
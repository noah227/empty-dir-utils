const fs = require("fs")
const path = require("path")

const projectRoot = path.resolve("../")
for (let i = 5; i--;) {
    const dir = `empty-${i}`
    fs.mkdirSync(path.resolve(projectRoot, dir))
}

#!/usr/bin/env node

const {Command} = require("commander")
const chalk = require("chalk")
const program = new Command()
const path = require("path")

const pkg = require(path.resolve(__dirname, "../package.json"))
console.log(chalk.greenBright(`${pkg.name.toUpperCase()} POWERED`))

// 注册版本及描述信息
program
    .name("emp")
    .description("Utils for empty dirs")
    .version(`${pkg.name}@${pkg.version}`)

// 注册支持的命令及执行函数
program
    .command("search <operation-path>")
    .description("search empty dirs")
    // .option("-r, --recursive", "If recursively search")
    .option("-v, --verbose", "Verbose log in console")
    .option("--prompt", "Prompt next operation")
    .action((p, options) => {
        const {verbose, prompt} = options
        require("./actions").searchEmptyDirs(
            p, false, true, verbose, prompt
        )
    })

program
    .command("remove <operation-path>")
    .description("search and remove empty dirs")
    .option("-l, --log", "Log in console")
    .option("-v, --verbose", "Verbose log in console")
    .action((p, options) => {
        const {log, verbose} = options
        require("./actions").removeEmptyDirs(
            p, false, log, verbose, false,
        )
    })

// 执行参数处理
program.parse()

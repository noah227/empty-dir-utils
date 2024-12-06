const path = require("path")
const fs = require("fs")
const chalk = require("chalk")

/**
 * @param p {string} path to search
 * @param r {boolean} whether recursively search, not enabled yet!
 * @param log {boolean} whether log result in console
 * @param verbose {boolean} verbose log, only valid when log is true
 * @param promptNext {boolean} prompt next step
 */
const searchEmptyDirs = (
    p, r = false,
    log = true, verbose = false,
    promptNext = false
) => {
    const searchContext = path.resolve(process.cwd(), p)
    console.log(chalk.cyan("Search context: "), searchContext)
    const emptyDirs = fs.readdirSync(searchContext, {withFileTypes: true}).reduce((emptyDirs, d) => {
        const fullPath = path.join(d.parentPath, d.name)
        if (d.isDirectory() && !fs.readdirSync(fullPath).length) {
            emptyDirs.push({
                ...d,
                fullPath,
                meta: getMetaInfo(fullPath)
            })
        }
        return emptyDirs
    }, [])
    console.log(chalk.cyan("Search Result: "), `${emptyDirs.length} empty dirs`)
    if (log) {
        console.log(chalk.cyan("List of empty dirs: "))
        verbose ?
            console.table(
                emptyDirs.map(d => ({
                    path: d.fullPath,
                    createdAt: d.meta?.createdAt,
                    modifiedAt: d.meta?.modifiedAt
                }))
            )
            : console.log(emptyDirs.map(d => d.name).join("\n"))
    }
    promptNext && require("@inquirer/prompts").select({
        message: "Select your next operation",
        choices: [
            {name: "Quit", value: "Quit"},
            {
                name: "Remove these files", value: "Remove",
                description: chalk.yellow(`All ${emptyDirs.length} empty dirs will be removed!`)
            },
        ]
    }).then(result => {
        if (result === "Remove") removeEmptyDirs(p, r, true, verbose, true, emptyDirs)
    }).catch(e => {
        handleError(e)
    })
    return emptyDirs
}


/**
 *
 * @param p {string}
 */
const getMetaInfo = (p) => {
    const stat = fs.statSync(p)
    return {
        createdAt: stat.birthtime.toLocaleString(),
        modifiedAt: stat.mtime.toLocaleString()
    }
}

/**
 * @param p {string} path to search
 * @param r {boolean} whether recursively search
 * @param log {boolean} log in console
 * @param verbose {boolean} verbose log
 * @param autoConfirm need no confirmation
 * @param emptyDirs {Array<any>}
 */
const removeEmptyDirs = (
    p, r = false,
    log = false, verbose = false,
    autoConfirm = false,
    emptyDirs = null
) => {
    emptyDirs = emptyDirs || searchEmptyDirs(p, r, log, verbose)
    if (!emptyDirs.length) return console.warn(chalk.yellow(`No empty dirs searched in ${p}`))

    /** @param remove {boolean} */
    const action = (remove) => {
        remove && emptyDirs.forEach(d => {
            const _ = d.fullPath
            fs.rmdirSync(_)
            console.log(`${_} removed!`)
        })
    }
    if (autoConfirm) return action(true)

    require("@inquirer/prompts").confirm({
        message: chalk.yellow(`Remove all ${emptyDirs.length} empty dirs?`),
    }).then(result => {
        action(result)
    }).catch(e => {
        handleError(e)
    })
}

/**
 * @param e {Error}
 */
const handleError = (e) => {
    switch (e.name) {
        case "ExitPromptError":
            console.warn(e.name)
            break
        default:
            console.error(e)
    }
}

module.exports = {
    searchEmptyDirs,
    removeEmptyDirs
}

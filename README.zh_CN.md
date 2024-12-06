# Empty Dir Utils

> Search
> & Remove Empty Directories.

## How to use

```shell
emp --help
emp search --help
emp remove --help
```

### Search within given context

```shell
# basic usage
emp search ./
# with verbose log
emp search ./ -v
# continuous operations
emp search ./ --prompt
```

### Remove within given context

```shell
# basic usage
emp remove ./
# with log
emp remove ./ -l
# with verbose log
emp remove ./ -l -v
```

# Empty Dir Utils

> 空文件夹查询和删除工具

## 使用

```shell
emp --help
emp search --help
emp remove --help
```

### 查询给定路径下的空文件夹

```shell
# basic usage
emp search ./
# with verbose log
emp search ./ -v
# continuous operations
emp search ./ --prompt
```

### 删除给定路径下的空文件夹

```shell
# basic usage
emp remove ./
# with log
emp remove ./ -l
# with verbose log
emp remove ./ -l -v
```

## 更多

操作为单级操作，非递归深层路径！

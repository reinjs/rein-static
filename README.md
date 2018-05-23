# rein-static

## Install

```shell
npm i @reinjs/rein-static
```

## usage

基本配置请看 [https://www.npmjs.com/package/koa-static#options](https://www.npmjs.com/package/koa-static#options)

多个静态目录请将配置改成数组即可

关于HistoryApiFallback配置

- 如果配置直接为true，默认开启转移到定义的'index'属性上
- 如果多个匹配，以{from, to}的数组存在 @from: 匹配URI的规则 @to: 指向到哪个目录的地址 相对地址 相对于URL

# License

It is [MIT licensed](https://opensource.org/licenses/MIT).
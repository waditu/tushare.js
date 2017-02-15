# v0.3.1

> 获取指定年月限售解禁股数据

```
stock.getXSGData()
```

# v0.3.0

> 目标同时支持browser和nodejs环境，因此改用fetch替换掉superagent.

### 这个比较大的改动：
使用fetch，因为接口返回改为promise，而不是之前的callback


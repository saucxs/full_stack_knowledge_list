## 前言
最近在重构公司之前的代码，的确遇到很多问题，作为记录。

## ts如何为对象动态分配属性
```
interface IVariant {
  id: number;
  value: string;
}

var data: {key: string, variant: IVariant[]} = {
  key: 'saucxs',
  variant: [{
    id: 12,
    value: 'hello',
  }]
}

data.variant.map((v: IVariant) => {
  const configData: {[key: string]: any} = {};
  configData[data.key] = v.value;
})
```
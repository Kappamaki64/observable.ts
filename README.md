# observable.ts

リアクティブプログラミングのための簡単な TypeScript のソースコードです。

[じゃぱりぱーく・おんらいん](https://trap.jp/post/1322/)というゲームを作る際に、便利モジュールとして需要が生まれたため作成しました。
UniRx の影響を受けています。

## 使用例

`Observable<T>`を用いて、イベントを購読したり通知したりできます。

```ts
const observable: ObservableInterface<number> = new Observable()
observable
  .filter((arg): boolean => {
    return arg % 2 === 0
  })
  .filter((arg) => arg > 5)
  .addObserver((arg: number): void => {
    console.log(arg)
  })

for (let i = 0; i < 10; i++) observable.notify(i)
// expected output:
// 6
// 8
```

`ReactiveProperty<T>`を用いて、「値が代入されたとき」というイベントを購読することができます。

```ts
const reactiveNumber: ReactivePropertyInterface<number> = new ReactiveProperty(
  0
)
reactiveNumber.addObserver((number): void => {
  console.log(`notified number: ${number}`)
})
console.log(`initial number: ${reactiveNumber.value}`)
// expected output:
// initial number: 0

reactiveNumber.set(1)
// expected output:
// notified number: 1

reactiveNumber.value = 2
// expected output:
// notified number: 2

reactiveNumber.value += 1
// expected output:
// notified number: 3
```

`ObserveOnly<O extends ObservableInterface<unknown>>`を用いて、型の制約をかけ、イベントの購読のみを許可し、イベントの通知を禁止することができます。

```ts
function exampleFunctionOfObserveOnly(
  reactiveNumber: ObserveOnly<ReactivePropertyInterface<number>>
): void {
  // addObserver, removeObserver, clearObserverなどは使用できる
  reactiveNumber.addObserver((number): void => {
    console.log(`notified number: ${number}`)
  })

  // 値を読み取ることもできる
  console.log(`initial number: ${reactiveNumber.value}`)

  // ただし、以下のように値を変えようとするとコンパイルエラーになる
  // reactiveNumber.set(1) // プロパティ 'set' は型 'ObserveOnly<ReactivePropertyInterface<number>>' に存在しません。
  // reactiveNumber.value = 2 // 読み取り専用プロパティであるため、'value' に代入することはできません。
  // reactiveNumber.value += 1 // 読み取り専用プロパティであるため、'value' に代入することはできません。
}
```

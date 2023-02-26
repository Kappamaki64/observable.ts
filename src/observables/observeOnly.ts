// ObserveOnly<>されたObservableのinterface
// Observableの型引数が取得出来ないためinterfaceで定義できなかった
type ObserveOnlyInterface =
  // Observable
  | 'filter'
  | 'addObserver'
  | 'removeObserver'
  | 'clearObserver'
  // Reactive
  | 'value'
  | 'toUnreactive'
  // ReactiveArray
  | 'onSetAt'
  | 'onCopyWithin'
  | 'onFill'
  | 'onPop'
  | 'onPush'
  | 'onReverse'
  | 'onShift'
  | 'onSort'
  | 'onSplice'
  | 'onUnshift'
  // ReactiveObject
  | 'onSetValueOf'
  | 'onDelete'

export type ObserveOnly<O> = {
  readonly [key in keyof O & ObserveOnlyInterface]: O[key]
}

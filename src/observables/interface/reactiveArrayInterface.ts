import { ReactiveInterface } from './reactiveInterface'
import { ObservableInterface } from './observableInterface'

/**
 * Array<T>の要素の変更や破壊的な操作を通知するオブジェクトのインターフェース
 * @param T 配列の要素の型
 * @example
 * const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
 * reactiveNumbers.addObserver((numbers): void => {
 *   console.log('notified numbers: ' + numbers)
 * })
 * console.log('initial array: ' + reactiveNumbers.value)
 * // expected output:
 * // initial array: 0,1,2
 * reactiveNumbers.set([3, 4, 5])
 * // expected output:
 * // notified number: 3,4,5
 * reactiveNumbers.value = [6, 7, 8]
 * // expected output:
 * // notified number: 6,7,8
 * console.log('change into unreactive: ' + reactiveNumbers.toUnreactive)
 * // expected output:
 * // change into unreactive: 6,7,8
 */
export interface ReactiveArrayInterface<T>
  extends ReactiveInterface<Readonly<T[]>, T[]> {
  // getterとsetterが両方存在する
  value: Readonly<T[]>

  /**
   * 指定されたindexの要素に新しい値を代入し、通知します
   * @param index 代入する要素のindex
   * @param newValueOfProperty 代入する値
   */
  setAt(index: number, newValueOfProperty: T): void

  /**
   * setAt(index, newValueOfProperty)を用いて要素に値が代入されたときに通知されます
   * @param number 代入された要素のindex
   * @example
   * const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
   * reactiveNumbers.addObserver((numbers): void => {
   *   console.log('rootObserver: ' + numbers)
   * })
   * reactiveNumbers.onSetAt.addObserver((index): void => {
   *   console.log('set index: ' + index)
   *   console.log('set value: ' + reactiveNumbers.value[index])
   * })
   * reactiveNumbers.setAt(1, 10)
   * // expected output:
   * // rootObserver: 0,10,2
   * // set index: 1
   * // set value: 10
   */
  readonly onSetAt: ObservableInterface<number>

  /**
   * copyWithinメソッドを用いて配列の要素が操作されたときに通知されます
   * @param T[] 操作後の配列
   * @example
   * const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
   * reactiveNumbers.addObserver((numbers): void => {
   *   console.log('rootObserver: ' + numbers)
   * })
   * reactiveNumbers.onCopyWithin.addObserver((numbers): void => {
   *   console.log('copyWithinObserver: ' + numbers)
   * })
   * reactiveNumbers.copyWithin(0, 1, 2)
   * // expected output:
   * // rootObserver: 1,1,2
   * // copyWithinObserver: 1,1,2
   */
  readonly onCopyWithin: ObservableInterface<T[]>

  /**
   * fillメソッドを用いて配列の要素が操作されたときに通知されます
   * @param T[] 操作後の配列
   * @example
   * const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
   * reactiveNumbers.addObserver((numbers): void => {
   *   console.log('rootObserver: ' + numbers)
   * })
   * reactiveNumbers.onFill.addObserver((numbers): void => {
   *   console.log('fillObserver: ' + numbers)
   * })
   * reactiveNumbers.fill(1)
   * // expected output:
   * // rootObserver: 1,1,1
   * // fillObserver: 1,1,1
   */
  readonly onFill: ObservableInterface<T[]>

  /**
   * popメソッドを用いて配列の要素が取り出されたときに通知されます
   * @param T | undefined 取り出された配列の要素
   * @example
   * const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
   * reactiveNumbers.addObserver((numbers): void => {
   *   console.log('rootObserver: ' + numbers)
   * })
   * reactiveNumbers.onPop.addObserver((number): void => {
   *   console.log('pop value: ' + number)
   * })
   * reactiveNumbers.pop()
   * // expected output:
   * // rootObserver: 0,1
   * // pop value: 2
   */
  readonly onPop: ObservableInterface<T | undefined>

  /**
   * pushメソッドを用いて配列の要素が追加されたときに通知されます
   * @param T[] 追加された要素の配列
   * @example
   * const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
   * reactiveNumbers.addObserver((numbers): void => {
   *   console.log('rootObserver: ' + numbers)
   * })
   * reactiveNumbers.onPush.addObserver((numbers): void => {
   *   console.log('pushed array: ' + numbers)
   * })
   * reactiveNumbers.push(3, 4)
   * // expected output:
   * // rootObserver: 0,1,2,3,4
   * // pushed array: 3,4
   */
  readonly onPush: ObservableInterface<T[]>

  /**
   * reverseメソッドを用いて配列の要素が操作されたときに通知されます
   * @param T[] 操作後の配列
   * @example
   * const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
   * reactiveNumbers.addObserver((numbers): void => {
   *   console.log('rootObserver: ' + numbers)
   * })
   * reactiveNumbers.onReverse.addObserver((numbers): void => {
   *   console.log('reverseObserver: ' + numbers)
   * })
   * reactiveNumbers.reverse()
   * // expected output:
   * // rootObserver: 2,1,0
   * // reverseObserver: 2,1,0
   */
  readonly onReverse: ObservableInterface<T[]>

  /**
   * shiftメソッドを用いて配列の要素が取り出されたときに通知されます
   * @param T | undefined 取り出された配列の要素
   * @example
   * const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
   * reactiveNumbers.addObserver((numbers): void => {
   *   console.log('rootObserver: ' + numbers)
   * })
   * reactiveNumbers.onShift.addObserver((number): void => {
   *   console.log('shifted value: ' + number)
   * })
   * reactiveNumbers.shift()
   * // expected output:
   * // rootObserver: 1,2
   * // shifted value: 0
   */
  readonly onShift: ObservableInterface<T | undefined>

  /**
   * sortメソッドを用いて配列の要素が操作されたときに通知されます
   * @param T[] 操作後の配列
   * @example
   * const reactiveNumbers = new ReactiveArray<number>([1, 2, 0])
   * reactiveNumbers.addObserver((numbers): void => {
   *   console.log('rootObserver: ' + numbers)
   * })
   * reactiveNumbers.onSort.addObserver((numbers): void => {
   *   console.log('sortObserver: ' + numbers)
   * })
   * reactiveNumbers.sort()
   * // expected output:
   * // rootObserver: 0,1,2
   * // sortObserver: 0,1,2
   */
  readonly onSort: ObservableInterface<T[]>

  /**
   * spliceメソッドを用いて配列の要素が操作されたときに通知されます
   * @param T[] 取り除かれた要素の配列
   * @example
   * const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
   * reactiveNumbers.addObserver((numbers): void => {
   *   console.log('rootObserver: ' + numbers)
   * })
   * reactiveNumbers.onSplice.addObserver((numbers): void => {
   *   console.log('spliceObserver: ' + numbers)
   * })
   * reactiveNumbers.splice(1, 2, -1, -2)
   * // expected output:
   * // rootObserver: 0,-1,-2
   * // spliceObserver: 1,2
   */
  readonly onSplice: ObservableInterface<T[]>

  /**
   * unshiftメソッドを用いて配列の要素が追加されたときに通知されます
   * @param T[] 追加された要素の配列
   * @example
   * const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
   * reactiveNumbers.addObserver((numbers): void => {
   *   console.log('rootObserver: ' + numbers)
   * })
   * reactiveNumbers.onUnshift.addObserver((numbers): void => {
   *   console.log('unshifted array: ' + numbers)
   * })
   * reactiveNumbers.unshift(-2, -1)
   * // expected output:
   * // rootObserver: -2,-1,0,1,2
   * // unshifted array: -2,-1
   */
  readonly onUnshift: ObservableInterface<T[]>

  /**
   * 配列の場合と同様の操作を行い、変更後の配列を通知します
   * @see T[].copyWithin
   */
  copyWithin(target: number, start: number, end?: number): T[]
  /**
   * 配列の場合と同様の操作を行い、変更後の配列を通知します
   * @see T[].fill
   */
  fill(value: T, start?: number, end?: number): T[]
  /**
   * 配列の場合と同様の操作を行い、取り出した要素を通知します
   * @see T[].pop
   */
  pop(): T | undefined
  /**
   * 配列の場合と同様の操作を行い、追加した要素を通知します
   * @see T[].push
   */
  push(...items: T[]): number
  /**
   * 配列の場合と同様の操作を行い、変更後の配列を通知します
   * @see T[].pop
   */
  reverse(): T[]
  /**
   * 配列の場合と同様の操作を行い、取り出した要素を通知します
   * @see T[].shift
   */
  shift(): T | undefined
  /**
   * 配列の場合と同様の操作を行い、変更後の配列を通知します
   * @see T[].sort
   */
  sort(compareFn?: (a: T, b: T) => number): T[]
  /**
   * 配列の場合と同様の操作を行い、取り出した要素の配列を通知します
   * @see T[].splice
   */
  splice(start: number, deleteCount?: number, ...items: T[]): T[]
  /**
   * 配列の場合と同様の操作を行い、追加した要素の配列を通知します
   * @see T[].unshift
   */
  unshift(...items: T[]): number
}

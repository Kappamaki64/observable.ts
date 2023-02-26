import { ReactiveInterface } from './reactiveInterface'

/**
 * あるT型の値に変更があった時に通知するオブジェクトのインターフェース
 *     あくまでも値の変更なので、オブジェクトの場合はそのポインタの変更しか通知しない
 * @param T 値の型
 * @example
 * const reactiveNumber = new ReactiveProperty<number>(0)
 * reactiveNumber.addObserver((number): void => {
 *   console.log('notified number: ' + number)
 * })
 * console.log('initial number: ' + reactiveNumber.value)
 * // expected output:
 * // initial number: 0
 * reactiveNumber.set(1)
 * // expected output:
 * // notified number: 1
 * reactiveNumber.value = 2
 * // expected output:
 * // notified number: 2
 * reactiveNumber.value += 1
 * // expected output:
 * // notified number: 3
 * console.log('change into unreactive: ' + reactiveNumber.toUnreactive)
 * // expected output:
 * // change into unreactive: 3
 */
export interface ReactivePropertyInterface<T> extends ReactiveInterface<T, T> {
  // getterとsetterが両方存在する
  value: T
}

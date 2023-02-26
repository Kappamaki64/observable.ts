import { Reactive } from './reactive'
import { ReactivePropertyInterface } from './interface/reactivePropertyInterface'

/**
 * あるT型の値に変更があった時に通知するオブジェクト
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
export class ReactiveProperty<T>
  extends Reactive<T, T>
  implements ReactivePropertyInterface<T>
{
  protected _value: T

  public constructor(init: T) {
    super()
    this._value = init
  }

  public get value(): T {
    return this._value
  }

  public set value(newValue: T) {
    this.set(newValue)
  }

  public get toUnreactive(): T {
    return this._value
  }

  public set(newValue: T): void {
    this.setWithoutNotifying(newValue)
    this.notify()
  }

  public setWithoutNotifying(newValue: T): void {
    this._value = newValue
  }
}

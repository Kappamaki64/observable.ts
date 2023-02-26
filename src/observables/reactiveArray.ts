import { Reactive } from './reactive'
import { Observable } from './observable'
import { ReactiveArrayInterface } from './interface/reactiveArrayInterface'

/**
 * Array<T>の要素の変更や破壊的な操作を通知するオブジェクトのクラス
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
export class ReactiveArray<T>
  extends Reactive<Readonly<T[]>, T[]>
  implements ReactiveArrayInterface<T>
{
  protected _value: T[]

  public readonly onSetAt = new Observable<number>()

  public readonly onCopyWithin = new Observable<T[]>()

  public readonly onFill = new Observable<T[]>()

  public readonly onPop = new Observable<T | undefined>()

  public readonly onPush = new Observable<T[]>()

  public readonly onReverse = new Observable<T[]>()

  public readonly onShift = new Observable<T | undefined>()

  public readonly onSort = new Observable<T[]>()

  public readonly onSplice = new Observable<T[]>()

  public readonly onUnshift = new Observable<T[]>()

  private readonly notifyObserver = (): void => this.notify()

  public constructor(init: T[]) {
    super()
    this._value = init.concat()

    this.onSetAt.addObserver(this.notifyObserver)
    this.onCopyWithin.addObserver(this.notifyObserver)
    this.onFill.addObserver(this.notifyObserver)
    this.onPop.addObserver(this.notifyObserver)
    this.onPush.addObserver(this.notifyObserver)
    this.onReverse.addObserver(this.notifyObserver)
    this.onShift.addObserver(this.notifyObserver)
    this.onSort.addObserver(this.notifyObserver)
    this.onSplice.addObserver(this.notifyObserver)
    this.onUnshift.addObserver(this.notifyObserver)
  }

  /** 破壊的な変更が出来ないReadonlyArray<T>です */
  public get value(): Readonly<T[]> {
    return this._value
  }

  public set value(newValue: Readonly<T[]>) {
    this.set(newValue)
  }

  public get toUnreactive(): T[] {
    return this._value.concat()
  }

  public set(newValue: Readonly<T[]>): void {
    this.setWithoutNotifying(newValue)
    this.notify()
  }

  public setAt(index: number, newValueOfProperty: T): void {
    this._value[index] = newValueOfProperty
    this.onSetAt.notify(index)
  }

  public setWithoutNotifying(newValue: Readonly<T[]>): void {
    this._value = newValue.concat()
  }

  // 以降ReadonlyArray<T>にない破壊的な配列のメソッドを、委譲しつつ通知をして定義
  public copyWithin(target: number, start: number, end?: number): T[] {
    const ret = this._value.copyWithin(target, start, end)
    this.onCopyWithin.notify(ret)
    return ret
  }

  public fill(value: T, start?: number, end?: number): T[] {
    const ret = this._value.fill(value, start, end)
    this.onFill.notify(ret)
    return ret
  }

  public pop(): T | undefined {
    const ret = this._value.pop()
    this.onPop.notify(ret)
    return ret
  }

  public push(...items: T[]): number {
    const ret = this._value.push(...items)
    this.onPush.notify(items)
    return ret
  }

  public reverse(): T[] {
    const ret = this._value.reverse()
    this.onReverse.notify(ret)
    return ret
  }

  public shift(): T | undefined {
    const ret = this._value.shift()
    this.onShift.notify(ret)
    return ret
  }

  public sort(compareFn?: (a: T, b: T) => number): T[] {
    const ret = this._value.sort(compareFn)
    this.onSort.notify(ret)
    return ret
  }

  /* eslint-disable no-dupe-class-members */
  /* eslint-disable lines-between-class-members */
  public splice(start: number, deleteCount?: number): T[]
  public splice(start: number, deleteCount: number, ...items: T[]): T[]
  public splice(start: number, deleteCount?: number, ...items: T[]): T[] {
    const ret =
      // falsyな値と区別するためundefinedと比較
      deleteCount !== undefined && items !== undefined
        ? this._value.splice(start, deleteCount, ...items)
        : this._value.splice(start, deleteCount)
    this.onSplice.notify(ret)
    return ret
  }
  /* eslint-enable no-dupe-class-members */
  /* eslint-enable lines-between-class-members */

  public unshift(...items: T[]): number {
    const ret = this._value.unshift(...items)
    this.onUnshift.notify(items)
    return ret
  }
}

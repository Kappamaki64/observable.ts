import { Observable } from './observable'
import { Reactive } from './reactive'
import { ReactiveArray } from './reactiveArray'
import { ReactiveProperty } from './reactiveProperty'
import {
  ReactiveObjectInterface,
  RecursiveReactiveObject,
  ReactiveValue
} from './interface/reactiveObjectInterface'

/**
 * T型のオブジェクトのプロパティの変更や破壊的な操作を通知するオブジェクトのクラス
 *     全てのプロパティの値をリアクティブにし、各値の通知とプロパティの追加/代入/削除の際に通知します
 *     **オブジェクトの中にある関数はundefinedになります**
 * @param T 変更を見るオブジェクトの型
 * @example exampleFunctionOfReactiveObject()
 */
export class ReactiveObject<T extends Record<string, unknown>>
  extends Reactive<RecursiveReactiveObject<T>, T>
  implements ReactiveObjectInterface<T>
{
  protected _value: RecursiveReactiveObject<T>

  public readonly onSetValueOf = new Observable<keyof T>()

  public readonly onDelete = new Observable<ReactiveValue<T[keyof T]>>()

  private readonly notifyObserver = (): void => this.notify()

  public constructor(init: T) {
    super()
    const tmp: {
      [
        key: string
      ]: // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | ReactiveArray<T[keyof T] extends any[] ? T[keyof T][0] : never>
        | ReactiveObject<Record<string, unknown>>
        | ReactiveProperty<T[keyof T]>
    } = {}
    Object.entries(init).forEach(([key, val]): void => {
      const value = Array.isArray(val) // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? new ReactiveArray<any>(val)
        : typeof val === 'object'
        ? new ReactiveObject<Record<string, unknown>>(
            val as Record<string, unknown>
          )
        : new ReactiveProperty<T[keyof T]>(val as T[keyof T])
      value.addObserver(this.notifyObserver)
      tmp[key] = value
    })
    this._value = tmp as unknown as RecursiveReactiveObject<T>

    this.onSetValueOf.addObserver(this.notifyObserver)
    this.onDelete.addObserver(this.notifyObserver)
  }

  /** 全てのプロパティを再帰的にリアクティブにした値 */
  public get value(): Readonly<RecursiveReactiveObject<T>> {
    return this._value
  }

  /** 全てのプロパティに対して再帰的にリアクティブでない形にしたもの */
  public get toUnreactive(): T {
    const tmp: {
      [key: string]: T[keyof T]
    } = {}
    Object.entries(this._value).forEach(([key, val]): void => {
      tmp[key] = (
        val as Reactive<RecursiveReactiveObject<T>[keyof T], T[keyof T]>
      ).toUnreactive
    })
    return tmp as T
  }

  /** 各プロパティのリアクティブな値に通知なしに代入し、このクラスのみ一度だけ通知します */
  public set(newValue: T): void {
    this.setWithoutNotifying(newValue)
    this.notify()
  }

  public setValueOf<S extends keyof T>(key: S, newValueOfProperty: T[S]): void {
    if (Object.keys(this._value).includes(key.toString())) {
      ;(
        this._value[key as keyof T] as  // eslint-disable-next-line @typescript-eslint/no-explicit-any
          | ReactiveArray<T[S] extends any[] ? T[S][0] : never>
          | (T[S] extends Record<string, unknown>
              ? ReactiveObject<T[S]>
              : ReactiveProperty<T[S]>)
      ).setWithoutNotifying(
        newValueOfProperty as T[S] & // eslint-disable-next-line @typescript-eslint/no-explicit-any
          readonly (T[S] extends any[] ? T[S][0] : never)[]
      )
    } else {
      const value = Array.isArray(newValueOfProperty) // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? new ReactiveArray<T[keyof T] extends any[] ? T[keyof T][0] : never>(
            newValueOfProperty
          )
        : typeof newValueOfProperty === 'object'
        ? new ReactiveObject<Record<string, unknown>>(
            newValueOfProperty as unknown as Record<string, unknown>
          )
        : new ReactiveProperty<T[keyof T]>(newValueOfProperty)
      value.addObserver(this.notifyObserver)
      this._value[key as keyof T] = value as ReactiveValue<T[keyof T]>
    }
    this.onSetValueOf.notify(key as keyof T)
  }

  public setWithoutNotifying(newValue: T): void {
    Object.entries(this._value).forEach(([key, val]): void => {
      const newV = newValue[key as keyof T]
      // 削除
      if (newV === undefined) delete this.value[key as keyof T]
      // 変更
      if (Array.isArray(newV))
        (
          val as unknown as ReactiveArray<
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            T[keyof T] extends any[] ? T[keyof T][0] : never
          >
        ).setWithoutNotifying(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          newV as unknown as T[keyof T] extends any[] ? T[keyof T][0] : never
        )
      else if (typeof newV === 'object')
        (
          val as unknown as ReactiveObject<Record<string, unknown>>
        ).setWithoutNotifying(newV as unknown as Record<string, unknown>)
      else (val as ReactiveProperty<T[keyof T]>).setWithoutNotifying(newV)
    })
    // 追加
    Object.entries(newValue).forEach(([key, val]): void => {
      if (this._value[key as keyof T] !== undefined) return
      const value = Array.isArray(val) // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? new ReactiveArray<any>(val)
        : typeof val === 'object'
        ? new ReactiveObject<Record<string, unknown>>(
            val as unknown as Record<string, unknown>
          )
        : new ReactiveProperty<T[keyof T]>(val as T[keyof T])
      value.addObserver(this.notifyObserver)
      this._value[key as keyof T] = value as ReactiveValue<T[keyof T]>
    })
  }

  public setWithNotifyingAll(newValue: T): void {
    Object.entries(this._value).forEach(([key, val]): void => {
      const newV = newValue[key as keyof T]
      // 削除
      if (newV === undefined) this.delete(key as keyof T)
      // 変更
      if (Array.isArray(newV))
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (
          val as unknown as ReactiveArray<
            T[keyof T] extends any[] ? T[keyof T][0] : never
          >
        ).value = newV as unknown as T[keyof T] extends any[]
          ? /* eslint-enable @typescript-eslint/no-explicit-any */
            T[keyof T][0]
          : never
      else if (typeof newV === 'object')
        (
          val as unknown as ReactiveObject<Record<string, unknown>>
        ).setWithNotifyingAll(newV as unknown as Record<string, unknown>)
      else (val as ReactiveProperty<T[keyof T]>).value = newV
    })
    // 追加
    Object.entries(newValue).forEach(([key, val]): void => {
      if (this._value[key as keyof T] !== undefined) return
      this.setValueOf(key as keyof T, val as T[keyof T])
    })
    this.notify()
  }

  public delete<S extends keyof T>(key: S): void {
    const value = this._value[key]
    delete this._value[key]
    value.removeObserver(this.notifyObserver)
    this.onDelete.notify(value as unknown as ReactiveValue<T[keyof T]>)
  }
}

import { ReactiveArray } from '../reactiveArray'
import { ReactiveObject } from '../reactiveObject'
import { ReactiveProperty } from '../reactiveProperty'
import { ReactiveInterface } from './reactiveInterface'
import { ObservableInterface } from './observableInterface'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReactiveValue<V> = V extends any[]
  ? ReactiveArray<V[0]>
  : V extends Record<string, unknown>
  ? ReactiveObject<V>
  : ReactiveProperty<V>

export type RecursiveReactiveObject<T extends Record<string, unknown>> = {
  [S in keyof T]: ReactiveValue<T[S]>
}

/**
 * T型のオブジェクトのプロパティの変更や破壊的な操作を通知するオブジェクトのインターフェース
 *     全てのプロパティの値をリアクティブにし、各値の通知とプロパティの追加/代入/削除の際に通知します
 *     **オブジェクトの中にある関数はundefinedになります**
 * @param T 変更を見るオブジェクトの型
 * @example exampleFunctionOfReactiveObject()
 */
export interface ReactiveObjectInterface<T extends Record<string, unknown>>
  extends ReactiveInterface<RecursiveReactiveObject<T>, T> {
  /**
   * 指定されたkeyのvalueに新しい値を通知なしに代入し、このクラスのみ一度だけ通知します
   * @param key 代入するプロパティのkey
   * @param newValueOfProperty 代入する値
   */
  setValueOf: <S extends keyof T>(key: S, newValueOfProperty: T[S]) => void

  /**
   * set(key, newValueOfProperty)でプロパティの値が変更されたときに通知します
   * @param keyof_T 追加/代入されたプロパティのkey
   */
  readonly onSetValueOf: ObservableInterface<keyof T>

  /**
   * delete(key)でプロパティの値が削除されたときに通知します
   * @param T[keyof_T] 削除されたプロパティのvalue
   */
  readonly onDelete: ObservableInterface<ReactiveValue<T[keyof T]>>

  /**
   * 全てのリアクティブな値に通知を伴いながら新たな値を代入し、このクラスでも通知をします
   *     通知の重複に注意
   * @param {T} newValue 代入するオブジェクト
   */
  setWithNotifyingAll: (newValue: T) => void

  /**
   * 指定されたkeyのプロパティを削除し、削除されたプロパティのvalueを通知します
   * @param {keyof T} key 削除するプロパティのkey
   */
  delete: <S extends keyof T>(key: S) => void
}

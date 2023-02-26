import { ObservableInterface } from './observableInterface'

/**
 * あるT型のオブジェクトに通知する機能を付けたオブジェクトのインターフェース
 *    オブジェクトに変更があったときに、購読者にクラスが保持するV型の値を送って通知します
 * @param V クラスが保持するvalueの型
 * @param T 変更を見るオブジェクトの型
 */
export interface ReactiveInterface<V, T> extends ObservableInterface<V> {
  /**
   * 購読者にクラスが保持するV型の値を送って通知します
   * @see ObservableInterface<V>.notify
   */
  notify: () => void

  /**
   * このクラスが変更を見ている値
   */
  readonly value: V

  /**
   * 値をリアクティブでない形にしたもの
   */
  readonly toUnreactive: T

  /**
   * 新しい値を代入し、通知します
   * @param {T} newValue 代入する値
   */
  set: (newValue: T) => void
}

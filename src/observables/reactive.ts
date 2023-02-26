import { Observable } from './observable'
import { ReactiveInterface } from './interface/reactiveInterface'

/**
 * あるT型のオブジェクトに通知する機能を付けたもの
 *    オブジェクトに変更があったときに、購読者にクラスが保持するV型の値を送って通知します
 * @param V クラスが保持するvalueの型
 * @param T 変更を見るオブジェクトの型
 */
export abstract class Reactive<V, T>
  extends Observable<V>
  implements ReactiveInterface<V, T>
{
  protected abstract _value: V

  public override notify(): void {
    super.notify(this._value)
  }

  public abstract get value(): V

  public abstract get toUnreactive(): T

  public abstract set(newValue: T): void

  /** **【非推奨】**新しい値を代入しますが、一切通知しません */
  public abstract setWithoutNotifying(newValue: T): void
}

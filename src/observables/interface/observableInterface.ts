/**
 * イベントを購読者（Observer）に通知するオブジェクトのインターフェース
 * @param T イベントが通知された時に送られるオブジェクトの型
 */
export interface ObservableInterface<T> {
  /**
   * このイベントの購読者を増やします（このイベントを購読します）
   * @param {(arg: T) => void} callback イベントが通知（notify）された時に呼ばれる関数
   *     argはイベントの通知とともに送られるT型のオブジェクト
   * @example
   * const observable = new Observable<number>()
   * observable.addObserver((arg: number): void => {
   *   console.log(arg)
   * })
   *
   * for (let i = 0; i < 10; i++) observable.notify(i)
   * // expected output:
   * // 0
   * // 1
   * // 2
   * // 3
   * // 4
   * // 5
   * // 6
   * // 7
   * // 8
   * // 9
   */
  addObserver(callback: (arg: T) => void): void

  /**
   * イベントが通知された時に、その通知とともに送られたオブジェクトが条件を満たす場合のみaddObserverのcallbackを呼び出します
   *     filterを重ねがけすることも出来ます
   *     filterをした後は、再度filterをするかaddObserverすることのみ可能です
   * @param {(arg: T) => boolean} predicate 送られてきたオブジェクトが条件にあうときtrueを返す関数
   * @example
   * const observable = new Observable<number>()
   * observable
   *   .filter((arg): boolean => {
   *     return arg % 2 === 0
   *   })
   *   .filter((arg): boolean => arg > 5)
   *   .addObserver((arg: number): void => {
   *     console.log(arg)
   *   })
   *
   * for (let i = 0; i < 10; i++) observable.notify(i)
   * // expected output:
   * // 6
   * // 8
   */
  filter<S extends T>(
    predicate: (arg: T) => arg is S
  ): FilterObservableInterface<S>
  filter(predicate: (arg: T) => boolean): FilterObservableInterface<T>

  /**
   * 既にイベントに登録していた関数を削除し、通知を受けても関数が呼ばれないようにします
   *     ただし、引数に指定する関数は**登録時の関数と同じ関数ポインタ**でなければなりません
   *     よって削除する場合は登録、削除ともに無名関数を引数に入れてはいけません
   * @param {(arg: T) => void} callback 削除する関数
   * @example
   * const observableA = new Observable<string>()
   * const callback = (arg: string): void => {
   *   console.log(arg)
   * }
   * observableA.addObserver(callback)
   * observableA.removeObserver((arg: string): void => {
   *   console.log(arg)
   * })
   * observableA.notify(
   *   '内容が同じでも無名関数では登録された関数を削除することは出来ません'
   * )
   * // expected output:
   * // 内容が同じでも無名関数では登録された関数を削除することは出来ません
   *
   * observableA.removeObserver(callback)
   * observableA.notify('ポインタが同じ関数を引数に指定しましょう')
   * // not expected any output
   *
   * const observableB = new Observable<string>()
   * observableB.addObserver((arg: string): void => {
   *   console.log(arg)
   * })
   * observableB.removeObserver(callback)
   * observableB.notify('無名関数を登録すると削除することが出来ません')
   * // expected output:
   * // 無名関数を登録すると削除することが出来ません
   */
  removeObserver(callback: (arg: T) => void): void

  /**
   * このイベントに登録されている関数を全て削除します
   * @example
   * const observable = new Observable<number>()
   * observable.addObserver((arg: number): void => {
   *   console.log(arg)
   * })
   * observable.clearObserver()
   * observable.notify(0)
   * // not expected any output
   */
  clearObserver(): void

  /**
   * このイベントの購読者全員に通知します（登録された全ての関数に引数を入れて呼び出します）
   * @param arg イベントの通知とともに送られるT型のオブジェクト
   * @example
   * const observable = new Observable<number>()
   * observable.addObserver((arg: number): void => {
   *   console.log(arg)
   * })
   *
   * for (let i = 0; i < 10; i++) observable.notify(i)
   * // expected output:
   * // 0
   * // 1
   * // 2
   * // 3
   * // 4
   * // 5
   * // 6
   * // 7
   * // 8
   * // 9
   */
  notify(arg: T): void
}

export interface FilterObservableInterface<T> {
  // ObservableInterface<T>.filterと同様
  filter<S extends T>(
    predicate: (arg: T) => arg is S
  ): FilterObservableInterface<S>
  filter(predicate: (arg: T) => boolean): FilterObservableInterface<T>

  // ObservableInterface<T>.addObservableと同様
  addObserver(callback: (arg: T) => void): void
}

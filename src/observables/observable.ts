import {
  FilterObservableInterface,
  ObservableInterface
} from './interface/observableInterface'

class FilterObservable<T> implements FilterObservableInterface<T> {
  private readonly observers: Map<(arg: T) => void, ((arg: T) => boolean)[]>

  private readonly predicates: ((arg: T) => boolean)[]

  public constructor(
    observers: Map<(arg: T) => void, ((arg: T) => boolean)[]>,
    predicates: ((arg: T) => boolean)[]
  ) {
    this.observers = observers
    this.predicates = predicates
  }

  public filter<S extends T>(
    predicate: (arg: T) => arg is S
  ): FilterObservableInterface<S>

  public filter(predicate: (arg: T) => boolean): FilterObservableInterface<T>

  public filter<S extends T>(
    predicate: (arg: T) => boolean
  ): FilterObservable<S> {
    return new FilterObservable<S>(
      this.observers,
      this.predicates.concat(predicate)
    )
  }

  public addObserver(callback: (arg: T) => void): void {
    this.observers.set(callback, this.predicates)
  }
}

/**
 * イベントを購読者（Observer）に通知するオブジェクト
 * @param T イベントが通知された時に送られるオブジェクトの型
 */
export class Observable<T> implements ObservableInterface<T> {
  private readonly observers: Map<(arg: T) => void, ((arg: T) => boolean)[]>

  public constructor() {
    this.observers = new Map()
  }

  public filter<S extends T>(
    predicate: (arg: T) => arg is S
  ): FilterObservableInterface<S>

  public filter(predicate: (arg: T) => boolean): FilterObservableInterface<T>

  public filter<S extends T>(
    predicate: (arg: T) => boolean
  ): FilterObservableInterface<S> {
    return new FilterObservable<S>(this.observers, [predicate])
  }

  public addObserver(callback: (arg: T) => void): void {
    this.observers.set(callback, [])
  }

  public removeObserver(callback: (arg: T) => void): void {
    this.observers.delete(callback)
  }

  public clearObserver(): void {
    this.observers.clear()
  }

  public notify(arg: T): void {
    for (const [callback, predicates] of this.observers.entries()) {
      if (!predicates.every((p): boolean => p(arg))) continue
      callback(arg)
    }
  }
}

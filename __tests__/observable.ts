import { Observable } from '../src/observables/observable'

describe('test Observable', () => {
  it('test addObserver and notify', () => {
    const observable = new Observable<number>()
    const received: number[] = []

    observable.addObserver((arg: number): void => {
      received.push(arg)
    })

    for (let i = 0; i < 10; i++) observable.notify(i)

    expect(received).toMatchObject([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('test filter', () => {
    const observable = new Observable<number>()
    const received: number[] = []

    observable
      .filter((arg): boolean => {
        return arg % 2 === 0
      })
      .filter((arg): boolean => arg > 5)
      .addObserver((arg: number): void => {
        received.push(arg)
      })

    for (let i = 0; i < 10; i++) observable.notify(i)

    expect(received).toMatchObject([6, 8])
  })

  it('test filter type', () => {
    const observable = new Observable<number | string | boolean>()
    const received: number[] = []

    // check type predicate inference
    observable
      .filter(
        (arg: number | string | boolean): arg is number | boolean =>
          typeof arg === 'number' || typeof arg === 'boolean'
      )
      .filter((arg: number | boolean): arg is number => typeof arg === 'number')
      .addObserver((arg: number): void => {
        received.push(arg)
      })

    const values = [1, '2', true, 3, false, '4', 5]
    for (const value of values) observable.notify(value)

    expect(received).toMatchObject([1, 3, 5])
  })

  it('test removeObserver 1', () => {
    const observable = new Observable<string>()
    const received: string[] = []
    const callback = (arg: string): void => {
      if (arg[0] !== undefined) received.push(arg[0])
    }

    observable.addObserver(callback)
    observable.removeObserver((arg: string): void => {
      if (arg[0] !== undefined) received.push(arg[0])
    })
    observable.notify(
      '内容が同じでも無名関数では登録された関数を削除することは出来ません'
    )

    observable.removeObserver(callback)
    observable.notify('ポインタが同じ関数を引数に指定しましょう')

    expect(received).toMatchObject(['内'])
  })

  it('test removeObserver 2', () => {
    const observable = new Observable<string>()
    const received: string[] = []
    const callback = (arg: string): void => {
      if (arg[0] !== undefined) received.push(arg[0])
    }

    observable.addObserver((arg: string): void => {
      if (arg[0] !== undefined) received.push(arg[0])
    })
    observable.removeObserver(callback)
    observable.notify('無名関数を登録すると削除することが出来ません')

    expect(received).toMatchObject(['無'])
  })

  it('test clearObserver', () => {
    const observable = new Observable<number>()
    const received: number[] = []
    observable.addObserver((arg: number): void => {
      received.push(arg)
    })
    observable.clearObserver()
    observable.notify(0)

    expect(received).toMatchObject([])
  })
})

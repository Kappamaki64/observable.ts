import { ReactiveProperty } from '../src/observables/reactiveProperty'

describe('test ReactiveProperty', () => {
  it('test ReactiveProperty', () => {
    const reactiveNumber = new ReactiveProperty<number>(0)
    const received: number[] = []

    reactiveNumber.addObserver((number): void => {
      received.push(number)
    })

    expect(reactiveNumber.value).toBe(0)

    reactiveNumber.set(1)
    reactiveNumber.value = 2
    reactiveNumber.value += 1

    expect(reactiveNumber.toUnreactive).toBe(3)
    expect(received).toMatchObject([1, 2, 3])
  })
})

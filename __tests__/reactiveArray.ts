import assert from 'assert'
import { ReactiveArray } from '../src/observables/reactiveArray'

describe('test ReactiveArray', () => {
  it('test ReactiveArray', () => {
    const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
    const received: number[] = []
    reactiveNumbers.addObserver((numbers): void => {
      received.push(...numbers)
    })

    expect(reactiveNumbers.value).toMatchObject([0, 1, 2])

    reactiveNumbers.set([3, 4, 5])
    reactiveNumbers.value = [6, 7, 8]

    expect(reactiveNumbers.toUnreactive).toMatchObject([6, 7, 8])
    expect(received).toMatchObject([3, 4, 5, 6, 7, 8])
  })

  it('test onSetAt', () => {
    const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
    const received: number[] = []
    reactiveNumbers.addObserver((numbers): void => {
      received.push(...numbers)
    })
    const onSetAtReceived: number[][] = []
    reactiveNumbers.onSetAt.addObserver((index): void => {
      const valueI = reactiveNumbers.value[index]
      if (valueI !== undefined) onSetAtReceived.push([index, valueI])
    })

    reactiveNumbers.setAt(1, 10)
    expect(reactiveNumbers.value).toMatchObject([0, 10, 2])
    expect(received).toMatchObject([0, 10, 2])
    expect(onSetAtReceived).toMatchObject([[1, 10]])
  })

  it('test onCopyWithin', () => {
    const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
    const received: number[] = []
    reactiveNumbers.addObserver((numbers): void => {
      received.push(...numbers)
    })
    const onCopyWithinReceived: number[] = []
    reactiveNumbers.onCopyWithin.addObserver((numbers): void => {
      onCopyWithinReceived.push(...numbers)
    })

    reactiveNumbers.copyWithin(0, 1, 2)
    expect(reactiveNumbers.value).toMatchObject([1, 1, 2])
    expect(received).toMatchObject([1, 1, 2])
    expect(onCopyWithinReceived).toMatchObject([1, 1, 2])
  })

  it('test onFill', () => {
    const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
    const received: number[] = []
    reactiveNumbers.addObserver((numbers): void => {
      received.push(...numbers)
    })
    const onFillReceived: number[] = []
    reactiveNumbers.onFill.addObserver((numbers): void => {
      onFillReceived.push(...numbers)
    })

    reactiveNumbers.fill(1)
    expect(reactiveNumbers.value).toMatchObject([1, 1, 1])
    expect(received).toMatchObject([1, 1, 1])
    expect(onFillReceived).toMatchObject([1, 1, 1])
  })

  it('test onPop', () => {
    const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
    const received: number[] = []
    reactiveNumbers.addObserver((numbers): void => {
      received.push(...numbers)
    })
    const onPopReceived: number[] = []
    reactiveNumbers.onPop.addObserver((number): void => {
      assert(number !== undefined)
      onPopReceived.push(number)
    })

    const popValue = reactiveNumbers.pop()
    expect(popValue).toBe(2)
    expect(reactiveNumbers.value).toMatchObject([0, 1])
    expect(received).toMatchObject([0, 1])
    expect(onPopReceived).toMatchObject([2])
  })

  it('test onPush', () => {
    const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
    const received: number[] = []
    reactiveNumbers.addObserver((numbers): void => {
      received.push(...numbers)
    })
    const onPushReceived: number[] = []
    reactiveNumbers.onPush.addObserver((numbers): void => {
      onPushReceived.push(...numbers)
    })

    reactiveNumbers.push(3, 4)
    expect(reactiveNumbers.value).toMatchObject([0, 1, 2, 3, 4])
    expect(received).toMatchObject([0, 1, 2, 3, 4])
    expect(onPushReceived).toMatchObject([3, 4])
  })

  it('test onReverse', () => {
    const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
    const received: number[] = []
    reactiveNumbers.addObserver((numbers): void => {
      received.push(...numbers)
    })
    const onReverseReceived: number[] = []
    reactiveNumbers.onReverse.addObserver((numbers): void => {
      onReverseReceived.push(...numbers)
    })

    reactiveNumbers.reverse()
    expect(reactiveNumbers.value).toMatchObject([2, 1, 0])
    expect(received).toMatchObject([2, 1, 0])
    expect(onReverseReceived).toMatchObject([2, 1, 0])
  })

  it('test onShift', () => {
    const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
    const received: number[] = []
    reactiveNumbers.addObserver((numbers): void => {
      received.push(...numbers)
    })
    const onShiftReceived: number[] = []
    reactiveNumbers.onShift.addObserver((number): void => {
      assert(number !== undefined)
      onShiftReceived.push(number)
    })

    const shiftedValue = reactiveNumbers.shift()
    expect(shiftedValue).toBe(0)
    expect(reactiveNumbers.value).toMatchObject([1, 2])
    expect(received).toMatchObject([1, 2])
    expect(onShiftReceived).toMatchObject([0])
  })

  it('test onSort', () => {
    const reactiveNumbers = new ReactiveArray<number>([1, 2, 0])
    const received: number[] = []
    reactiveNumbers.addObserver((numbers): void => {
      received.push(...numbers)
    })
    const onSortReceived: number[] = []
    reactiveNumbers.onSort.addObserver((numbers): void => {
      onSortReceived.push(...numbers)
    })

    reactiveNumbers.sort()
    expect(reactiveNumbers.value).toMatchObject([0, 1, 2])
    expect(received).toMatchObject([0, 1, 2])
    expect(onSortReceived).toMatchObject([0, 1, 2])
  })

  it('test onSplice without items', () => {
    const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
    const received: number[] = []
    reactiveNumbers.addObserver((numbers): void => {
      received.push(...numbers)
    })
    const onSpliceReceived: number[] = []
    reactiveNumbers.onSplice.addObserver((numbers): void => {
      onSpliceReceived.push(...numbers)
    })

    reactiveNumbers.splice(1, 2)
    expect(reactiveNumbers.value).toMatchObject([0])
    expect(received).toMatchObject([0])
    expect(onSpliceReceived).toMatchObject([1, 2])
  })

  it('test onSplice with items', () => {
    const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
    const received: number[] = []
    reactiveNumbers.addObserver((numbers): void => {
      received.push(...numbers)
    })
    const onSpliceReceived: number[] = []
    reactiveNumbers.onSplice.addObserver((numbers): void => {
      onSpliceReceived.push(...numbers)
    })

    reactiveNumbers.splice(1, 2, -1, -2)
    expect(reactiveNumbers.value).toMatchObject([0, -1, -2])
    expect(received).toMatchObject([0, -1, -2])
    expect(onSpliceReceived).toMatchObject([1, 2])
  })

  it('test onUnShift', () => {
    const reactiveNumbers = new ReactiveArray<number>([0, 1, 2])
    const received: number[] = []
    reactiveNumbers.addObserver((numbers): void => {
      received.push(...numbers)
    })
    const onUnshiftReceived: number[] = []
    reactiveNumbers.onUnshift.addObserver((numbers): void => {
      onUnshiftReceived.push(...numbers)
    })

    reactiveNumbers.unshift(-2, -1)
    assert.deepStrictEqual(reactiveNumbers.value, [-2, -1, 0, 1, 2])
    assert.deepStrictEqual(received, [-2, -1, 0, 1, 2])
    assert.deepStrictEqual(onUnshiftReceived, [-2, -1])
    expect(reactiveNumbers.value).toMatchObject([-2, -1, 0, 1, 2])
    expect(received).toMatchObject([-2, -1, 0, 1, 2])
    expect(onUnshiftReceived).toMatchObject([-2, -1])
  })
})

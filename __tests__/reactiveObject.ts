import { ReactiveObject } from '../src/observables/reactiveObject'

interface Vector3 {
  x: number
  y: number
  z: number
}
describe('test ReactiveObject', () => {
  it('test ReactiveObject', () => {
    const reactiveVector3 = new ReactiveObject<{
      x: number
      y: number
      z: number
    }>({ x: 0, y: 0, z: 0 })
    const received: Vector3[] = []

    reactiveVector3.addObserver(({ x, y, z }): void => {
      received.push({
        x: x?.value,
        y: y?.value,
        z: z?.value
      })
    })

    expect(reactiveVector3.toUnreactive).toMatchObject({ x: 0, y: 0, z: 0 })

    reactiveVector3.value.x.set(1)
    reactiveVector3.value.y.value += 2
    reactiveVector3.delete('z')
    reactiveVector3.setValueOf('z', 3)

    expect(reactiveVector3.toUnreactive).toMatchObject({ x: 1, y: 2, z: 3 })
    expect(received).toMatchObject([
      { x: 1, y: 0, z: 0 },
      { x: 1, y: 2, z: 0 },
      { x: 1, y: 2 },
      { x: 1, y: 2, z: 3 }
    ])
  })
})

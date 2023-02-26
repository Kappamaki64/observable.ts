import { RecursiveReactiveObject } from './observables/interface/reactiveObjectInterface'
import { ReactiveObject } from './observables/reactiveObject'

interface TestType {
  [key: number]: string
  [key: string]: unknown
  vector: {
    direction: { x: number; y: number }
    length: number
  }
  power: number
  target: string[]
}

function exampleFunctionOfReactiveObject(): void {
  const printObject = (rro: RecursiveReactiveObject<TestType>): void => {
    const object = {
      vector: rro.vector.toUnreactive,
      power: rro.power.toUnreactive,
      target: rro.target.toUnreactive
    }
    console.log(`    vector/direction/x: ${object.vector.direction.x}`)
    console.log(`    vector/direction/y: ${object.vector.direction.y}`)
    console.log(`    vector/length: ${object.vector.length}`)
    console.log(`    power: ${object.power}`)
    console.log(`    target: ${object.target.toString()}`)
  }
  const reactiveObject = new ReactiveObject<TestType>({
    vector: {
      direction: { x: 1, y: 0 },
      length: 5
    },
    power: 100,
    target: ['Alpha', 'Bravo']
  })
  reactiveObject.onSetValueOf.addObserver((arg): void => {
    console.log('  <onSetValueOfObserver>')
    console.log(`    set key: ${arg}`)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-non-null-assertion
    console.log(`    set value: ${reactiveObject.value[arg]!.toUnreactive}`)
  })
  reactiveObject.onDelete.addObserver((arg): void => {
    console.log('  <onDeleteObserver>')
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`    delete value: ${arg.toUnreactive}`)
  })
  reactiveObject.addObserver((rro): void => {
    console.log('  <rootObserver>')
    printObject(rro)
  })
  reactiveObject.value.vector.addObserver((): void => {
    console.log('  <vectorObserver>')
  })
  reactiveObject.value.vector.value.direction.addObserver((): void => {
    console.log('  <directionObserver>')
  })
  reactiveObject.value.vector.value.direction.value.x.addObserver((): void => {
    console.log('  <xObserver>')
  })
  reactiveObject.value.vector.value.direction.value.y.addObserver((): void => {
    console.log('  <yObserver>')
  })
  reactiveObject.value.vector.value.length.addObserver((): void => {
    console.log('  <lengthObserver>')
  })
  reactiveObject.value.power.addObserver((): void => {
    console.log('  <powerObserver>')
  })
  reactiveObject.value.target.addObserver((): void => {
    console.log('  <targetObserver>')
  })

  console.log('(initial object)')
  printObject(reactiveObject.value)
  console.log('(set power 200)')
  reactiveObject.setValueOf('power', 200)
  console.log('(push target Charlie)')
  reactiveObject.value.target.push('Charlie')
  console.log('(change target other array)')
  reactiveObject.setValueOf('target', ['Ash', 'Back', 'Chain'])
  reactiveObject.value.target.addObserver((): void => {
    console.log('  <otherTargetObserver>')
  })
  console.log('(set x of vector direction -1)')
  reactiveObject.value.vector.value.direction.value.x.value = -1
  console.log('(set new key 0, value zero)')
  reactiveObject.setValueOf(0, 'zero')
  console.log('(set key 0, value ZERO)')
  reactiveObject.setValueOf(0, 'ZERO')
  console.log('(delete key 0)')
  reactiveObject.delete(0)
  console.log('(change all properties with notifying every time)')
  reactiveObject.setWithNotifyingAll({
    vector: {
      direction: { x: 0, y: -1 },
      length: 1
    },
    power: -100,
    target: ['Myself']
  })
}

exampleFunctionOfReactiveObject()

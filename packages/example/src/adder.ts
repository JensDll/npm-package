import { add } from '@internal/shared'

export function addTwo(a: number) {
  if (__DEV__) {
    console.log(
      'This is a debugging message which gets removed in the production build'
    )
  }

  return add(a, 2)
}

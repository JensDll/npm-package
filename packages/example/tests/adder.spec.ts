import { addTwo } from '~/example/adder'

test('Increases a number by two', () => {
  expect(addTwo(3)).toBe(5)
})

// biome-ignore lint/correctness/noUnusedVariables: test fixture
class Calculator {
  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }
}

export function multiply(a, b) {
  return a * b;
}

export const divide = (a, b) => a / b;

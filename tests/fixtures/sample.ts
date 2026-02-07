/** User interface */
// biome-ignore lint/correctness/noUnusedVariables: test fixture
interface User {
  name: string;
  age: number;
}

// biome-ignore lint/correctness/noUnusedVariables: test fixture
type ID = string | number;

// biome-ignore lint/correctness/noUnusedVariables: test fixture
enum Status {
  Active,
  Inactive,
}

/** A greeter class */
export class Greeter {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  /** Greet someone */
  public greet(): string {
    return `Hello, ${this.name}`;
  }
}

export function add(a: number, b: number): number {
  return a + b;
}

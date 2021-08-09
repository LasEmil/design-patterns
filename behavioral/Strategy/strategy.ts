export const Strategy = (): void => {
  interface Strategy {
    execute(a: number, b: number): number;
  }
  class AddStrategy implements Strategy {
    execute(a: number, b: number) {
      return a + b;
    }
  }
  class SubstractStrategy implements Strategy {
    execute(a: number, b: number) {
      return a - b;
    }
  }
  class MultiplyStrategy implements Strategy {
    execute(a: number, b: number) {
      return a * b;
    }
  }

  class Context {
    private strategy: Strategy;
    setStrategy(strategy: Strategy) {
      this.strategy = strategy;
    }
    executeStrategy(a: number, b: number) {
      return this.strategy.execute(a, b);
    }
  }
  enum Actions {
    addition,
    substraction,
    multiplication,
  }
  class Application {
    context: Context;
    constructor() {
      this.context = new Context();
    }

    main() {
      const a = 12;
      const b = 7;
      const action = Actions.addition;
      if (action === Actions.addition) {
        this.context.setStrategy(new AddStrategy());
      } else if (action === Actions.substraction) {
        this.context.setStrategy(new SubstractStrategy());
      } else if (action === Actions.multiplication) {
        this.context.setStrategy(new MultiplyStrategy());
      }

      const result = this.context.executeStrategy(a, b);
      console.log(result);
    }
  }
  const app = new Application();
  app.main();
};

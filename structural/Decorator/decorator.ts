export const Decorator = (): void => {
  interface Transformator {
    exec: () => string | Error;
  }

  // Decorator Factory
  const validateForbiddenTags =
    (tags: Array<string>) =>
    (
      _target: unknown,
      _propertyKey: string,
      descriptor: PropertyDescriptor
    ) => {
      const ogMethod = descriptor.value;
      descriptor.value = function (...args) {
        if (tags.includes(this.tag)) {
          return new Error(`Tag ${this.tag} is forbidden to use`);
        } else {
          return ogMethod.apply(this, args);
        }
      };
    };

  class TagWrapper implements Transformator {
    public src: string;
    public tag: string;
    constructor(src: string, tag: string) {
      this.src = src;
      this.tag = tag;
    }
    @validateForbiddenTags(["a", "svg"])
    exec() {
      return `<${this.tag}>${this.src}</${this.tag}>`;
    }
  }

  const wrappedText = new TagWrapper("Hello", "div").exec();
  console.log(wrappedText);
};

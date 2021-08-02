export const Prototype = (): void => {
  interface Orders {
    process: () => string;
    addItem: (item: number) => void;
    removeItem: (item: number) => void;
    getTotal: () => number;
  }
  type OrderProps = {
    clone?: Order;
    items?: number[];
  };
  class Order implements Orders {
    number: string;
    items: number[];
    price: number;
    constructor(config: OrderProps) {
      this.items = config.items ?? config.clone.items;
      this.price = 0 ?? config.clone.price;
    }

    addItem(item: number) {
      this.items = [...this.items, item];
    }
    removeItem(item: number) {
      this.items = this.items.filter((orderItem) => orderItem !== item);
    }
    getTotal() {
      if (!this.price) {
        const total = this.items.reduce((prev, cur) => prev + cur);
        this.price = total;
        return total;
      }
      return this.price;
    }
    clone() {
      return new Order({ clone: this });
    }
    process() {
      return "sending the order!";
    }
  }
  const order = new Order({ items: [1, 2] });
  order.addItem(5);
  const clonedOrder = order.clone();
  console.log(clonedOrder.getTotal());
};

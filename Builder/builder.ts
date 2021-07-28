export const Builder = (): void => {
  class Query {
    collectionName: string;
    limit: number;
    offset: number;
    where: string;
  }

  interface Builder {
    exec: () => string;
    collection: (name: string) => Builder;
    limit: (limit: number) => Builder;
    offset: (offset: number) => Builder;
    where: (where: Record<string, unknown>) => Builder;
    reset: () => void;
  }

  class QueryBuilder implements Builder {
    query: Query;

    constructor() {
      this.reset();
    }
    reset() {
      this.query = new Query();
    }

    collection(name: string) {
      this.query.collectionName = name;
      return this;
    }

    limit(limit: number) {
      this.query.limit = limit;
      return this;
    }
    offset(offset: number) {
      this.query.offset = offset;
      return this;
    }
    where(where: Record<string, unknown>) {
      this.query.where = JSON.stringify(where);
      return this;
    }

    exec() {
      console.log(this.query);
      const queryValues = Object.entries(this.query);
      let queryString = ``;
      for (const [key, value] of queryValues) {
        queryString = queryString + `(${key}::${value}).\n`;
      }
      queryString = queryString.slice(0, -2);
      return queryString;
    }
  }

  const query = new QueryBuilder()
    .collection("design-patterns")
    .where({ user: "Emil" })
    .offset(2)
    .limit(1)
    .exec();

  console.log(query);
};

export const Singleton = (): void => {
  class Database {
    private static instance: Database;

    private constructor() {
      console.log(`Connecting to the Database!!!!`);
    }

    public static getInstance() {
      if (Database.instance === undefined) {
        Database.instance = new Database();
      }
      return Database.instance;
    }
    public query(sql: string) {
      console.log(sql);
    }
  }

  const db = Database.getInstance();
  db.query("SELECT * FROM users");

  const db2 = Database.getInstance();
  db2.query("SELECT name, role FROM users");
};

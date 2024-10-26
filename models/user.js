const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const { getDb } = require("../services/connect");

class User {
  constructor() {
    this.collection = getDb().collection("users"); // Ініціалізація колекції користувачів
  }

  // Метод для додавання нового користувача
  async addUser(name, login, password, email) {
    const newUser = {
      name,
      login,
      password,
      email,
    };
    try {
      const result = await this.collection.insertOne(newUser);
      console.log(result);

      return result; // Повертаємо щойно доданого користувача
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }

  // Метод для отримання користувача за логіном
  async getUserByLogin(login) {
    try {
      const user = await this.collection.findOne({ login });
      return user;
    } catch (error) {
      console.error("Error getting user by login:", error);
      throw error;
    }
  }

  // Метод для отримання користувача за ID
  async getUserById(id) {
    try {
      const user = await this.collection.findOne({ _id: new ObjectId(id) });
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  comparePass(password, hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) reject(err);
        resolve(isMatch);
      });
    });
  }

  async findOne(query) {
    return await this.collection.findOne(query);
  }
}

module.exports = User;

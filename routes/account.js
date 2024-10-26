const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/db");
const { getDb } = require("../services/connect");
const User = require("../models/user");
const Post = require("../models/post");

const router = express.Router();
const saltRounds = 10;

module.exports = () => {
    const db = getDb();  // Підключення до бази даних
    const userModel = new User(db);  // Модель користувача
    const postModel = new Post(db);  // Модель постів

    // Реєстрація нового користувача
    router.post("/reg", async (req, res) => {
        const { name, email, login, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await userModel.addUser(name, login, hashedPassword, email);
            res.json({ success: true, msg: 'User added successfully' });
        } catch (error) {
            res.status(500).json({ message: "Error adding user", error });
        }
    });

    // Аутентифікація користувача
    router.post("/auth", async (req, res) => {
        const { login, password } = req.body;

        try {
            const user = await userModel.getUserByLogin(login);
            if (!user) {
                return res.json({ success: false, msg: "This user was not found" });
            }

            const isMatch = await userModel.comparePass(password, user.password);
            if (!isMatch) {
                return res.json({ success: false, msg: "Password mismatch" });
            }

            const token = jwt.sign(user, config.secret, { expiresIn: 3600 * 24 });

            res.json({
                success: true,
                token: "JWT " + token,
                user: {
                    id: user._id,
                    name: user.name,
                    login: user.login,
                    email: user.email,
                }
            });
        } catch (err) {
            console.error("Error occurred:", err);
            res.status(500).json({ success: false, msg: "Server error" });
        }
    });    

    return router;
};

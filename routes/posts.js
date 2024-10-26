const express = require('express');
const router = express.Router();
const { getDb } = require('../services/connect');
const Post = require('../models/post');
const passport = require('passport');

module.exports = () => {
  const db = getDb();
  const postModel = new Post(db);

  // Роут для отримання всіх постів
  router.get('/', async (req, res) => {
    try {
      const posts = await postModel.getAllPosts();
      res.status(200).json(posts);  // Відправка постів у відповіді
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving posts', error: error.message });
    }
  });

  //роут для отримання поста
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
      const post = await postModel.getPostById(id);
      res.status(200).json(post);
    }
    catch (error) {
      res.status(500).json({ message: 'Error retrieving posts', error: error.message });
    }
  })

  router.delete("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.params;
    
    try {
      const post = await postModel.deletePost(id);
      res.status(200).json(post);
    }
    catch (error) {
      res.status(500).json({ message: 'Error retrieving posts', error: error.message });
    }

  })
    
    // Додавання нового поста
    router.post("/add", passport.authenticate('jwt', { session: false }), async (req, res) => {
        const { category, photo, text, date, title, author } = req.body;

        try {
            await postModel.addPost(category, photo, text, date, title, author);
            res.json({ success: true, msg: 'Post added successfully' });
        } catch (error) {
            res.status(500).json({ message: "Error adding Post", error });
        }
    });

  return router;
};

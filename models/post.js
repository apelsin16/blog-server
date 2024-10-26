const { ObjectId } = require("mongodb");

class Post {
    constructor(db) {
        this.collection = db.collection('posts'); // Ініціалізація колекції користувачів
    }

  // Метод для додавання нового користувача
    async addPost(category, photo, text, date, title, author) {
        const newPost = {
            category, photo, text, date, title, author
        };
        const result = await this.collection.insertOne(newPost);
    }

    getAllPosts = async () => {
        try {
            return await this.collection.find({}).toArray(); 
        } catch (error) {
            throw new Error('Error retrieving posts');
        }
    }

    getPostById = async (id) => {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('Invalid ID format');
            }
            const post = await this.collection.findOne({
                "_id": new ObjectId(id)
            });
            if (!post) {
                throw new Error('Post not found');
            } 
            return post;
        }
        catch (err) {
            throw new Error('Error retrieving post by ID');
        }
    }


    deletePost = async (postId) => {
        try {
            const result = await this.collection.deleteOne({ _id: new ObjectId(postId) });
            return result.deletedCount > 0 ? { success: true } : { success: false }; // true, якщо видалено один документ
        } catch (error) {
            throw new Error('Error deleting post');
        }
    }
}

module.exports = Post;

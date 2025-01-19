const Todo = require('../models/todo');

class TodoController {
    async createTodo(req, res) {
        const { title, description } = req.body;
        const userId = req.user.id;

        try {
            const newTodo = new Todo({
                title,
                description,
                userId,
            });
            await newTodo.save();
            res.status(201).json({ message: 'Todo created successfully', data: newTodo });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((val) => val.message);
                return res.status(400).json({ message: 'Validation error', error: messages });
            } else {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        }
    }

    async getTodos(req, res) {
        const userId = req.user.id;
        try {
            const todos = await Todo.find({ userId });
            res.status(200).json({ data: todos });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((val) => val.message);
                return res.status(400).json({ message: 'Validation error', error: messages });
            } else {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        }
    }

    async getTodoById(req, res) {
        const { id } = req.params;
        try {
            const todo = await Todo.findById(id);
            if (!todo) {
                return res.status(404).json({message: 'Todo not found'});
            }
            res.status(200).json({data: todo});
        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((val) => val.message);
                return res.status(400).json({ message: 'Validation error', error: messages });
            } else {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        }
    }

    async updateTodoById(req, res) {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        try {
            const updatedTodo = await Todo.findByIdAndUpdate(
                id,
                { title, description, completed },
                { new: true }
            );
            if (!updatedTodo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.status(200).json({ message: 'Todo updated successfully', data: updatedTodo });
        } catch (error) {
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((val) => val.message);
                return res.status(400).json({ message: 'Validation error', error: messages });
            } else {
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        }
    }

    async deleteTodoById(req, res) {
        const { id } = req.params;
        try {
            const deletedTodo = await Todo.findByIdAndDelete(id);
            if (!deletedTodo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.status(200).json({ message: 'Todo deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

        // ... fungsi lainnya

        async toggleLike(req, res) {
            const { id } = req.params; // ID Todo yang akan di-like
            const userId = req.user.id; // ID User yang berasal dari JWT
        
            try {
                // Cari todo berdasarkan ID
                const todo = await Todo.findById(id);
                if (!todo) {
                    return res.status(404).json({ message: 'Todo not found' });
                }
        
                console.log('Todo before modification:', todo);
        
                // Periksa apakah user sudah menyukai Todo
                const isLiked = todo.likedBy.includes(userId);
        
                if (isLiked) {
                    // Jika sudah disukai, hapus user dari daftar `likedBy`
                    todo.likedBy = todo.likedBy.filter((likedId) => likedId.toString() !== userId);
                } else {
                    // Jika belum disukai, tambahkan user ke daftar `likedBy`
                    todo.likedBy.push(userId);
                }
        
                // Simpan perubahan ke database
                const updatedTodo = await todo.save();
        
                console.log('Todo after modification:', updatedTodo);
        
                res.status(200).json({
                    message: isLiked ? 'Unliked successfully' : 'Liked successfully',
                    liked: !isLiked,
                    likedBy: updatedTodo.likedBy, // Kirim array likedBy terbaru
                    likedByCount: updatedTodo.likedBy.length, // Total jumlah like
                });
            } catch (error) {
                console.error('Error in toggleLike:', error);
                res.status(500).json({ message: 'Server error', error: error.message });
            }
        }
        
        
}

module.exports = new TodoController();
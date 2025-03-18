const express = require('express')
const app = express();
const path = require('path');
const fs = require('fs').promises;

app.use(express.json());
const userFile = path.join(__dirname, 'other_users.json');

const readUsers = async () => {
    try {
        const data = await fs.readFile(userFile, 'utf-8');
        return data.trim() ? JSON.parse(data) : [];
    } catch (err) {
        console.error("Error reading users file:", err);
        return [];
    }
};

const writeUsers = async (users) => {
    try {
        await fs.writeFile(userFile, JSON.stringify(users, null, 2), 'utf-8');
    } catch (err) {
        console.error("Error writing users file:", err);
    }
};

app.post('/users', async(req,res)=>{
    const {username, password, firstname, lastname} = req.body;
    let users = await readUsers();
    const newUser = { id: users.length + 1, username, password, firstname, lastname };

    users.push(newUser);
    await writeUsers(users);

    res.status(201).json(newUser);
})  

app.get('/users/search', async(req, res) => {
    const { query } = req.query;
    if (!query) return res.json([]);
    let users = await readUsers();
    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));
    res.json(filteredUsers);
});

app.listen(5000, () => console.log('Server running on port 5000'));
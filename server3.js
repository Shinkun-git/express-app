const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = 3000;

const user_file = path.resolve(__dirname, 'users.json');
app.use(express.json());

// Read Data
const readUsers = async () => {
    try {
        const data = await fs.readFile(user_file, 'utf-8');
        if (!data.trim()) return [];
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading users.json:", err);
        return [];
    }
};

//write Data
const writeUsers = async (users) => {
    try {
        await fs.writeFile(user_file, JSON.stringify(users, null, 2), 'utf-8');
    } catch (err) {
        console.error("Error writing users.json:", err);
    }
};

//home route displays all users
app.get("/home",  async(req, res) => {
    const users = await readUsers();
    res.json(users);
})

//middleware to add timeStamp of user creation
const addTimestamp = (req, res, next) => {
    req.body.created_on = new Date().toISOString(); 
    next();
};

//addUser post route to add new user
app.post("/addUser", addTimestamp,async(req,res)=>{
    const newUser = req.body;
    const data = await readUsers();
    data.push(newUser);
    await writeUsers(data);
    res.status(201).json({ message: "User added successfully!", user: newUser });
})


// delete route to delete specific user
app.delete("/deleteUser/:id", async (req, res) => {
    const userId = parseInt(req.params.id); 

    let users = await readUsers();
    const initialLength = users.length;
    
    // Filter out the user with the given ID
    users = users.filter(user => user.id !== userId);

    if (users.length === initialLength) {
        return res.status(404).json({ error: "User not found" });
    }

    await writeUsers(users);
    res.json({ message: "User deleted successfully!" });
});

app.get("/about", (req, res) => {
    res.json({
        appName: "User Management API",
        description: "Users listing, addition & deletion",
        author: "Prsnt",
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
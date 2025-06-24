const express = require("express");
const app = express();
const fs = require("fs");
const users = require("./MOCK_DATA.json");

app.use(express.json());

app.get("/users", (req, res) => {
  const html = `
    <ul>
      ${users.map((user) => `<li>${user.user_name}</li>`).join("")}
    </ul>
  `;
  res.send(html);
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const body = req.body;
  if(!body.user_name || !body.age || !body.email){
    return res.status(400).json({msg: "All fileds are req..."});
  }
  users.push({id: users.length + 1, ...body});
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), () => {
    res.status(201).json({ status: "User created", user: users.length });
  });
})

app.put("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedData = req.body;
  console.log("updatedData", updatedData);
  const index = users.findIndex((user) => user.id === userId);
  users[index] = { ...users[index], ...updatedData };
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), () => {
    res.json({ status: "User updated", user: users[index] });
  });
});

app.delete("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex((user) => user.id === userId);
  const deleteUser = users.splice(index, 1);
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), () => {
    res.json({ status: "User deleted", user: deleteUser[0] });
  });
});

app.listen(3000, () => console.log("Server is runing..."));

const express = require("express");
const { name, datatype } = require("faker");
const app = express();
const PORT = 3000;
const COUNT = 1000000;

const users = createUsersList(COUNT);

function createUsersList(count = 1) {
  return new Array(count).fill(null).map((_, i) => ({
    id: i * 10 + datatype.number({ max: 8 }),
    name: name.findName(),
    followers: Array(3 + datatype.number({ min: 2, max: 20 }))
      .fill(null)
      .map((_, j) => j * 10 + datatype.number({ max: 8 })),
    age:
      45 +
      ((datatype.boolean() && 1) || -1) * Math.floor((Math.random() * 5.2) ** 2),
    verified: datatype.boolean(),
  }));
}

app.use(express.static("../web-client"));
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.listen(PORT);
console.log(`Listening on port' ${PORT} 🎉`);

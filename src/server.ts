import app from "./app.js";

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello");
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

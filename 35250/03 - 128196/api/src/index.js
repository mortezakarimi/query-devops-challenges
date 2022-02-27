const server = require("./main");

const { PORT: port = 80 } = process.env;

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

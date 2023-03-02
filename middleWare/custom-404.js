const path = require("path");

const custom404 = (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.resolve(__dirname, "../views/404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
};

module.exports = custom404;

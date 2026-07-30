const express = require("express");
const path = require("path");
const { interpret } = require("./routes/divination");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/api/interpret", (req, res) => {
  try {
    const { lines, question } = req.body;
    if (!lines) {
      return res.status(400).json({ success: false, error: "\u8BF7\u63D0\u4F9Blines\u6570\u636E" });
    }
    const result = interpret(lines, question);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get("/api/hexagrams/:id", (req, res) => {
  const { hexagrams } = require("./data/hexagrams");
  const id = parseInt(req.params.id);
  const hex = hexagrams.find(h => h.id === id);
  if (!hex) {
    return res.status(404).json({ success: false, error: "\u535C\u8C61\u4E0D\u5B58\u5728" });
  }
  res.json({ success: true, data: hex });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, error: "\u8BF7\u6C42\u6570\u636E\u683C\u5F0F\u9519\u8BEF" });
  }
  next(err);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("\u5468\u6613\u535C\u536E\u670D\u52A1\u5DF2\u542F\u52A8: http://localhost:" + PORT);
});
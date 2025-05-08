const express = require("express");
const bwipjs = require("bwip-js");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
const port = 3000;

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Статика (HTML, CSS, JS)
app.use(express.static("public"));

// Генерация штрих-кода
app.get("/generate-barcode", async (req, res) => {
  const { data = "123456789012", type = "code128" } = req.query;

  try {
    const svg = await bwipjs.toBuffer({
      bcid: type,
      text: data,
      scale: 3,
      height: 10,
      includetext: true,
      output: "svg", // Важно: генерируем SVG
    });

    console.log(svg.toString());

    res.set("Content-Type", "image/svg+xml");

    res.set("Content-Type", "image/svg+xml");
    res.send(svg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`🚀 Сервер работает на http://localhost:${port}`);
  console.log(`🔎 Swagger UI: http://localhost:${port}/api-docs`);
});

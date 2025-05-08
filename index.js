const express = require("express");
const bwipjs = require("bwip-js");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
const port = 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/generate-barcode", async (req, res) => {
  const { data = "123456789012", type = "code128" } = req.query;

  try {
    const png = await bwipjs.toBuffer({
      bcid: type, // Тип штрих-кода: code128, ean13, upca, и т.д.
      text: data,
      scale: 3,
      height: 10,
      includetext: true,
    });

    res.set("Content-Type", "image/png");
    res.send(png);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Barcode API is running. Visit /api-docs for Swagger UI.");
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

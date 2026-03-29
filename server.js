const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/productsDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: String,
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

app.post("/api/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.put("/api/products/:id", async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

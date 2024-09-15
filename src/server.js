const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json()); 
app.use(cors());       
app.use('/uploads', express.static('uploads'));

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = 'uploads/';
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

mongoose.connect("mongodb+srv://dipindasofficial:aB7gxz2F1zPG40zM@cluster0.xk3ll.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  jobTitle: { type: String, required: true },
  company: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  imagePath: { type: String } 
});

const Card = mongoose.model("Card", cardSchema);

app.post("/api/saveCardData", upload.single('image'), async (req, res) => {
  const { name, jobTitle, company, email, phone, address } = req.body;
  const imagePath = req.file ? req.file.path : ""; 

  if (!name || !jobTitle) {
    return res.status(400).json({ message: "Name and job title are required" });
  }

  try {
    const newCard = new Card({
      name,
      jobTitle,
      company,
      email,
      phone,
      address,
      imagePath,
    });

    await newCard.save();
    res.status(201).json({ message: "Card data saved successfully", card: newCard });
  } catch (error) {
    console.error("Error saving card data:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});

app.get("/api/cards", async (req, res) => {
  try {
    const cards = await Card.find(); 
    res.json(cards);
  } catch (error) {
    console.error("Error fetching card data:", error);
    res.status(500).json({ message: "Failed to fetch card data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

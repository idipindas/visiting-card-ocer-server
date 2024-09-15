const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize app and middleware
const app = express();
app.use(express.json()); // To parse incoming JSON requests
app.use(cors());         // To allow cross-origin requests

// Connect to MongoDB
mongoose.connect("mongodb+srv://dipindasofficial:aB7gxz2F1zPG40zM@cluster0.xk3ll.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Create a Mongoose schema for the card details
const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  jobTitle: { type: String, required: true },
  company: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String }
});

// Create a Mongoose model for cards
const Card = mongoose.model("Card", cardSchema);

// API route to save card data
app.post("/api/saveCardData", async (req, res) => {
  const { name, jobTitle, company, email, phone, address } = req.body;

  // Validate required fields
  if (!name || !jobTitle) {
    return res.status(400).json({ message: "Name and job title are required" });
  }

  try {
    // Create a new card document
    const newCard = new Card({
      name,
      jobTitle,
      company,
      email,
      phone,
      address,
    });

    // Save the card data to MongoDB
    await newCard.save();
    res.status(201).json({ message: "Card data saved successfully", card: newCard });
  } catch (error) {
    console.error("Error saving card data:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
});
app.get("/api/cards", async (req, res) => {
    try {
      const cards = await Card.find(); // Fetch all cards from the database
      res.json(cards);
    } catch (error) {
      console.error("Error fetching card data:", error);
      res.status(500).json({ message: "Failed to fetch card data" });
    }
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

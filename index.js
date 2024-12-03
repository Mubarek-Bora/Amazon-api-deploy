const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Define routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Success!" });
});

app.post("/payment/create", async (req, res) => {
  const total = req.query.total;

  // Validate that 'total' is greater than 0
  if (total > 0) {
    try {
      // Create a payment intent using Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd", // Correct property name
      });
      // Respond with the created payment intent
      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      // Handle errors from Stripe API
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent." });
    }
  } else {
    // If 'total' is not valid
    res.status(403).json({
      message: "Total must be greater than 0",
    });
  }
});

app.listen(5000,(err)=>{
    if(err) throw err
    console.log("Amazon server running on PORT:5000,http://localhost:5000")
}
)


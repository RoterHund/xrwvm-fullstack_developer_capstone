// Import required modules
const express = require('express'); // Express framework for handling HTTP requests
const mongoose = require('mongoose'); // Mongoose for MongoDB object modeling
const fs = require('fs'); // File system module for file operations
const cors = require('cors'); // CORS middleware for enabling cross-origin resource sharing
const app = express(); // Initialize Express application
const port = 3030; // Port number for the server

// Enable CORS middleware
app.use(cors());

// Use body-parser middleware to parse incoming request bodies
app.use(require('body-parser').urlencoded({ extended: false }));

// Load JSON data files into memory
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// Connect to MongoDB database
mongoose.connect("mongodb://mongo_db:27017/", { 'dbName': 'dealershipsDB' });

// Import Mongoose models for Reviews and Dealerships
const Reviews = require('./review');
const Dealerships = require('./dealership');
const { request } = require('http');

// Insert data into MongoDB collections
try {
  // Delete existing documents and insert new ones for reviews and dealerships
  Reviews.deleteMany({}).then(() => {
    Reviews.insertMany(reviews_data['reviews']);
  });
  Dealerships.deleteMany({}).then(() => {
    Dealerships.insertMany(dealerships_data['dealerships']);
  });
} catch (error) {
  // Handle errors during data insertion
  res.status(500).json({ error: 'Error fetching documents' });
}

// Express route to home
app.get('/', async (req, res) => {
  // Send a welcome message to the client
  res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    // Retrieve all reviews from the Reviews collection
    const documents = await Reviews.find();
    // Send the reviews as JSON response
    res.json(documents);
  } catch (error) {
    // Handle errors during fetching reviews
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    // Retrieve reviews for a specific dealer ID
    const documents = await Reviews.find({ dealership: req.params.id });
    // Send the reviews as JSON response
    res.json(documents);
  } catch (error) {
    // Handle errors during fetching reviews by dealer
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
    try {
      // Implement code to fetch all dealerships
      const documents = await Dealerships.find();
      // Sends the reviews as JSON response
      res.json(documents);
        
    } catch (error) {
        // Handle errors during fetching reviews by dealer
        res.status(500).json({ error: "Effort fetching documents"});
  }
});


// Express route to fetch dealerships by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
    try {
      // Implement code to fetch dealerships by state
      const documents = await Dealerships.find( { state: req.params.state });
      res.json(documents);        
    } catch (error) {
        res.status(500).json( { error: "Error fetching documents"})
    }
});


// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  // Implement code to fetch dealer by ID
  try {
    const documents = await Dealerships.find({ id: req.params.id });
    res.json(documents);
  } catch (error) {
   res.status(500).json({ error: "Error fetching documents"});
  }
});

// Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  // Parse the incoming request body
  data = JSON.parse(req.body);
  // Retrieve the latest review ID
  const documents = await Reviews.find().sort({ id: -1 });
  let new_id = documents[0]['id'] + 1;

  // Create a new review object
  const review = new Reviews({
    "id": new_id,
    "name": data['name'],
    "dealership": data['dealership'],
    "review": data['review'],
    "purchase": data['purchase'],
    "purchase_date": data['purchase_date'],
    "car_make": data['car_make'],
    "car_model": data['car_model'],
    "car_year": data['car_year'],
  });

  try {
    // Save the new review to the database
    const savedReview = await review.save();
    // Send the saved review as JSON response
    res.json(savedReview);
  } catch (error) {
    // Handle errors during review insertion
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
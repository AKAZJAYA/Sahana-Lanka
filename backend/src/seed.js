// Run this script with: node src/seed.js
// Make sure your MongoDB connection is configured in .env file

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Need = require("./models/Need");

// Load environment variables
dotenv.config();

const sampleNeeds = [
  {
    name: "Nimal Perera",
    phone: "+94771234567",
    location: "Ratmalana Community Center",
    lat: 6.8211,
    lng: 79.8778,
    items: [
      { name: "Rice", quantity: "10 kg" },
      { name: "Drinking Water", quantity: "20 bottles" },
      { name: "Blankets", quantity: "5" },
    ],
    description:
      "Family of 5 displaced by flooding. Need basic supplies urgently.",
  },
  {
    name: "Kumari Silva",
    phone: "+94712345678",
    location: "Moratuwa Relief Camp",
    lat: 6.7722,
    lng: 79.8816,
    items: [
      { name: "Baby Formula", quantity: "3 tins" },
      { name: "Diapers", quantity: "2 packs" },
      { name: "Milk Powder", quantity: "1 kg" },
    ],
    description:
      "Mother with infant. Baby supplies needed for evacuation shelter.",
  },
  {
    name: "Ranjith Fernando",
    phone: "+94723456789",
    location: "Kelaniya Temple Grounds",
    lat: 6.9549,
    lng: 79.9219,
    items: [
      { name: "Dry Rations", quantity: "15 kg" },
      { name: "Candles", quantity: "10" },
      { name: "Matches", quantity: "5 boxes" },
    ],
    description:
      "Temporary shelter for 8 people. Power is out, need basic food and lighting.",
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");

    // Clear existing needs
    const deleteResult = await Need.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing needs`);

    // Insert sample needs
    const insertedNeeds = await Need.insertMany(sampleNeeds);
    console.log(
      `✨ Successfully inserted ${insertedNeeds.length} sample needs:`
    );

    insertedNeeds.forEach((need, index) => {
      console.log(`\n${index + 1}. ${need.name} - ${need.location}`);
      console.log(
        `   Items: ${need.items
          .map((item) => `${item.name} (${item.quantity})`)
          .join(", ")}`
      );
    });

    console.log("\n✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();

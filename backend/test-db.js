const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const testConnection = async () => {
  console.log('Testing connection to:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//****:****@'));
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Success! Database is reachable.');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to connect to database.');
    console.error('Reason:', err.message);
    process.exit(1);
  }
};

testConnection();

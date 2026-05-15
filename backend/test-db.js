const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const testConnection = async () => {
  console.log('Testing connection to:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//****:****@'));
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log('✅ Success! Database is reachable.');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to connect to database.');
    console.error('Reason:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
       console.log('\n💡 DIAGNOSIS: This is likely a DNS or IP Whitelist issue.');
       console.log('Your current IP is: 103.68.11.170');
       console.log('Please ensure this IP is added to your MongoDB Atlas Network Access whitelist.');
    }
    process.exit(1);
  }
};

testConnection();

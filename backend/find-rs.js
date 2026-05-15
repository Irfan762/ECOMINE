const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const findReplicaSet = async () => {
  const node = 'ac-kntw8rz-shard-00-00.mtvmw5p.mongodb.net:27017';
  const uri = `mongodb://irfan:irfan123@ac-kntw8rz-shard-00-00.mtvmw5p.mongodb.net:27017/ecomine?ssl=true&authSource=admin`;
  
  console.log('Attempting to connect to single node to find ReplicaSet...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    const status = await mongoose.connection.db.admin().command({ isMaster: 1 });
    console.log('ReplicaSet Name:', status.setName);
    process.exit(0);
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  }
};

findReplicaSet();

import 'dotenv/config';
import { connectToDatabase, closeConnection } from '../config/database.js';
import { seedExercises } from '../data/seedExercises.js';

const EXERCISES_COLLECTION = 'exercises';

async function seed() {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(EXERCISES_COLLECTION);
    const existing = await collection.countDocuments();
    if (existing > 0) {
      console.log(
        `Collection "${EXERCISES_COLLECTION}" already has ${existing} documents. Clear it first if you want to re-seed.`
      );
      await closeConnection();
      process.exit(0);
      return;
    }
    const result = await collection.insertMany(seedExercises);
    console.log(`Inserted ${result.insertedCount} exercises.`);
    await closeConnection();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    await closeConnection();
    process.exit(1);
  }
}

seed();

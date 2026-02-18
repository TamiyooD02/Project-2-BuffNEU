import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/database.js';

const router = Router();
const COLLECTION = 'exercises';

/**
 * GET /api/exercises
 * Get all exercises. Optional query: ?category=arms
 */
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(COLLECTION);
    const category = req.query.category;
    const filter = category ? { category } : {};
    const exercises = await collection.find(filter).sort({ name: 1 }).toArray();
    res.json(exercises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

/**
 * GET /api/exercises/:id
 * Get a single exercise by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid exercise ID' });
    }
    const db = await connectToDatabase();
    const collection = db.collection(COLLECTION);
    const exercise = await collection.findOne({ _id: new ObjectId(id) });
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
});

/**
 * POST /api/exercises
 * Create a new exercise
 */
router.post('/', async (req, res) => {
  try {
    const { name, category, description, equipment, difficulty } = req.body;
    if (!name || !category || !description) {
      return res
        .status(400)
        .json({ error: 'Name, category, and description are required' });
    }
    const db = await connectToDatabase();
    const collection = db.collection(COLLECTION);
    const doc = {
      name: String(name).trim(),
      category: String(category).toLowerCase().trim(),
      description: String(description).trim(),
      equipment: equipment ? String(equipment).trim() : '',
      difficulty: difficulty
        ? String(difficulty).toLowerCase().trim()
        : 'beginner',
    };
    const result = await collection.insertOne(doc);
    const exercise = await collection.findOne({ _id: result.insertedId });
    res.status(201).json(exercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
});

/**
 * PUT /api/exercises/:id
 * Update an exercise
 */
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid exercise ID' });
    }
    const { name, category, description, equipment, difficulty } = req.body;
    const db = await connectToDatabase();
    const collection = db.collection(COLLECTION);
    const update = {};
    if (name !== undefined) update.name = String(name).trim();
    if (category !== undefined)
      update.category = String(category).toLowerCase().trim();
    if (description !== undefined)
      update.description = String(description).trim();
    if (equipment !== undefined) update.equipment = String(equipment).trim();
    if (difficulty !== undefined)
      update.difficulty = String(difficulty).toLowerCase().trim();
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update exercise' });
  }
});

/**
 * DELETE /api/exercises/:id
 * Delete an exercise
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid exercise ID' });
    }
    const db = await connectToDatabase();
    const collection = db.collection(COLLECTION);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete exercise' });
  }
});

export default router;

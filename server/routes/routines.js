import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/database.js';

const router = Router();
const ROUTINES_COLLECTION = 'routines';

/**
 * GET /api/routines
 * Get all routines
 */
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(ROUTINES_COLLECTION);
    const routines = await collection
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();
    res.json(routines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch routines' });
  }
});

/**
 * GET /api/routines/:id
 * Get a single routine by ID (exercises array already has denormalized names)
 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid routine ID' });
    }
    const db = await connectToDatabase();
    const collection = db.collection(ROUTINES_COLLECTION);
    const routine = await collection.findOne({ _id: new ObjectId(id) });
    if (!routine) {
      return res.status(404).json({ error: 'Routine not found' });
    }
    res.json(routine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch routine' });
  }
});

/**
 * POST /api/routines
 * Create a new routine
 */
router.post('/', async (req, res) => {
  try {
    const { name, description, exercises } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Routine name is required' });
    }
    const db = await connectToDatabase();
    const collection = db.collection(ROUTINES_COLLECTION);
    const now = new Date();
    const normalizedExercises = Array.isArray(exercises)
      ? exercises.map((ex, index) => ({
          exerciseId: ex.exerciseId ? new ObjectId(ex.exerciseId) : null,
          exerciseName: ex.exerciseName || '',
          sets:
            typeof ex.sets === 'number' ? ex.sets : parseInt(ex.sets, 10) || 3,
          reps: ex.reps != null ? String(ex.reps) : '10',
          order: typeof ex.order === 'number' ? ex.order : index,
        }))
      : [];
    const doc = {
      name: name.trim(),
      description: description ? String(description).trim() : '',
      exercises: normalizedExercises,
      createdAt: now,
      updatedAt: now,
    };
    const result = await collection.insertOne(doc);
    const routine = await collection.findOne({ _id: result.insertedId });
    res.status(201).json(routine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create routine' });
  }
});

/**
 * PUT /api/routines/:id
 * Update a routine (name, description, exercises order/swap/remove)
 */
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid routine ID' });
    }
    const { name, description, exercises } = req.body;
    const db = await connectToDatabase();
    const collection = db.collection(ROUTINES_COLLECTION);
    const update = { updatedAt: new Date() };
    if (name !== undefined) update.name = String(name).trim();
    if (description !== undefined)
      update.description = String(description).trim();
    if (Array.isArray(exercises)) {
      update.exercises = exercises.map((ex, index) => ({
        exerciseId: ex.exerciseId ? new ObjectId(ex.exerciseId) : null,
        exerciseName: ex.exerciseName || '',
        sets:
          typeof ex.sets === 'number' ? ex.sets : parseInt(ex.sets, 10) || 3,
        reps: ex.reps != null ? String(ex.reps) : '10',
        order: typeof ex.order === 'number' ? ex.order : index,
      }));
    }
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result) {
      return res.status(404).json({ error: 'Routine not found' });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update routine' });
  }
});

/**
 * DELETE /api/routines/:id
 * Delete a routine
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid routine ID' });
    }
    const db = await connectToDatabase();
    const collection = db.collection(ROUTINES_COLLECTION);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Routine not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete routine' });
  }
});

export default router;

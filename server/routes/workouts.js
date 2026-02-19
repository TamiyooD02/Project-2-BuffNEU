// workouts routes
import express from "express";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../config/database.js";

const router = express.Router();
const COLLECTION = "workouts";

// GET ALL WORKOUTS
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase(); // get db
    const collection = db.collection(COLLECTION);
    const workouts = await collection.find().toArray(); // get all workouts
    res.json(workouts); // send back as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not get workouts" });
  }
});

// ADD NEW WORKOUT
router.post("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(COLLECTION);

    // create workout object from form
    const newWorkout = {
      date: req.body.date,
      exerciseName: req.body.exerciseName,
      sets: Number(req.body.sets),
      reps: Number(req.body.reps),
    };

    const result = await collection.insertOne(newWorkout); // add to db
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add workout" });
  }
});

// GET ONE WORKOUT
router.get("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(COLLECTION);

    const id = req.params.id;
    const workout = await collection.findOne({ _id: new ObjectId(id) });

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not get workout" });
  }
});

// UPDATE A WORKOUT
router.put("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(COLLECTION);

    const id = req.params.id; // get id from URL

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    res.json({ message: "Workout updated!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update workout" });
  }
});

// DELETE A WORKOUT
router.delete("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection(COLLECTION);

    const id = req.params.id;
    await collection.deleteOne({ _id: new ObjectId(id) });

    res.json({ message: "Workout deleted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete workout" });
  }
});

export default router;
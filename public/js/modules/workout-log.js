// workout log page JS
// simple beginner version with comments

import { api } from "./api.js";

// get form and history list elements
const form = document.getElementById("form-workout");
const list = document.getElementById("workout-history");

// load all workouts from database
async function loadWorkouts() {
  try {
    const workouts = await api.workouts.getAll(); // get all workouts
    workouts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    list.innerHTML = ""; // clear previous list

    // if no workouts, show message
    if (workouts.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No workouts yet!";
      list.appendChild(p);
      return;
    }

    // show each workout in list
    for (let i = 0; i < workouts.length; i++) {
      const w = workouts[i];
      const li = document.createElement("li");
      li.className = "routine-list-item";

      // create simple content
      li.innerHTML = `
        <span>${w.date} - ${w.exerciseName} (${w.sets} sets x ${w.reps} reps)</span>
        <div>
          <button class="btn btn--secondary btn-edit" data-id="${w._id}">Edit</button>
          <button class="btn btn--danger btn-delete" data-id="${w._id}">Delete</button>
        </div>
      `;
      list.appendChild(li);
    }
  } catch (err) {
    console.log("Error loading workouts", err);
    alert("Could not load workouts");
  }
}

// add new workout from form
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // make workout object
  const workout = {
    date: document.getElementById("workout-date").value,
    exerciseName: document.getElementById("exercise-name").value,
    sets: Number(document.getElementById("workout-sets").value),
    reps: Number(document.getElementById("workout-reps").value),
  };

  try {
    await api.workouts.create(workout); // send to API
    form.reset(); // clear form
    loadWorkouts(); // refresh list
  } catch (err) {
    console.log("Error adding workout", err);
    alert("Could not add workout");
  }
});

// handle edit and delete buttons
list.addEventListener("click", async function (e) {
  const id = e.target.dataset.id; // get workout id

  // DELETE
  if (e.target.classList.contains("btn-delete")) {
    try {
      await api.workouts.delete(id);
      loadWorkouts();
    } catch (err) {
      console.log("Error deleting workout", err);
      alert("Could not delete workout");
    }
  }

  // EDIT
  if (e.target.classList.contains("btn-edit")) {
    try {
      const w = await api.workouts.getOne(id);

      let newDate = prompt("Date:", w.date);
      if (!newDate) return;

      let newName = prompt("Exercise Name:", w.exerciseName);
      if (!newName) return;

      let newSets = prompt("Sets:", w.sets);
      if (!newSets) return;

      let newReps = prompt("Reps:", w.reps);
      if (!newReps) return;

      const updated = {
        date: newDate,
        exerciseName: newName,
        sets: Number(newSets),
        reps: Number(newReps),
      };

      await api.workouts.update(id, updated);
      loadWorkouts();
    } catch (err) {
      console.log("Error editing workout", err);
      alert("Could not edit workout");
    }
  }
});

// initial load
loadWorkouts();

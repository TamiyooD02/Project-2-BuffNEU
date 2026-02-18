import { api } from './api.js';

let routines = [];
let exercises = [];
let currentRoutineId = null;

const selectors = {
  routineList: '#routine-list',
  routineListEmpty: '#routine-list-empty',
  btnNewRoutine: '#btn-new-routine',
  routineEditor: '#routine-editor',
  routineEditorTitle: '#routine-editor-title',
  formRoutine: '#form-routine',
  routineName: '#routine-name',
  routineDescription: '#routine-description',
  btnCloseEditor: '#btn-close-editor',
  btnSaveRoutine: '#btn-save-routine',
  btnDeleteRoutine: '#btn-delete-routine',
  routineExercises: '#routine-exercises',
  routineExercisesEmpty: '#routine-exercises-empty',
  addExerciseCategory: '#add-exercise-category',
  addExercisePicker: '#add-exercise-picker',
  modalAdd: '#modal-add-to-routine',
  formAddToRoutine: '#form-add-to-routine',
  addModalExerciseName: '#add-modal-exercise-name',
  addSets: '#add-sets',
  addReps: '#add-reps',
  btnCancelAdd: '#btn-cancel-add',
};

function getEl(sel) {
  return document.querySelector(sel);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function loadRoutines() {
  try {
    routines = await api.routines.getAll();
    renderRoutineList();
  } catch (err) {
    console.error(err);
    getEl(selectors.routineList).innerHTML =
      '<li class="routine-builder__error">Failed to load routines.</li>';
  }
}

async function loadExercises() {
  try {
    exercises = await api.exercises.getAll();
    renderExercisePicker();
  } catch (err) {
    console.error(err);
  }
}

function renderRoutineList() {
  const listEl = getEl(selectors.routineList);
  const emptyEl = getEl(selectors.routineListEmpty);
  if (!listEl || !emptyEl) return;

  listEl.innerHTML = '';
  routines.forEach((r) => {
    const li = document.createElement('li');
    li.className = 'routine-list-item';
    li.innerHTML = `
      <a href="#" class="routine-list-item__link" data-id="${r._id}">${escapeHtml(r.name)}</a>
      <span class="routine-list-item__count">${r.exercises.length} exercises</span>
    `;
    li.querySelector('.routine-list-item__link').addEventListener(
      'click',
      (e) => {
        e.preventDefault();
        openEditor(r._id);
      }
    );
    listEl.appendChild(li);
  });

  emptyEl.classList.toggle('hidden', routines.length > 0);
}

function getCurrentRoutine() {
  if (!currentRoutineId) return null;
  return routines.find((r) => r._id === currentRoutineId);
}

function openEditor(routineId) {
  currentRoutineId = routineId;
  const editor = getEl(selectors.routineEditor);
  const routine = getCurrentRoutine();
  if (!routine) return;
  editor.classList.remove('hidden');
  getEl(selectors.routineEditorTitle).textContent = 'Edit Routine';
  getEl(selectors.routineName).value = routine.name;
  getEl(selectors.routineDescription).value = routine.description || '';
  renderRoutineExercises();
  renderExercisePicker();
}

function closeEditor() {
  currentRoutineId = null;
  getEl(selectors.routineEditor).classList.add('hidden');
}

function renderRoutineExercises() {
  const routine = getCurrentRoutine();
  const listEl = getEl(selectors.routineExercises);
  const emptyEl = getEl(selectors.routineExercisesEmpty);
  if (!listEl || !emptyEl || !routine) return;

  const items = (routine.exercises || [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  listEl.innerHTML = '';
  items.forEach((ex, index) => {
    const li = document.createElement('li');
    li.className = 'routine-exercise-item';
    li.setAttribute('data-index', index);
    li.innerHTML = `
      <span class="routine-exercise-item__order">${index + 1}.</span>
      <span class="routine-exercise-item__name">${escapeHtml(ex.exerciseName)}</span>
      <span class="routine-exercise-item__sets-reps">${ex.sets} × ${ex.reps}</span>
      <div class="routine-exercise-item__actions">
        <button type="button" class="btn btn--small btn-move-up" data-index="${index}" aria-label="Move up">↑</button>
        <button type="button" class="btn btn--small btn-move-down" data-index="${index}" aria-label="Move down">↓</button>
        <button type="button" class="btn btn--danger btn--small btn-remove-exercise" data-index="${index}">Remove</button>
      </div>
    `;
    li.querySelector('.btn-move-up').addEventListener('click', () =>
      moveExercise(index, -1)
    );
    li.querySelector('.btn-move-down').addEventListener('click', () =>
      moveExercise(index, 1)
    );
    li.querySelector('.btn-remove-exercise').addEventListener('click', () =>
      removeExercise(index)
    );
    listEl.appendChild(li);
  });
  emptyEl.classList.toggle('hidden', items.length > 0);
}

function moveExercise(index, delta) {
  const routine = getCurrentRoutine();
  if (!routine || !routine.exercises) return;
  const newIndex = index + delta;
  if (newIndex < 0 || newIndex >= routine.exercises.length) return;
  const arr = routine.exercises.slice();
  const [item] = arr.splice(index, 1);
  arr.splice(newIndex, 0, item);
  routine.exercises = arr.map((ex, i) => ({ ...ex, order: i }));
  saveRoutineExercises();
}

function removeExercise(index) {
  const routine = getCurrentRoutine();
  if (!routine || !routine.exercises) return;
  routine.exercises = routine.exercises.filter((_, i) => i !== index);
  saveRoutineExercises();
}

async function saveRoutineExercises() {
  const routine = getCurrentRoutine();
  if (!routine || !currentRoutineId) return;
  try {
    const updated = await api.routines.update(currentRoutineId, {
      name: routine.name,
      description: routine.description,
      exercises: routine.exercises,
    });
    const idx = routines.findIndex((r) => r._id === currentRoutineId);
    if (idx !== -1) routines[idx] = updated;
    renderRoutineExercises();
    renderRoutineList();
  } catch (err) {
    console.error(err);
    alert(err.body?.error || 'Failed to update routine');
  }
}

function renderExercisePicker() {
  const category = (getEl(selectors.addExerciseCategory) || {}).value || '';
  const listEl = getEl(selectors.addExercisePicker);
  if (!listEl) return;

  const filtered = category
    ? exercises.filter((ex) => ex.category === category)
    : exercises;
  listEl.innerHTML = '';
  filtered.forEach((ex) => {
    const li = document.createElement('li');
    li.className = 'exercise-picker-item';
    li.innerHTML = `
      <button type="button" class="btn btn--secondary btn--small btn-add-to-routine" data-id="${ex._id}" data-name="${escapeHtml(ex.name)}">
        ${escapeHtml(ex.name)} <span class="badge badge--category">${ex.category}</span>
      </button>
    `;
    li.querySelector('.btn-add-to-routine').addEventListener('click', () => {
      openAddModal(ex._id, ex.name);
    });
    listEl.appendChild(li);
  });
}

let pendingAddExerciseId = null;
let pendingAddExerciseName = null;

function openAddModal(exerciseId, exerciseName) {
  pendingAddExerciseId = exerciseId;
  pendingAddExerciseName = exerciseName;
  getEl(selectors.addModalExerciseName).textContent = exerciseName;
  getEl(selectors.addSets).value = 3;
  getEl(selectors.addReps).value = '10';
  getEl(selectors.modalAdd).showModal();
}

function closeAddModal() {
  getEl(selectors.modalAdd).close();
  pendingAddExerciseId = null;
  pendingAddExerciseName = null;
}

async function submitAddToRoutine(e) {
  e.preventDefault();
  const routine = getCurrentRoutine();
  if (!routine || !pendingAddExerciseId) {
    closeAddModal();
    return;
  }
  const sets = parseInt(getEl(selectors.addSets).value, 10) || 3;
  const reps = String(getEl(selectors.addReps).value || '10').trim();
  const newExercises = (routine.exercises || []).concat([
    {
      exerciseId: pendingAddExerciseId,
      exerciseName: pendingAddExerciseName,
      sets,
      reps,
      order: (routine.exercises || []).length,
    },
  ]);
  try {
    const updated = await api.routines.update(currentRoutineId, {
      name: routine.name,
      description: routine.description,
      exercises: newExercises,
    });
    const idx = routines.findIndex((r) => r._id === currentRoutineId);
    if (idx !== -1) routines[idx] = updated;
    closeAddModal();
    renderRoutineExercises();
    renderRoutineList();
  } catch (err) {
    console.error(err);
    alert(err.body?.error || 'Failed to add exercise');
  }
}

async function saveRoutineForm(e) {
  e.preventDefault();
  const name = getEl(selectors.routineName).value.trim();
  const description = getEl(selectors.routineDescription).value.trim();
  if (!name) return;
  const routine = getCurrentRoutine();
  if (!routine) return;
  try {
    const updated = await api.routines.update(currentRoutineId, {
      name,
      description,
      exercises: routine.exercises,
    });
    const idx = routines.findIndex((r) => r._id === currentRoutineId);
    if (idx !== -1) routines[idx] = updated;
    renderRoutineList();
  } catch (err) {
    console.error(err);
    alert(err.body?.error || 'Failed to save routine');
  }
}

async function createNewRoutine() {
  const name = prompt('Routine name:');
  if (!name || !name.trim()) return;
  try {
    const routine = await api.routines.create({
      name: name.trim(),
      description: '',
      exercises: [],
    });
    routines.push(routine);
    renderRoutineList();
    openEditor(routine._id);
  } catch (err) {
    console.error(err);
    alert(err.body?.error || 'Failed to create routine');
  }
}

async function deleteCurrentRoutine() {
  if (!currentRoutineId) return;
  if (!confirm('Delete this routine? This cannot be undone.')) return;
  try {
    await api.routines.delete(currentRoutineId);
    routines = routines.filter((r) => r._id !== currentRoutineId);
    closeEditor();
    renderRoutineList();
  } catch (err) {
    console.error(err);
    alert(err.body?.error || 'Failed to delete routine');
  }
}

function bindEditor() {
  getEl(selectors.btnNewRoutine).addEventListener('click', createNewRoutine);
  getEl(selectors.btnCloseEditor).addEventListener('click', closeEditor);
  getEl(selectors.formRoutine).addEventListener('submit', saveRoutineForm);
  getEl(selectors.btnDeleteRoutine).addEventListener(
    'click',
    deleteCurrentRoutine
  );
  getEl(selectors.addExerciseCategory).addEventListener(
    'change',
    renderExercisePicker
  );
  getEl(selectors.formAddToRoutine).addEventListener(
    'submit',
    submitAddToRoutine
  );
  getEl(selectors.btnCancelAdd).addEventListener('click', closeAddModal);
  getEl(selectors.modalAdd).addEventListener('cancel', closeAddModal);
}

function maybeOpenFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const exerciseId = params.get('exercise');
  if (exerciseId) {
    loadRoutines().then(() => {
      const first = routines[0];
      if (first) openEditor(first._id);
      else createNewRoutine();
    });
  }
}

export function initRoutineBuilder() {
  bindEditor();
  loadRoutines();
  loadExercises();
  maybeOpenFromQuery();
}

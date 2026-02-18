import { api } from './api.js';

let allExercises = [];
let currentCategory = '';
let editingId = null;

const selectors = {
  list: '#exercise-list',
  empty: '#exercise-list-empty',
  search: '#search-input',
  btnAdd: '#btn-add-exercise',
  modal: '#modal-exercise',
  form: '#form-exercise',
  btnCancel: '#btn-cancel-exercise',
  name: '#exercise-name',
  category: '#exercise-category',
  description: '#exercise-description',
  equipment: '#exercise-equipment',
  difficulty: '#exercise-difficulty',
};

function getEl(sel) {
  return document.querySelector(sel);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderExerciseCard(exercise) {
  const name = escapeHtml(exercise.name);
  const category = escapeHtml(exercise.category);
  const description = escapeHtml(
    exercise.description.length > 120
      ? exercise.description.slice(0, 120) + '...'
      : exercise.description
  );
  const equipment = escapeHtml(exercise.equipment || '—');
  const difficulty = escapeHtml(exercise.difficulty || 'beginner');
  const id = exercise._id;

  const li = document.createElement('li');
  li.className = 'exercise-card';
  li.setAttribute('data-id', id);
  li.innerHTML = `
    <div class="exercise-card__header">
      <h3 class="exercise-card__name">${name}</h3>
      <span class="badge badge--category">${category}</span>
    </div>
    <p class="exercise-card__description">${description}</p>
    <div class="exercise-card__meta">
      <span class="exercise-card__equipment">${equipment}</span>
      <span class="badge badge--difficulty">${difficulty}</span>
    </div>
    <div class="exercise-card__actions">
      <a href="/routine-builder.html?exercise=${encodeURIComponent(id)}" class="btn btn--secondary btn--small">Add to Routine</a>
      <button type="button" class="btn btn--secondary btn--small btn-edit-exercise" data-id="${id}">Edit</button>
      <button type="button" class="btn btn--danger btn--small btn-delete-exercise" data-id="${id}">Delete</button>
    </div>
  `;

  li.querySelector('.btn-edit-exercise').addEventListener('click', () =>
    openModal(id)
  );
  li.querySelector('.btn-delete-exercise').addEventListener('click', () =>
    deleteExercise(id)
  );
  return li;
}

function filterExercises() {
  const searchTerm = (getEl(selectors.search).value || '').trim().toLowerCase();
  const list = allExercises.filter((ex) => {
    const matchCategory = !currentCategory || ex.category === currentCategory;
    const matchSearch =
      !searchTerm ||
      ex.name.toLowerCase().includes(searchTerm) ||
      (ex.description && ex.description.toLowerCase().includes(searchTerm)) ||
      (ex.equipment && ex.equipment.toLowerCase().includes(searchTerm));
    return matchCategory && matchSearch;
  });
  return list;
}

function renderList() {
  const listEl = getEl(selectors.list);
  const emptyEl = getEl(selectors.empty);
  if (!listEl || !emptyEl) return;

  const filtered = filterExercises();
  listEl.innerHTML = '';
  filtered.forEach((ex) => listEl.appendChild(renderExerciseCard(ex)));

  if (filtered.length === 0) {
    emptyEl.classList.remove('hidden');
  } else {
    emptyEl.classList.add('hidden');
  }
}

async function loadExercises() {
  try {
    allExercises = await api.exercises.getAll();
    renderList();
  } catch (err) {
    console.error(err);
    getEl(selectors.list).innerHTML =
      '<li class="exercise-library__error">Failed to load exercises. Is the server running?</li>';
  }
}

function openModal(exerciseId = null) {
  editingId = exerciseId;
  const modal = getEl(selectors.modal);
  const title = modal.querySelector('.modal__title');
  const form = getEl(selectors.form);
  form.reset();
  if (exerciseId) {
    const ex = allExercises.find((e) => e._id === exerciseId);
    if (ex) {
      title.textContent = 'Edit Exercise';
      getEl(selectors.name).value = ex.name;
      getEl(selectors.category).value = ex.category;
      getEl(selectors.description).value = ex.description;
      getEl(selectors.equipment).value = ex.equipment || '';
      getEl(selectors.difficulty).value = ex.difficulty || 'beginner';
    }
  } else {
    title.textContent = 'Add Exercise';
    getEl(selectors.difficulty).value = 'beginner';
  }
  modal.showModal();
}

function closeModal() {
  getEl(selectors.modal).close();
  editingId = null;
}

async function saveExercise(e) {
  e.preventDefault();
  const name = getEl(selectors.name).value.trim();
  const category = getEl(selectors.category).value;
  const description = getEl(selectors.description).value.trim();
  const equipment = getEl(selectors.equipment).value.trim();
  const difficulty = getEl(selectors.difficulty).value;
  if (!name || !category || !description) return;

  try {
    if (editingId) {
      await api.exercises.update(editingId, {
        name,
        category,
        description,
        equipment,
        difficulty,
      });
    } else {
      await api.exercises.create({
        name,
        category,
        description,
        equipment,
        difficulty,
      });
    }
    closeModal();
    await loadExercises();
  } catch (err) {
    console.error(err);
    alert(err.body?.error || 'Failed to save exercise');
  }
}

async function deleteExercise(id) {
  if (!confirm('Delete this exercise?')) return;
  try {
    await api.exercises.delete(id);
    await loadExercises();
  } catch (err) {
    console.error(err);
    alert(err.body?.error || 'Failed to delete exercise');
  }
}

function bindFilters() {
  document.querySelectorAll('.btn--filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      document
        .querySelectorAll('.btn--filter')
        .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || '';
      renderList();
    });
  });
  getEl(selectors.search).addEventListener('input', renderList);
}

function bindModal() {
  getEl(selectors.btnAdd).addEventListener('click', () => openModal());
  getEl(selectors.btnCancel).addEventListener('click', closeModal);
  getEl(selectors.form).addEventListener('submit', saveExercise);
  getEl(selectors.modal).addEventListener('cancel', closeModal);
}

export function initExerciseLibrary() {
  bindFilters();
  bindModal();
  loadExercises();
}

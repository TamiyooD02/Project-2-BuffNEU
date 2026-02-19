import { initExerciseLibrary } from './modules/exerciseLibrary.js';
import { initRoutineBuilder } from './modules/routineBuilder.js';


const pathname = window.location.pathname;
if (pathname.includes('exercise-library')) {
  initExerciseLibrary();
} else if (pathname.includes('routine-builder')) {
  initRoutineBuilder();
}

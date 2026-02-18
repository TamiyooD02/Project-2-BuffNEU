/**
 * Seed data for the exercises collection.
 * Categories: arms, legs, chest, back, shoulders, core
 */
export const seedExercises = [
  // Arms
  {
    name: 'Bicep Curls',
    category: 'arms',
    description:
      'Hold a dumbbell in each hand with arms at sides. Curl weights up toward shoulders, then lower with control.',
    equipment: 'dumbbells',
    difficulty: 'beginner',
  },
  {
    name: 'Tricep Dips',
    category: 'arms',
    description:
      'Support yourself on a bench or parallel bars. Lower your body by bending elbows to 90 degrees, then push back up.',
    equipment: 'bodyweight',
    difficulty: 'beginner',
  },
  {
    name: 'Hammer Curls',
    category: 'arms',
    description:
      'Hold dumbbells at sides with neutral grip. Curl both arms up toward shoulders without rotating the wrists.',
    equipment: 'dumbbells',
    difficulty: 'beginner',
  },
  {
    name: 'Tricep Pushdown',
    category: 'arms',
    description:
      'Using a cable machine with a bar or rope attachment, push the weight down by extending your elbows. Keep elbows at your sides.',
    equipment: 'cable',
    difficulty: 'beginner',
  },
  {
    name: 'Preacher Curl',
    category: 'arms',
    description:
      'Rest upper arms on the preacher bench and curl the weight up, squeezing the biceps at the top.',
    equipment: 'barbell',
    difficulty: 'intermediate',
  },
  // Legs
  {
    name: 'Squats',
    category: 'legs',
    description:
      'Stand with feet shoulder-width apart. Lower your body as if sitting back into a chair, then drive back up.',
    equipment: 'bodyweight',
    difficulty: 'beginner',
  },
  {
    name: 'Lunges',
    category: 'legs',
    description:
      'Step forward and lower your back knee toward the floor. Push through the front heel to return to standing.',
    equipment: 'bodyweight',
    difficulty: 'beginner',
  },
  {
    name: 'Leg Press',
    category: 'legs',
    description:
      'Seated on the machine, place feet on the platform. Push the platform away by extending your legs, then lower with control.',
    equipment: 'machine',
    difficulty: 'beginner',
  },
  {
    name: 'Romanian Deadlift',
    category: 'legs',
    description:
      'Hold a barbell or dumbbells. Hinge at the hips, lowering the weight along your legs. Keep a slight bend in the knees.',
    equipment: 'barbell',
    difficulty: 'intermediate',
  },
  {
    name: 'Calf Raises',
    category: 'legs',
    description:
      'Stand on the edge of a step or platform. Rise onto your toes, then lower your heels below the step for a stretch.',
    equipment: 'bodyweight',
    difficulty: 'beginner',
  },
  // Chest
  {
    name: 'Push-ups',
    category: 'chest',
    description:
      'Start in a plank. Lower your chest toward the floor by bending your elbows, then push back up.',
    equipment: 'bodyweight',
    difficulty: 'beginner',
  },
  {
    name: 'Bench Press',
    category: 'chest',
    description:
      'Lie on a bench and grip the bar. Lower the bar to your mid-chest, then press it up until arms are extended.',
    equipment: 'barbell',
    difficulty: 'intermediate',
  },
  {
    name: 'Chest Fly',
    category: 'chest',
    description:
      'Lie on a bench with dumbbells above your chest. Open arms out to the sides in an arc, then squeeze back together.',
    equipment: 'dumbbells',
    difficulty: 'beginner',
  },
  {
    name: 'Incline Dumbbell Press',
    category: 'chest',
    description:
      'On an incline bench, press dumbbells up from shoulder height. Focus on upper chest engagement.',
    equipment: 'dumbbells',
    difficulty: 'intermediate',
  },
  {
    name: 'Cable Crossover',
    category: 'chest',
    description:
      'Stand between two cable stations. Bring the handles together in front of your chest in a controlled motion.',
    equipment: 'cable',
    difficulty: 'intermediate',
  },
  // Back
  {
    name: 'Pull-ups',
    category: 'back',
    description:
      'Hang from a bar with hands shoulder-width apart. Pull your body up until your chin is over the bar, then lower.',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
  },
  {
    name: 'Barbell Rows',
    category: 'back',
    description:
      'Hinge at the hips and pull the bar toward your lower chest. Squeeze your shoulder blades together.',
    equipment: 'barbell',
    difficulty: 'intermediate',
  },
  {
    name: 'Lat Pulldown',
    category: 'back',
    description:
      'Seated at a cable machine, pull the bar down to your upper chest. Control the weight back up.',
    equipment: 'cable',
    difficulty: 'beginner',
  },
  {
    name: 'Deadlift',
    category: 'back',
    description:
      'Stand with feet hip-width apart. Grip the bar and drive through your legs and hips to stand up with the bar.',
    equipment: 'barbell',
    difficulty: 'intermediate',
  },
  {
    name: 'Face Pulls',
    category: 'back',
    description:
      'Using a rope attachment on a cable, pull the rope toward your face, separating your hands and squeezing the rear delts.',
    equipment: 'cable',
    difficulty: 'beginner',
  },
  // Shoulders
  {
    name: 'Shoulder Press',
    category: 'shoulders',
    description:
      'Press dumbbells or a barbell from shoulder height overhead. Lower with control to shoulder level.',
    equipment: 'dumbbells',
    difficulty: 'beginner',
  },
  {
    name: 'Lateral Raises',
    category: 'shoulders',
    description:
      'With dumbbells at your sides, raise your arms out to the sides until parallel to the floor. Lower slowly.',
    equipment: 'dumbbells',
    difficulty: 'beginner',
  },
  {
    name: 'Front Raises',
    category: 'shoulders',
    description:
      'Hold dumbbells in front of your thighs. Raise one or both arms forward to shoulder height.',
    equipment: 'dumbbells',
    difficulty: 'beginner',
  },
  {
    name: 'Arnold Press',
    category: 'shoulders',
    description:
      'Start with palms facing you at shoulder height. Press up while rotating palms to face forward at the top.',
    equipment: 'dumbbells',
    difficulty: 'intermediate',
  },
  {
    name: 'Reverse Fly',
    category: 'shoulders',
    description:
      'Bend at the hips and raise dumbbells out to the sides, squeezing the rear delts.',
    equipment: 'dumbbells',
    difficulty: 'beginner',
  },
  // Core
  {
    name: 'Planks',
    category: 'core',
    description:
      'Hold a push-up position with arms straight or on forearms. Keep your body in a straight line from head to heels.',
    equipment: 'bodyweight',
    difficulty: 'beginner',
  },
  {
    name: 'Crunches',
    category: 'core',
    description:
      'Lie on your back with knees bent. Curl your upper body toward your knees, engaging your abs.',
    equipment: 'bodyweight',
    difficulty: 'beginner',
  },
  {
    name: 'Russian Twists',
    category: 'core',
    description:
      'Seated with feet lifted, twist your torso side to side, optionally holding a weight at your chest.',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
  },
  {
    name: 'Leg Raises',
    category: 'core',
    description:
      'Lie on your back. Keeping legs straight or slightly bent, raise them toward the ceiling, then lower with control.',
    equipment: 'bodyweight',
    difficulty: 'beginner',
  },
  {
    name: 'Bicycle Crunches',
    category: 'core',
    description:
      'Lie on your back. Bring opposite elbow to opposite knee in a pedaling motion while keeping shoulders off the ground.',
    equipment: 'bodyweight',
    difficulty: 'beginner',
  },
];

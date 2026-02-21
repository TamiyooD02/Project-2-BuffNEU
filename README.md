# BuffNEU - Workout Tracker

## Authors
Tamiyoo Desir - [desir.t@northeastern.edu]
James Khadan - [khadan.j@northeastern.edu]

## Class Link
CS 5610 Web Development - Spring 2026
(https://northeastern.instructure.com/courses/245751)

## Project Objective
BuffNEU is a web application designed to help users track and organize their fitness journey. Users can log individual workout sessions by recording the date, exercises performed, sets, and reps completed, then review their workout history over time to monitor progress. The application also features an exercise library where users can browse exercises by category and use them to build custom workout routines. 

## Screenshots

### Home Page
![Home Page](<photos/Screenshot (266).png>)
*Landing page with navigation and instructions*

### Workout Log
![Workout Log](<photos/Screenshot (269).png>)
*Log and view workout history*

### Exercise Library
![Exercise Library](<photos/Screenshot (267).png>)
*Browse exercises*

### Routine Builder
![Create Routine](<photos/Screenshot (268).png>)
*Create routines*

## Instructions to Build

### Prerequisites
- Node.js (v18 or higher)
- Docker Desktop (for MongoDB)
- Git

### Setup Steps

1. **Clone the repository**
```bash
   git clone [your-repository-url]
   cd buffneu
```

2. **Install dependencies**
```bash
   npm install
```

3. **Start MongoDB with Docker**
```bash
   docker run -d -p 27017:27017 --name mongodb-buffneu mongo
```

4. **Create `.env` file**
   
   Create a file named `.env` in the root directory with:
```
   MONGODB_URI=mongodb://localhost:27017
   PORT=3000
```

5. **Seed the database**
```bash
   npm run seed
```
   This will populate the database with 1000+ workout sessions and exercises.

6. **Start the server**
```bash
   npm start
```

7. **Open in browser**
   
   Navigate to `http://localhost:3000`

## Technologies Used

- **Backend:** Node.js, Express
- **Database:** MongoDB (via Docker)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6)
- **Code Quality:** ESLint, Prettier

## Features

- **Workout Logging:** Add, view, edit, and delete workout sessions with date, exercise, sets, and reps
- **Exercise Library:** Browse pre-populated exercises filtered by category (Upper Body, Lower Body, Core, Cardio)
- **Workout Routines:** Create and manage custom workout routines using exercises from the library
- **Client-Side Rendering:** Dynamic content updates without page refreshes

## Project Structure
```
PROJECT2-NEUBUFF/
├── node_modules/
├── photos/
├── public/
│   ├── css/
│   │   ├── modules/
│   │   │   ├── exercise-library.css
│   │   │   ├── routine-builder.css
│   │   │   ├── shared.css
│   │   │   └── workout-log.css
│   │   └── main.css
│   │
│   ├── js/
│   │   ├── modules/
│   │   │   ├── api.js
│   │   │   ├── exerciseLibrary.js
│   │   │   ├── routineBuilder.js
│   │   │   └── workout-log.js
│   │   └── main.js
│   │
│   ├── exercise-library.html
│   ├── index.html
│   ├── routine-builder.html
│   └── workout-log.html
│
├── server/
│   ├── config/
│   │   └── database.js
│   │
│   ├── data/
│   │   ├── seedExercises.js
│   │   └── seedWorkouts.js
│   │
│   ├── routes/
│   │   ├── exercises.js
│   │   ├── routines.js
│   │   └── workouts.js
│   │
│   ├── utils/
│   │   └── seedDatabase.js
│   │
│   └── index.js
│
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── Design Document.md
├── LICENSE (MIT)
├── package.json
├── package-lock.json
└── README.md
```

## Development

### Running Locally
```bash
npm start
```

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

## Video Demo

[Link to your demo video on YouTube/Google Drive]

## License

MIT License - see LICENSE file for details

## AI Acknowledgments/Prompts
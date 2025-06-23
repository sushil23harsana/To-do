# App Workflow Documentation

## 1. Frontend (React)
- **Location:** `frontend/`
- **Stack:** React, Material-UI (MUI), Custom Theme

### Workflow:
1. **App Initialization**
   - The app starts from `src/index.js`, which renders the main `App` component.
   - The custom theme from `src/theme.js` is applied using MUI's ThemeProvider.

2. **User Interface**
   - **Sidebar Navigation:** `Sidebar.js` and `DashboardSidebar.js` provide navigation between pages (e.g., Dashboard, Analytics).
   - **Main Pages:**
     - `DashboardPage.js`: Displays the main to-do dashboard.
     - `AnalyticsPage.js`: Shows analytics and statistics about tasks.
   - **To-Do Management:**
     - `TodoItem.js`: Represents individual to-do items.
     - Users can add, edit, complete, or delete tasks.
   - **Motivation & Streaks:**
     - `MotivationalQuote.js`: Displays motivational quotes.
     - `StreakTracker.js`: Tracks and displays user streaks for task completion.

3. **API Communication**
   - The frontend communicates with the backend (Django) via HTTP requests (likely using `fetch` or `axios`).
   - CRUD operations on to-dos are sent to the backend endpoints.

---

## 2. Backend (Django)
- **Location:** `backend/`
- **Stack:** Django, Django REST Framework

### Workflow:
1. **App Initialization**
   - Django project is started via `manage.py`.
   - Settings are configured in `backend/settings.py`.

2. **API Endpoints**
   - URLs are defined in `backend/urls.py` and `todos/urls.py`.
   - Views in `todos/views.py` handle requests for to-do operations (list, create, update, delete).
   - Serializers in `todos/serializers.py` convert model instances to JSON and validate incoming data.

3. **Database**
   - Models in `todos/models.py` define the structure of to-do items.
   - Migrations are managed in `todos/migrations/`.

4. **Admin & Testing**
   - Admin interface is set up in `todos/admin.py`.
   - Tests are written in `todos/tests.py`.

---

## 3. Deployment & Environment
- **Dockerized Setup:**
  - `docker-compose.yml` orchestrates both frontend and backend containers.
  - Each has its own `Dockerfile` for building images.

---

## Typical User Flow
1. **User opens the app in the browser.**
2. **Frontend loads and displays the dashboard.**
3. **User interacts with the UI to manage to-dos.**
4. **Frontend sends API requests to the backend.**
5. **Backend processes requests, interacts with the database, and returns responses.**
6. **Frontend updates the UI based on backend responses.**
7. **Analytics and streaks are updated in real-time.**

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

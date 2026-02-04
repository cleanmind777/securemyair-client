## SecureMyAir Client Dashboard

React client for the **SecureMyAir** indoor airquality monitoring and control system.  
This app renders a TVstyle dashboard showing live HVAC status, AQI letter grades, and detailed sensor readings for humidity, CO?, VOC, particulate matter, and more. It is built with **Create React App**, **React Router**, and **MUI**.

### Key Features

- **Realtime dashboard**: Polls backend endpoints (e.g. `dashboard.php`, `advertisment.php`) to display live airquality data.
- **AQI letter grading**: Large animated AF grade with contextual color and messaging (Good / Fair / Unhealthy / Critical).
- **Sensor cards**: Humidity, CO?, VOC, PM2.5, PM10 tiles with levelbased colors and animations.
- **Machine & control views**: Separate pages for machine list, dashboard, and time control.
- **Protected routes**: `Dashboard`, `Machines`, and `Control` are wrapped by `Protected` and require authentication.
- **TV / kiosk ready UI**: Fullscreen layout optimized for wall displays with autohiding controls.

### Tech Stack

- **React 18** with **Create React App**
- **React Router v6** (`HashRouter`)
- **MUI v5** (`@mui/material`, `@mui/icons-material`, `@emotion/*`)
- **Axios** for HTTP requests

## Getting Started

### Prerequisites

- **Node.js** 16+  
- **npm** (comes with Node)

### Installation

```bash
npm install
```

### Environment variables (`.env`)

- Create a `.env` file in the project root for local configuration.
- **Do not commit `.env`** ? it is listed in `.gitignore`. Use `.env.example` as a template:

  ```bash
  cp .env.example .env
  ```

- In Create React App, only variables prefixed with `REACT_APP_` are embedded in the build (e.g. `REACT_APP_API_URL`). Edit `.env` and restart `npm start` after changes.
- For production, configure environment variables in your hosting platform (e.g. Netlify, Vercel, or your server) instead of committing secrets.

### `.gitignore`

The repo uses a root `.gitignore` that excludes:

- `node_modules/`, `/build`, and test output
- **`.env` and env variants** (`.env.local`, `.env.production.local`, etc.) so secrets stay out of version control
- Logs, editor/IDE folders, and common misc files

Keep `.env` local and use `.env.example` to document required or optional variables for other developers.

### Running the app (development)

```bash
npm start
```

- Runs on `http://localhost:3000/` by default.
- Uses `HashRouter`, so routes are served under `/#/`.

### Building for production

```bash
npm run build
```

- Outputs an optimized production build into the `build` folder.
- Can be deployed to any static host (S3, Nginx, Apache, Netlify, etc.).

## Project Structure (high level)

- `public/`  Static assets, base `index.html`, legacy JS animation scripts (`js/`).
- `src/`
  - `App.js`  App shell, routing, MUI theme setup.
  - `pages/`  Route pages: `Login`, `Machines`, `Dashboard`, `Control`.
  - `components/`  Reusable UI components (e.g. `AlternatingDisplay`, dialogs, mini machine views).
  - `context/Protected.jsx`  Route guard for authenticated views.
  - `assests/`  Logo and AQI grade images (A, B, C, D, F, etc.).

## Environment & Backend Integration

- The client expects a backend that exposes:
  - `dashboard.php`  returns current machine, AQI, sensor data, and customer info.
  - `advertisment.php`  returns ad image path and display timing.
- Auth tokens and identifiers are read from `localStorage` under keys like:
  - `client_api`, `client_id`, `client_authToken`, `client_machine`, `client_date`, `client_user`.
- If the backend returns **"Expired token"**, the client clears storage and redirects to `/login`.

## Available npm Scripts

- **`npm start`**: Start development server.
- **`npm test`**: Run tests in watch mode.
- **`npm run build`**: Create production build.
- **`npm run eject`**: Eject CRA configuration (irreversible; generally not needed).

## License

This project is proprietary and intended for use with the SecureMyAir system unless otherwise agreed.
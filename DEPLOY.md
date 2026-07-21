# DEPLOYMENT & ENVIRONMENT SETUP

## Prerequisites
*   Node.js (v18 or higher recommended)
*   npm (v9 or higher recommended)
*   A modern web browser supporting the Web Audio API and `getUserMedia` (Chrome, Firefox, Safari, Edge).

## Local Development
1.  **Install Dependencies:**
    Run `npm install` in the root directory to fetch all React and Vite dependencies.
2.  **Start Dev Server:**
    Run `npm run dev`. This will launch the Vite development server, usually on `http://localhost:5173`.
3.  **Permissions:** When accessing the "Voice Studio" tab, ensure the browser has granted microphone permissions to `localhost`.

## Production Build
1.  **Compile & Bundle:**
    Run `npm run build`. This executes TypeScript checking (`tsc -b`) followed by the Vite production build.
2.  **Output:**
    The static files will be generated in the `dist/` directory.
3.  **Deployment:**
    The contents of the `dist/` directory can be deployed to any static web host (e.g., Vercel, Netlify, GitHub Pages, AWS S3). There is no active backend server required.

## Artifact Management
Do not track the `dist/` directory or `node_modules/` in Git. They are ignored via `.gitignore`.

# Deployment on Netlify

This project contains a backend built with **Node.js/Express** and a frontend built with **React** using Vite. The frontend can be deployed as a static site on [Netlify](https://www.netlify.com/).

## Netlify configuration

A `netlify.toml` file at the repository root instructs Netlify to build the frontend from the `frontend` directory using `npm run build` and publish the `dist` folder. The build environment uses Node 18. For single page application routing, a `_redirects` file is provided in `frontend/public` so that all routes serve `index.html`.

## Deploy steps

1. Create a new site on Netlify and link it to this repository.
2. Ensure your environment variables (such as `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID`) are set in your Netlify site settings. The backend also requires `GOOGLE_CLIENT_ID`, `CLIENT_URL` and optionally `ALLOWED_ORIGINS` for Google login, email verification and CORS. If set, `ALLOWED_ORIGINS` should be a comma-separated list of allowed domains.
3. Trigger a deploy &mdash; Netlify will run `npm install` and `npm run build` inside the `frontend` folder and publish the generated `dist` directory.

The backend should be deployed separately (for example on Render or another provider) and the frontend's `VITE_API_URL` should point to the live backend URL.

## Deploying the frontend on Vercel

The project can also be deployed on [Vercel](https://vercel.com/) as a static site. When creating the Vercel project, set the **Root Directory** to `frontend` and use the default build command (`npm run build`). The Vite build outputs to the `dist` directory, so configure the **Output Directory** as `dist` in the Vercel settings. A `vercel.json` file is included to provide the same configuration and to route all paths to `index.html` for client-side routing.

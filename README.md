# Deployment on Netlify

This project contains a backend built with **Node.js/Express** and a frontend built with **React** using Vite. The frontend can be deployed as a static site on [Netlify](https://www.netlify.com/).

## Netlify configuration

A `netlify.toml` file at the repository root instructs Netlify to build the frontend from the `frontend` directory using `npm run build` and publish the `dist` folder. The build environment uses Node 18. For single page application routing, a `_redirects` file is provided in `frontend/public` so that all routes serve `index.html`.

## Deploy steps

1. Create a new site on Netlify and link it to this repository.
2. Ensure your environment variables (such as `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID`) are set in your Netlify site settings. The backend also requires `GOOGLE_CLIENT_ID` and `CLIENT_URL` for Google login and email verification.
3. Trigger a deploy &mdash; Netlify will run `npm install` and `npm run build` inside the `frontend` folder and publish the generated `dist` directory.

The backend should be deployed separately (for example on Render or another provider) and the frontend's `VITE_API_URL` should point to the live backend URL.

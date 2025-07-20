# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Environment setup

Create a `.env` file in this folder based on `.env.example`. Set `VITE_GOOGLE_CLIENT_ID` to your Google OAuth Client ID.
Make sure that the client ID allows your deployment domain (e.g. `https://app-patin-ekcu-dvow4bzs0-gastonmanzurs-projects.vercel.app/`) under "Authorized JavaScript origins" in the Google Cloud console.

If `VITE_GOOGLE_CLIENT_ID` is not set when the app is built, the Google login button will be disabled and a warning will appear in the browser console.

If you see a 400 `origin_mismatch` error when signing in with Google, confirm that your deployment URL is listed under "Authorized JavaScript origins" for the OAuth client in Google Cloud Console.

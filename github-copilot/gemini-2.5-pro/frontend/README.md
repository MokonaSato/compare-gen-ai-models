# Vocabulary App Frontend

This is the frontend part of the Vocabulary App project, built using React, TypeScript, and Vite.

## Getting Started

To get started with the frontend application, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd vocabulary-app/frontend
   ```

2. **Install dependencies**:
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run the development server**:
   Start the Vite development server with:
   ```bash
   npm run dev
   ```
   This will start the application on `http://localhost:3000` (or another port if specified).

## Project Structure

The frontend project is structured as follows:

- `public/`: Contains static files.
- `src/`: Contains the source code for the application.
  - `App.tsx`: Main application component.
  - `main.tsx`: Entry point for the React application.
  - `components/`: Contains reusable components.
  - `pages/`: Contains page components.
  - `types/`: Contains TypeScript type definitions.
- `index.html`: Main HTML template.
- `package.json`: Lists dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.
- `vite.config.ts`: Vite configuration.

## Building for Production

To build the application for production, run:
```bash
npm run build
```
This will create an optimized build in the `dist` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
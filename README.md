# EI_Academy_dashboard
Educational Intelligence Academy dashboard

## Project Overview
This is the dashboard of the Eiq system, built using React.js. It interacts with the backend through API calls and dynamically renders data.

## Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (Recommended version: 16+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation
1. Clone the repository:
   git clone [https://github.com/daniaaltarifi/EI_Academy_dashboard.git]
   
2. Install dependencies:
   npm install
   

## Running the Project
To start the development server, run:

npm start

The app will be available at `http://localhost:3000/`.

## Building for Production
To build the production-ready files, run:

npm run build

The output files will be available in the `build/` directory.

## Folder Structure
```
Eiq-dashboard/
│-- public/        # Static assets
│-- src/
│   │-- components/  # Reusable UI components
│   │-- pages/       # Page-level components
│   │-- Css/         # Global styles
│   │-- App.js       # Main app component
│   │-- index.js     # Entry point
│-- package.json    # Project dependencies
│-- README.md       # Documentation
```

## API Integration
- API calls are managed using `axios`.
- The base URL is set in `App.js` and used across the app.

## Modifications & Customization
- UI reusable components are in `src/components/`.
- The pages are in `src/Pages/`.

## Troubleshooting
- If dependencies are missing or errors occur, try running:

  npm install

- If the app does not start, check `App.js` and ensure the API URL is correct.

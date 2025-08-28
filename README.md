# R0TK Journal - Trading Journal Application

A comprehensive trading journal application built with React, TypeScript, and Tailwind CSS. Track your trading performance, analyze psychology patterns, and maintain detailed trade records.

## Features

### 📊 Dashboard
- Real-time P&L tracking
- Win rate and risk/reward analytics
- Monthly performance charts
- Recent trades overview

### 📝 Trade Entry
- Comprehensive trade logging
- Price levels and risk management
- Psychology and emotion tracking
- Screenshot uploads
- Strategy tagging

### 📈 Analytics
- **Performance Analysis**: Session breakdowns, R:R distributions, mistake tracking
- **Psychology Insights**: Emotional pattern analysis, confidence correlation
- **Chakra Alignment**: Unique spiritual/consciousness approach to trading psychology

### 📚 Trade Journal
- Complete trade history
- Screenshot gallery
- Notes and analysis
- Pattern recognition

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project files**
   ```bash
   # If you have the files locally, navigate to the project directory
   cd r0tk-journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install required packages**
   The application uses several key libraries:
   ```bash
   npm install react react-dom @types/react @types/react-dom
   npm install lucide-react recharts date-fns
   npm install tailwindcss@next @tailwindcss/typography
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
**Add the development required dependencies**
   ```Add the dev script
   "scripts": {
      "start": "react-scripts start",
      "dev": "react-scripts start",
      "test": "echo \"Error: no test specified\" && exit 1"
   }

   "scripts": {
      "dev": "next dev",
      "test": "echo \"Error: no test specified\" && exit 1"
   }

   "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
   }

  "scripts": {
    "start": "react-scripts start",
    "dev": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },


   ```

*** APP SETUP ***
"npm install react react-dom"
"npm install --save-dev vite @vitejs/plugin-react"
"npm install --save-dev react-scripts"
"npm install -g npm"
"npm uninstall -g react-scripts"

"npm -i y"

5. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Build for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
r0tk-journal/
├── App.tsx                 # Main application component
├── components/
│   ├── Dashboard.tsx       # Main dashboard with KPIs and charts
│   ├── TradeEntry.tsx      # Trade logging form
│   ├── Analytics.tsx       # Performance and psychology analytics
│   ├── Navigation.tsx      # Sidebar navigation
│   └── ui/                 # Reusable UI components (shadcn/ui)
├── styles/
│   └── globals.css         # Global styles and theme variables
└── README.md              # This file
```

## Key Technologies

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library
- **Recharts**: Chart and visualization library
- **Lucide React**: Icon library
- **date-fns**: Date utility library

## Features Overview

### Navigation
- **Dashboard**: Overview of trading performance
- **New Trade**: Add new trade entries
- **Trade Journal**: View and manage trade history
- **Analytics**: Deep performance analysis
- **Settings**: Customize application preferences

### Unique Features

1. **Psychology Tracking**: Emotional state and confidence level logging
2. **Chakra Alignment**: Spiritual approach to trading psychology (optional feature)
3. **Session Analysis**: Performance breakdown by trading sessions (Asian, London, NY)
4. **Risk Management**: Automatic R:R calculation and tracking
5. **Visual Documentation**: Screenshot upload and management

## Demo Data

The application comes with mock trading data for demonstration purposes:
- Sample trades with various outcomes
- Mock performance metrics
- Example charts and analytics
- Psychology and emotion data

## Customization

### Themes
The application supports light/dark themes and uses CSS custom properties for easy customization.

### Colors
- Primary colors: Blue, Green, Purple, Orange
- Psychology section uses chakra colors (optional)
- Professional color scheme for general trading features

### Components
All UI components are modular and can be easily customized or replaced.

## Contributing

This is a demo application. For production use, consider:
- Adding proper authentication
- Implementing real database connectivity
- Adding broker API integrations
- Enhancing security measures
- Adding data validation and error handling

## License

This project is for demonstration purposes. Please ensure compliance with relevant financial software regulations in your jurisdiction.

## Support

For questions or issues, please refer to the component documentation or React/TypeScript official guides.

---

**R0TK Journal** - Professional Trading Analytics Platform








//////////////////////////////////////////////////////////////////////////////////////////////////







# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

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

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

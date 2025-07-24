** Project Structure

📦src
 ┣ 📁assets/                # Static assets like logo, icons, etc.
 ┣ 📁components/            # Reusable UI components
 ┃ ┣ 📁common/              # Buttons, Inputs, Modals, etc.
 ┃ ┣ 📁auth/                # LoginForm, SignupForm, OTPForm
 ┃ ┗ 📁video/               # VideoControls, ChatPanel, ParticipantsList, etc.
 ┣ 📁pages/                 # Full page-level components
 ┃ ┣ 📄Login.jsx
 ┃ ┣ 📄Signup.jsx
 ┃ ┣ 📄OTPVerification.jsx
 ┃ ┣ 📄Dashboard.jsx
 ┃ ┗ 📄VideoMeet.jsx
 ┣ 📁routes/                # React Router setup and ProtectedRoute
 ┃ ┗ 📄AppRoutes.jsx
 ┣ 📁services/              # API calls (auth, meeting, etc.)
 ┃ ┣ 📄authService.js
 ┃ ┣ 📄meetingService.js
 ┃ ┗ 📄socketService.js
 ┣ 📁context/               # AuthContext, SocketContext, etc.
 ┃ ┣ 📄AuthContext.jsx
 ┃ ┗ 📄SocketProvider.jsx
 ┣ 📁hooks/                 # Custom hooks like useAuth, useSocket, etc.
 ┣ 📁utils/                 # Helper functions (validators, token utils)
 ┣ 📄App.jsx                # Root app component
 ┣ 📄main.jsx               # Vite entry point
 ┣ 📄index.css              # Tailwind & global styles
┣ 📄tailwind.config.js      # TailwindCSS configuration
┣ 📄postcss.config.js       # PostCSS configuration
┣ 📄vite.config.js          # Vite config
┣ 📄package.json            # NPM dependencies and scripts
┗ 📄.gitignore              # Git ignore rules

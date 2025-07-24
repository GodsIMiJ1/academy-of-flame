import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadCriticalImages } from './lib/image-optimization'

// Preload sacred NODE emblem for optimal performance
preloadCriticalImages();

createRoot(document.getElementById("root")!).render(<App />);

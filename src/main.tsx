import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/fonts.css";
import "./styles/index.css";
import "./i18n/config"; // Import i18n configuration

console.log('Main.tsx loaded');

const rootElement = document.getElementById("root");
if (!rootElement) {
    console.error('Root element not found');
} else {
    console.log('Root element found, mounting React app');
    createRoot(rootElement).render(<App />);
}
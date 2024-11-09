import { App } from './src/App.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    const app = new App(container);
    app.init();
});

import App from './app/app';
import './styles/style.css';

(() => {
    const canvas = document.querySelector('canvas');
    const panel = document.querySelector('.panel');
    const app = new App(document, document.defaultView, canvas, panel);
    app.run();
})();


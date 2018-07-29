import Vector2D from "./math/vector";

export default class UI {
    constructor(view, canvas, panel, renderer, physics) {
        this.view = view;
        this.canvas = canvas;
        this.panel = panel;
        this.simulationStarDate = this.panel.querySelector('.simulationStarDate');
        this.simulationSpeedSelector = this.panel.querySelector('.simulationSpeedSelector');
        this.simulationSpeedValue = this.panel.querySelector('.simulationSpeedValue');
        this.renderer = renderer;
        this.physics = physics;
        
        this.lastMousePosition = new Vector2D();
        this.isRightMouseDown = false;

        this.setupCallbacks();

        this.simulationSpeedSelector.value = 1.0;
        this.setSimulationSpeed();
    }

    
    setupCallbacks() {
        this.view.addEventListener('resize', () => this.resize());
        this.view.addEventListener('contextmenu', (event) => event.preventDefault());

        this.canvas.addEventListener('wheel', (event) => this.changeScale(event));
        this.canvas.addEventListener('mousedown', (event) => this.mouseDown(event));
        this.canvas.addEventListener('mousemove', (event) => this.mouseMove(event));
        this.canvas.addEventListener('mouseup', (event) => this.mouseUp(event));
        this.canvas.addEventListener('mouseout', () => this.mouseOut());

        this.simulationSpeedSelector.addEventListener('input', () => this.setSimulationSpeed());
    }

    resize() {
        this.renderer.onResize(this.view.innerWidth, this.view.innerHeight)
    }

    changeScale(event) {
        this.renderer.onChangeScale(-Math.abs(event.deltaY) / event.deltaY, this.lastMousePosition)
    }

    mouseDown(event) {
        switch(event.button) {
        case 2:
            this.isRightMouseDown = true;
            break;
        default:
        }
    }

    mouseMove(event) {
        const movement = new Vector2D(event.movementX, event.movementY);
        this.lastMousePosition = new Vector2D(event.clientX, event.clientY);

        if(this.isRightMouseDown) {
            this.renderer.onMove(movement);
        }
    }

    mouseUp(event) {
        switch(event.button) {
        case 2:
            this.isRightMouseDown = false;
            break;
        default:
        }
    }

    mouseOut() {
        this.isRightMouseDown = false;
    }

    setSimulationSpeed() {
        const simulationSpeedSelectorValue = this.simulationSpeedSelector.value;
        if(simulationSpeedSelectorValue != 0) {
            const direction = Math.abs(simulationSpeedSelectorValue) / simulationSpeedSelectorValue;
            const simulationSpeed = direction * Math.pow(10, Math.abs(simulationSpeedSelectorValue - 1 * direction));
            this.physics.onSimulationSpeedChanged(simulationSpeed);
            this.simulationSpeedValue.textContent = `Current simulation speed: ${direction + " * 10^" + Math.abs(this.simulationSpeedSelector.value - 1 * direction)}`;
        }
        else {
            this.physics.onSimulationSpeedChanged(0);
            this.simulationSpeedValue.textContent = `Current simulation speed: Paused`;
        }
    }

    update() {
        const currentDate = new Date(this.physics.totalElapsedTime);
        const options = { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric' 
        };
        this.simulationStarDate.textContent = `Current date: ${currentDate.toLocaleDateString("en-US", options)}`;
    }
}
export default class Physics {
    constructor() {
        this.totalElapsedTime = Math.round(new Date().getTime());
        
        this.simulationSpeed = 1;
        this.G = 6.67408e-11;

        this.updatables = []
    }

    addUpdateable(updatable) {
        this.updatables.push(updatable);
    }

    update(timeStep) {
        timeStep *= this.simulationSpeed;
        this.totalElapsedTime += timeStep;

        const properties = {
            totalElapsedTime: this.totalElapsedTime,
            simulationSpeed: this.simulationSpeed,
            G: this.G
        }

        this.updatables.forEach((updatable) => {
            updatable.onUpdate(timeStep, properties);
        });
    } 

    onSimulationSpeedChanged(simulationSpeed) {
        this.simulationSpeed = simulationSpeed;
    }
}
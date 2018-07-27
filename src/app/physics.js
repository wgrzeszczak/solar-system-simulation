export default class Physics {
    constructor() {
        this.totalElapsedTime = Math.round(new Date().getTime() / 1000);
        this.simulationSpeed = 1;
        this.updatables = []
    }

    addUpdateable(updatable) {
        this.updatables.push(updatable);
    }

    update(timeStep) {
        timeStep *= this.simulationSpeed;
        this.totalElapsedTime +=  timeStep;
        this.updatables.forEach((updatable) => {
            updatable.onUpdate(timeStep, this.totalElapsedTime);
        });
    } 

    onSimulationSpeedChanged(simulationSpeed) {
        this.simulationSpeed = simulationSpeed;
    }
}
import Renderer from './renderer'
import Physics from './physics';

import Vector2D from './math/vector';

import StarBuilder from './builders/starBuilder';
import OrbitingBodyBuilder from './builders/orbitingBodyBuilder';

import Background from './objects/background';
import BackgroundImage from '../images/backgrounds/default.jpg';
import SunImage from '../images/planets/sun.png';
import MercuryImage from '../images/planets/mercury.png';
import VenusImage from '../images/planets/venus.png';
import EarthImage from '../images/planets/earth.png';
import MoonImage from '../images/planets/moon.png';
import MarsImage from '../images/planets/mars.png';
import Controller from './controller';

export default class App {
    constructor(document, view, canvas, panel) {
        this.document = document;
        this.view = view;
        this.canvas = canvas;

        this.renderer = new Renderer(this.canvas);
        this.physics = new Physics();
        this.controller = new Controller(this.view, this.canvas, panel, this.renderer, this.physics);

        this.lastUpdate = Date.now();

        this.objects = {};
        this.initialize();
    }

    initialize() {
        this.renderer.onResize(this.view.innerWidth, this.view.innerHeight);
        this.renderer.onMove(new Vector2D(this.view.innerWidth / 2, this.view.innerHeight / 2));

        this.objects.background = new Background(BackgroundImage);
        this.renderer.addRenderable(this.objects.background);

        this.objects.sun = new StarBuilder(this.document)
            .withLabel("Sun")
            .withImage(SunImage)
            .withMass(1.989e30)
            .withRadius(695700)
            .withAngularVelocity(1)
            .build();
        this.physics.addUpdateable(this.objects.sun);
        this.renderer.addRenderable(this.objects.sun);

        this.objects.mercury = new OrbitingBodyBuilder(this.document)
        .withLabel("Mercury")
        .withImage(MercuryImage)
        .withMass(3.3022e23)
        .withRadius(2439.7)
        .withAngularVelocity(1)
        .withParent(this.objects.sun)
        .withOrbitalParameters({
            semiMajorAxis: 57909050,
            eccentricity: 0.205630,
            meanAnomaly: 174.796,
            period: 87.969 * 24 * 60 * 60
        })
        .build();
        this.physics.addUpdateable(this.objects.mercury);
        this.renderer.addRenderable(this.objects.mercury);

        this.objects.venus = new OrbitingBodyBuilder(this.document)
        .withLabel("Venus")
        .withImage(VenusImage)
        .withMass(4.8685e24)
        .withRadius(6051.8)
        .withAngularVelocity(1)
        .withParent(this.objects.sun)
        .withOrbitalParameters({
            semiMajorAxis: 108208000,
            eccentricity: 0.006772,
            meanAnomaly: 50.115,
            period: 224.701 * 24 * 60 * 60
        })
        .build();
        this.physics.addUpdateable(this.objects.venus);
        this.renderer.addRenderable(this.objects.venus);


        this.objects.earth = new OrbitingBodyBuilder(this.document)
        .withLabel("Earth")
        .withImage(EarthImage)
        .withMass(5.9736e24)
        .withRadius(6000)
        .withAngularVelocity(1)
        .withParent(this.objects.sun)
        .withOrbitalParameters({
            semiMajorAxis: 149598023,
            eccentricity: 0.0167086,
            meanAnomaly: 358.617,
            period: 365.256363004 * 24 * 60 * 60
        })
        .build();
        this.physics.addUpdateable(this.objects.earth);
        this.renderer.addRenderable(this.objects.earth);

        this.objects.moon = new OrbitingBodyBuilder(this.document)
        .withLabel("Moon")
        .withImage(MoonImage)
        .withMass(7.349e22)
        .withRadius(1700)
        .withAngularVelocity(1)
        .withParent(this.objects.earth)
        .withOrbitalParameters({
            semiMajorAxis: 384399,
            eccentricity: 0.0549,
            meanAnomaly: 40.7,
            period: 60 * 60 * 24
        })
        .build();
        this.physics.addUpdateable(this.objects.moon);
        this.renderer.addRenderable(this.objects.moon);

        this.objects.earth = new OrbitingBodyBuilder(this.document)
        .withLabel("Mars")
        .withImage(MarsImage)
        .withMass(6.4185e23)
        .withRadius(1794)
        .withAngularVelocity(1)
        .withParent(this.objects.sun)
        .withOrbitalParameters({
            semiMajorAxis: 227939200,
            eccentricity: 0.0934,
            meanAnomaly: 320.45776,
            period: 686.971 * 60 * 60 * 24
        })
        .build();
        this.physics.addUpdateable(this.objects.earth);
        this.renderer.addRenderable(this.objects.earth);
    }

    update(timeStep) {
        this.physics.update(timeStep);
        this.controller.update();
    }

    render() {
        this.renderer.render();
        this.view.requestAnimationFrame(() => this.render());
    }

    run() {
        const timeStep = 1.0 / 60.0;

        setInterval(() => {
            const now = Date.now();
            let deltaTime = (now - this.lastUpdate) / 1000.0;
            this.lastUpdate = now;

            let remainingDeltaTime = deltaTime;
            while(remainingDeltaTime > 0.0) {
                this.update(Math.min(timeStep, remainingDeltaTime));
                remainingDeltaTime -= timeStep;
            }
        }, 1000.0 / 60.0);

        this.view.requestAnimationFrame(() => this.render());
    }
}


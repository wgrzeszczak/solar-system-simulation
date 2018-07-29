import Renderer from './renderer';
import Physics from './physics';
import UI from './ui';

import Vector2D from './math/vector';

import StarBuilder from './builders/starBuilder';
import OrbitingBodyBuilder from './builders/orbitingBodyBuilder';

import BackgroundImage from '../images/backgrounds/default.jpg';
import SunImage from '../images/planets/sun.png';
import MercuryImage from '../images/planets/mercury.png';
import VenusImage from '../images/planets/venus.png';
import EarthImage from '../images/planets/earth.png';
import MoonImage from '../images/planets/moon.png';
import MarsImage from '../images/planets/mars.png';
import JupiterImage from '../images/planets/jupiter.png';
import SaturnImage from '../images/planets/saturn.png';
import UranusImage from '../images/planets/uranus.png';
import NeptuneImage from '../images/planets/neptune.png';
import Constants from './math/constants';
import BackgroundBuilder from './builders/backgroundBuilder';

export default class App {
    constructor(document, view, canvas, panel) {
        this.document = document;
        this.view = view;
        this.canvas = canvas;

        this.renderer = new Renderer(this.canvas);
        this.physics = new Physics();
        this.ui = new UI(this.view, this.canvas, panel, this.renderer, this.physics);

        this.lastUpdate = Date.now();

        this.objects = {};
        this.initialize();
    }

    initialize() {
        this.renderer.onResize(this.view.innerWidth, this.view.innerHeight);
        this.renderer.onMove(new Vector2D(this.view.innerWidth / 2, this.view.innerHeight / 2));

        this.objects.background = new BackgroundBuilder(this.document)
        .withImage(BackgroundImage)
        .build();
        this.renderer.addRenderable(this.objects.background);

        this.objects.sun = new StarBuilder(this.document)
        .withLabel("Sun")
        .withImage(SunImage)
        .withMass(1.989e30)
        .withRadius(695700)
        .withAngularVelocity(-1)
        .build();
        this.physics.addUpdateable(this.objects.sun);
        this.renderer.addRenderable(this.objects.sun);

        this.objects.mercury = new OrbitingBodyBuilder(this.document)
        .withLabel("Mercury")
        .withImage(MercuryImage)
        .withMass(3.3022e23)
        .withRadius(2439.7)
        .withAngularVelocity(-1)
        .withParent(this.objects.sun)
        .withOrbitalParameters({
            a0: 0.38709927 * Constants.AU,
			e0: 0.20563593,
			I0: 7.00497902,
			L0: 252.25032350,
			Lp0: 77.45779628,
            o0: 48.33076593,
            ac: 0.00000037 * Constants.AU,
			ec: 0.00001906,
			Ic: -0.00594749,
			Lc: 149472.67411175,
			Lpc: 0.16047689,
            oc: -0.12534081
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
            a0: 0.72333566 * Constants.AU,
			e0: 0.00677672,
			I0: 3.39467605,
			L0: 181.97909950,
			Lp0: 131.60246718,
            o0: 76.67984255,
            ac: 0.00000390 * Constants.AU,
			ec: -0.00004107,
			Ic: -0.00078890,
			Lc: 58517.81538729,
			Lpc: 0.00268329,
            oc: -0.27769418,
        })
        .build();
        this.physics.addUpdateable(this.objects.venus);
        this.renderer.addRenderable(this.objects.venus);

        this.objects.earth = new OrbitingBodyBuilder(this.document)
        .withLabel("Earth")
        .withImage(EarthImage)
        .withMass(5.9736e24)
        .withRadius(6000)
        .withAngularVelocity(-1)
        .withParent(this.objects.sun)
        .withOrbitalParameters({
            a0: 1.00000261 * Constants.AU,
			e0: 0.01671123,
			I0: -0.00001531,
			L0: 100.46457166,
			Lp0: 102.93768193,
            o0: 0.0,
            ac: 0.00000562 * Constants.AU,
			ec: -0.00004392,
			Ic: -0.01294668,
			Lc: 35999.37244981,
			Lpc: 0.32327364,
            oc: 0.0,
        })
        .build();
        this.physics.addUpdateable(this.objects.earth);
        this.renderer.addRenderable(this.objects.earth);

        this.objects.mars = new OrbitingBodyBuilder(this.document)
        .withLabel("Mars")
        .withImage(MarsImage)
        .withMass(6.4185e23)
        .withRadius(1794)
        .withAngularVelocity(-1)
        .withParent(this.objects.sun)
        .withOrbitalParameters({
            a0: 1.52371034 * Constants.AU,
			e0: 0.09339410,
			I0: 1.84969142,
			L0: -4.55343205,
			Lp0: -23.94362959,
            o0: 49.55953891,
            ac: 0.00001847 * Constants.AU,
			ec: 0.00007882,
			Ic: -0.00813131,
			Lc: 19140.30268499,
			Lpc: 0.44441088,
            oc: -0.29257343,
        })
        .build();
        this.physics.addUpdateable(this.objects.mars);
        this.renderer.addRenderable(this.objects.mars);

        this.objects.jupiter = new OrbitingBodyBuilder(this.document)
        .withLabel("Jupiter")
        .withImage(JupiterImage)
        .withMass(1.8982e27)
        .withRadius(69911)
        .withAngularVelocity(-1)
        .withParent(this.objects.sun)
        .withOrbitalParameters({
            a0: 5.20288700 * Constants.AU, 
			e0: 0.04838624,
			I0: 1.30439695,
			L0: 34.39644051,
			Lp0: 14.72847983,
            o0: 100.47390909,
            ac: -0.00011607 * Constants.AU,
			ec: -0.00013253,
			Ic: -0.00183714,
			Lc: 3034.74612775,
			Lpc: 0.21252668,
            oc: 0.20469106
        })
        .build();
        this.physics.addUpdateable(this.objects.jupiter);
        this.renderer.addRenderable(this.objects.jupiter);

        this.objects.saturn = new OrbitingBodyBuilder(this.document)
        .withLabel("Saturn")
        .withImage(SaturnImage)
        .withMass(5.6834e26)
        .withRadius(58232)
        .withAngularVelocity(-1)
        .withParent(this.objects.sun)
        .withOrbitalParameters({
            a0: 9.53667594 * Constants.AU,
			e0: 0.05386179,
			I0: 2.48599187,
			L0: 49.95424423,
			Lp0: 92.59887831,
            o0: 113.66242448,
            ac: -0.00125060 * Constants.AU,
			ec: -0.00050991,
			Ic: 0.00193609,
			Lc: 1222.49362201,
			Lpc: -0.41897216,
            oc: -0.28867794,
        })
        .build();
        this.physics.addUpdateable(this.objects.saturn);
        this.renderer.addRenderable(this.objects.saturn);
     
        this.objects.uranus = new OrbitingBodyBuilder(this.document)
        .withLabel("Uranus")
        .withImage(UranusImage)
        .withMass(8.681e25)
        .withRadius(25362)
        .withAngularVelocity(1)
        .withParent(this.objects.sun)
        .withOrbitalParameters({
            a0: 19.18916464 * Constants.AU,
			e0: 0.04725744,
			I0: 0.77263783,
			L0: 313.23810451,
			Lp0: 170.95427630,
            o0: 74.01692503,
            ac: -0.00196176 * Constants.AU,
			ec: -0.00004397,
			Ic: -0.00242939,
			Lc: 428.48202785,
			Lpc: 0.40805281,
            oc: 0.04240589
        })
        .build();
        this.physics.addUpdateable(this.objects.uranus);
        this.renderer.addRenderable(this.objects.uranus);

        this.objects.neptune = new OrbitingBodyBuilder(this.document)
        .withLabel("Neptune")
        .withImage(NeptuneImage)
        .withMass(1.0243e26)
        .withRadius(24622)
        .withAngularVelocity(-1)
        .withParent(this.objects.sun)
        .withOrbitalParameters({
            a0: 30.06992276 * Constants.AU,
			e0: 0.00859048,
			I0: 1.77004347,
			L0: -55.12002969,
			Lp0: 44.96476227,
            o0: 131.78422574,
            ac: 0.00026291 * Constants.AU,
			ec: 0.00005105,
			Ic: 0.00035372,
			Lc: 218.45945325,
			Lpc: -0.32241464,
            oc: -0.00508664,
        })
        .build();
        this.physics.addUpdateable(this.objects.neptune);
        this.renderer.addRenderable(this.objects.neptune);
    }

    update(timeStep) {
        this.physics.update(timeStep);
        this.ui.update();
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


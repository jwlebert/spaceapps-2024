// from https://github.com/nasa/mission-viz/blob/c6f22701dc5fc3bf25172557a46557b1b5481eec/X3Dom/InnerSolarSystem.html

import * as THREE from "three";

type objType = "planet" | "comet";

interface Position {
    x: number;
    y: number;
    z: number;
}

export class Trajectory {
    name: string;               // name the object
    smA: number;                // semi major axis
    oI: number;                 // orbital inclination --> convert degrees to radians
    aP: number;                 // argument of Perigee --> convert degrees to radians
    oE: number;                 // orbital eccentricity
    aN: number;                 // ascending node --> convert degrees to radians
    period: number;             // siderial period as a multiple of Earth's orbital period
    epochMeanAnomaly: number;   // mean anomaly at epoch 
    trueAnomoly: number         // initialize to mean anomaly at epoch
    position: Position;
    time: number;

    // Constructor to generate objects that identify orbital elements.
    constructor(name: string, smA: number, oI: number, aP: number, oE: number, aN: number, mAe: number, Sidereal: number) {
        this.name = name                          // name the object
        this.smA = smA                            // semi major axis
        this.oI = oI * 0.01745329                 // orbital inclination --> convert degrees to radians
        this.aP = aP * 0.01745329                 // argument of Perigee --> convert degrees to radians
        this.oE = oE                              // orbital eccentricity
        this.aN = aN * 0.01745329                 // ascending node --> convert degrees to radians
        this.period = Sidereal                    // siderial period as a multiple of Earth's orbital period
        this.epochMeanAnomaly = mAe * 0.01745329  // mean anomaly at epoch 
        this.trueAnomoly = 0                      // initialize to mean anomaly at epoch
        this.position = { x: 0, y: 0, z: 0 };
        this.time = 0;
    }

    // Purpose: Determine a position on an orbital trajectory based on a true anomoly.
    // Used by the traceOrbits function to draw the orbits.
    propagate(uA: number) {
        // let pos = [] ;
        // let xdot; var ydot; var zdot;            // velocity coordinates
        var theta = uA;                          // Update true anomaly.
        var smA = this.smA;                      // Semi-major Axis
        var oI = this.oI;                      // Orbital Inclination
        var aP = this.aP;                       // Get the object's orbital elements.
        var oE = this.oE;                        // Orbital eccentricity
        var aN = this.aN;                       // ascending Node
        var sLR = smA * (1 - oE ^ 2);             // Compute Semi-Latus Rectum.
        var r = sLR / (1 + oE * Math.cos(theta));  // Compute radial distance.

        this.position = {
            x: r * (Math.cos(aP + theta) * Math.cos(aN) - Math.cos(oI) * Math.sin(aP + theta) * Math.sin(aN)),
            y: r * (Math.cos(aP + theta) * Math.sin(aN) + Math.cos(oI) * Math.sin(aP + theta) * Math.cos(aN)),
            z: r * (Math.sin(aP + theta) * Math.sin(oI)),
        }

        // Apply 90-degree rotation on X-axis
        let rotatedY = this.position.z;
        let rotatedZ = -this.position.y;

        this.position = {
            x: this.position.x,
            y: rotatedY,
            z: rotatedZ
        };

        return this.position;
    }

    trueToEccentricAnomaly(e: number, f: number) {
        // http://mmae.iit.edu/~mpeet/Classes/MMAE441/Spacecraft/441Lecture19.pdf slide 7 
        var eccentricAnomaly = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(f / 2));

        return eccentricAnomaly;
    }

    meanToEccentricAnomaly(e: number, M: number) {
        // Solves for eccentric anomaly, E from a given mean anomaly, M
        // and eccentricty, e.  Performs a simple Newton-Raphson iteration
        // Code derived from Matlab scripts written by Richard Rieber, 1/23/2005
        // http://www.mathworks.com/matlabcentral/fileexchange/6779-calce-m
        var tol = 0.0001;  // tolerance
        var eAo = M;       // initialize eccentric anomaly with mean anomaly
        var ratio = 1;     // set ratio higher than the tolerance
        let eccentricAnomaly: number = 0;

        while (Math.abs(ratio) > tol) {
            var f_E = eAo - e * Math.sin(eAo) - M;
            var f_Eprime = 1 - e * Math.cos(eAo);
            ratio = f_E / f_Eprime;
            if (Math.abs(ratio) > tol) {
                eAo = eAo - ratio;
                // console.log ("ratio  " + ratio) ;
            } else {
                eccentricAnomaly = eAo;
            }
        }

        return eccentricAnomaly;
    }

    eccentricToTrueAnomaly(e: number, E: number) {
        // http://mmae.iit.edu/~mpeet/Classes/MMAE441/Spacecraft/441Lecture19.pdf slide 8
        var trueAnomaly = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
        return trueAnomaly
    }

}

export class CelestialObject {
    trajectory: Trajectory
    bodies: CelestialObject[]
    scene: THREE.Scene
    size: number
    texture: THREE.Texture
    mesh: THREE.Mesh
    type: objType

    constructor(trajectory: Trajectory, bodies: CelestialObject[], scene: THREE.Scene, size: number, texture: THREE.Texture, type: objType = "planet") {
        this.trajectory = trajectory;
        this.scene = scene;
        this.bodies = bodies;

        this.size = size;
        this.texture = texture;
        this.type = type;
        this.mesh = new THREE.Mesh();

        this.traceOrbits();
        this.createPlanet();
    }

    // Generate line segments from points around the trajectory of the orbiting objects.
    // Trace the orbits for the following array of objects.
    traceOrbits() {
        if (this.type != "planet") {return;}
        var geometry;
        var material = new THREE.LineBasicMaterial({ color: 0xCCCCFF });
        // console.log("Entering traceOrbits " + heavenlyBodies.length) ;
        // for (var hB in heavenlyBodies) {
        geometry = new THREE.BufferGeometry();   // Create an object for each orbit.
        const vertices: THREE.Vector3[] = [];
        var j = 0;                // Initialize the orbit index, which will build the orbIndices list. 
        var i = 0.0;

        while (i <= 6.28) {
            let orbPos = this.trajectory.propagate(i);
            vertices.push(new THREE.Vector3(orbPos.x, orbPos.y, orbPos.z));

            i = i + 0.0785
            j = j + 1;          // Increment the orbit index.
        }

        const verticesArray = vertices.flatMap(v => [v.x, v.y, v.z]);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(verticesArray, 3));

        let line = new THREE.Line(geometry, material);
        line.name = this.trajectory.name + "_trace";

        this.scene.add(line);
    }

    createPlanet() {
        var geometry = new THREE.SphereGeometry(this.size, 32, 32);
        var material = new THREE.MeshBasicMaterial({ map: this.texture });
        var planet = new THREE.Mesh(geometry, material);
        
        planet.name = this.trajectory.name;
        planet.position.set(this.trajectory.position.x, this.trajectory.position.y, this.trajectory.position.z);

        this.mesh = planet;
        this.scene.add(planet);
        this.bodies.push(this);
    }


    // With each tick of the clock, propagate the position and set the translation attribute.
    // Update the position for the following array of objects.
    updatePosition(speed: number) {
        var currentPosition: Position = { x: 0, y: 0, z: 0 };
        var deltaTime = 0;

        var hbTAnomoly = this.trajectory.trueAnomoly;
        var currentPosition = this.trajectory.propagate(hbTAnomoly);  // Determine the current position.

        var Xpos = currentPosition.x;
        var Ypos = currentPosition.y;
        var Zpos = currentPosition.z;
        var hBName = this.trajectory.name;   // get the name of the current object and update translation

        var curObj = this.scene.getObjectByName(hBName);
        if (curObj) curObj.position.set(Xpos, Ypos, Zpos);
        else console.error("Object not found: " + hBName);

        // Calculate mean motion n:
        var n = (2 * Math.PI) / (this.trajectory.period * 365.25);   // radians per day

        // Calculate Eccentric Anomaly E based on the orbital eccentricity and previous true anomaly:
        var e = this.trajectory.oE;
        var f = this.trajectory.trueAnomoly;        // this.trueAnomoly ;
        var eA = this.trajectory.trueToEccentricAnomaly(e, f); // convert from true anomaly to eccentric anomaly

        // Calculate current Mean Anomaly	
        var m0 = eA - e * Math.sin(eA);

        // deltaTime = (Math.abs(m0/n) - this.time) * simSpeed
        //  deltaTime = Math.abs(m0/n) * simSpeed
        deltaTime = speed * n;

        // Update Mean anomaly by adding the Mean Anomaly at Epoch to the mean motion * delaTime
        var mA = deltaTime + m0

        this.trajectory.time = this.trajectory.time + deltaTime // increment timer

        eA = this.trajectory.meanToEccentricAnomaly(e, mA)
        var trueAnomaly = this.trajectory.eccentricToTrueAnomaly(e, eA)
        this.trajectory.trueAnomoly = trueAnomaly

    };

    static updateTheDate(epoch: Date, simSpeed: number) {
        // Display the simulated date to the right of the model.
        //  epoch.setTime(epoch.getTime() + simSpeed * 86400)
        if (simSpeed == 1) {
            epoch.setDate(epoch.getDate() + 1);
            // At maximum speed, increment calendar by a day for each clock-cycle.
        } else {
            epoch.setTime(epoch.getTime() + simSpeed * 24 * 3600000);
        }  // 24 hours * milliseconds in an hour * simSpeed 
        //	 document.getElementById("modelDate").innerHTML = (epoch.getMonth() + 1) + "-" + epoch.getDate() + "-" + epoch.getFullYear() ;
    }

    static getEpoch() {
        return epoch.toDateString();
    }

    static setSimSpeed(speed: number) {
        simSpeed = speed;
    }

    static getSimSpeed() { return simSpeed; }
}

/*----------------------------------------------------------------------------------------------*
*                            {--- Global variables --}                                         *
*----------------------------------------------------------------------------------------------*/

// var solid = false;                        // start simulation with solid rendering of orbits
// var solidLabels = false;                  // start simulation with solid rendering of Labels

// Specify trajectories' sMA, oI, aP, oE, aN, mAe, Sidereal <-- refer to Trajectory constructor.
// Orbital elements source: http://www.met.rdg.ac.uk/~ross/Astronomy/Planets.html#rates
// Orbital period source: http://en.wikipedia.org/wiki/Orbital_period
// Mean Anomoly at epoch for planets http://farside.ph.utexas.edu/teaching/celestial/Celestial/node34.html
// Source: http://neo.jpl.nasa.gov/cgi-bin/neo_elem?type=PHA;hmax=all;max_rows=20;action=Display%20Table;show=1&sort=moid&sdir=ASC

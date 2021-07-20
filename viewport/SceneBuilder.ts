import { Bar, Panel, Construction, PartBase, Marker } from "openjoyn/model";
import { makeBevelBoxGeometry } from "./helpers";

import * as THREE from "three";

const bevelDefault = 2;
const debugColor = new THREE.Color(0xff4500);



function applyPartPosRotToObj(part: PartBase, obj: THREE.Object3D) {
    obj.position.copy(part.pos);
    obj.quaternion.copy(part.rot);
}

function makeDebugLine(from: THREE.Vector3, to: THREE.Vector3, color?: string) {
    let lineMat = new THREE.LineBasicMaterial({ color: color });
    // let lineMat = new THREE.LineDashedMaterial({ 	linewidth: 50, color: color, gapSize: 4, dashSize: 5, scale: 100 });

    const lineGeo = new THREE.BufferGeometry().setFromPoints([from, to]);
    const line = new THREE.Line(lineGeo, lineMat);

    return line;
}


class SceneBuilder {
    construction: Construction;

    constructor(construction: Construction) {
        this.construction = construction;
    }

    makeMarkerObj(marker: Marker): THREE.Object3D {
        const geo = new THREE.SphereGeometry(marker.radius, 16, 12);

        const mat = new THREE.MeshStandardMaterial({
            // flatShading: true,
            color: 0x000000,
            emissive: 0x0000ff
        });

        const mesh = new THREE.Mesh(geo, mat);

        mesh.castShadow = false;

        const obj = new THREE.Object3D();
        obj.add(mesh);

        applyPartPosRotToObj(marker, obj);

        return obj;
    }

    makeBarObj(bar: Bar): THREE.Object3D {
        const geo = makeBevelBoxGeometry(bar.size, bar.length, bevelDefault);


        let mat = new THREE.MeshStandardMaterial(
            {
                color: 0xe6d488,
            }
        );


        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(0, 0, bar.length * 0.5);
        // mesh.castShadow = true;

        const obj = new THREE.Object3D();
        obj.add(mesh);

        if (bar.debug) {

            let lineX = makeDebugLine(new THREE.Vector3(bar.size[0] * 0.5, 0, 0), new THREE.Vector3(bar.size[0] * 0.5, 0, bar.length), "#ff0000");
            let lineY = makeDebugLine(new THREE.Vector3(0, bar.size[1] * 0.5, 0), new THREE.Vector3(0, bar.size[1] * 0.5, bar.length), "#00ff00");
            obj.add(lineX);
            obj.add(lineY);

            mat.transparent = true;
            mat.opacity = 0.5;
            mat.color = debugColor;
        }

        applyPartPosRotToObj(bar, obj);

        // let lSide0 = bar.lineOnSide(0);
        // let lSide1 = bar.lineOnSide(1);
        // let lSide2 = bar.lineOnSide(2);
        // let lSide3 = bar.lineOnSide(3);

        // let lineSide0 = makeDebugLine(lSide0.start, lSide0.end, "#ff0000");
        // let lineSide1 = makeDebugLine(lSide1.start, lSide1.end, "#00ff00");

        // let lineSide2 = makeDebugLine(lSide2.start, lSide2.end, "#ff0000");
        // let lineSide3 = makeDebugLine(lSide3.start, lSide3.end, "#00ff00");

        // let w0 = new THREE.Object3D();
        // w0.add(lineSide0);
        // w0.add(lineSide1);
        // w0.add(lineSide2);
        // w0.add(lineSide3);

        //w0.add(obj);


        return obj;
    }

    makePanelObj(panel: Panel): THREE.Object3D {
        const geo = makeBevelBoxGeometry(panel.size, panel.thickness, bevelDefault, bevelDefault);
        let mat = new THREE.MeshStandardMaterial(
            {
                roughness: 0.25,
                color: 0x222222,
            }
        );

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(0, 0, panel.thickness * 0.5);
        mesh.castShadow = true;

        const obj = new THREE.Object3D();
        obj.add(mesh);

        if (panel.debug) {
            mat.color = debugColor;
        }

        applyPartPosRotToObj(panel, obj);

        return obj;
    }

    makeSceneObj(part: PartBase): THREE.Object3D {
        if (part instanceof Bar) {
            return this.makeBarObj(part);
        } else if (part instanceof Panel) {
            return this.makePanelObj(part);
        } else if (part instanceof Marker) {
            return this.makeMarkerObj(part);
        }

        console.warn("Unhandled part", part);

        return null;
    }

    makeGroup(): THREE.Group {
        let group = new THREE.Group();
        let parts = this.construction.parts;
        parts.forEach(part => {
            let sceneObj = this.makeSceneObj(part);

            if (sceneObj) {
                group.add(sceneObj);
            }
        });

        group.scale.set(0.1, 0.1, 0.1);

        return group;
    }

    makeDebugGroup(): THREE.Group {
        let group = new THREE.Group();

        // let parts = this.construction.parts;
        // parts.forEach(part => {
        //     let debugObj = this.makeDebugObj(part);

        //     if (debugObj) {
        //         group.add(debugObj);
        //     }
        // });

        // group.scale.set(0.1, 0.1, 0.1);

        return group;

    }
}


export default SceneBuilder;
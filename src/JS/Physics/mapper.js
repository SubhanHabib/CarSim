
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

let ObjectMapper = null;

class Mapper {
    addVisuals({world, scene, body}) {
        this.currentMaterial = new THREE.MeshStandardMaterial({
                    color: '#474c54',
                    metalness: 0.3,
                    roughness: 0.6,
                    side: THREE.DoubleSide
                })
        let m = null;
        const obj = new THREE.Object3D();
        body.shapes.forEach((shape, l) => {
            const mesh = this.addVisual(shape)

            var o = body.shapeOffsets[l];
            var q = body.shapeOrientations[l];
            mesh.position.set(o.x, o.y, o.z);
            mesh.quaternion.set(q.x, q.y, q.z, q.w);
            
            obj.add(mesh);
            // m = mesh;
        })
        obj.position.copy(body.position)
        obj.quaternion.copy(body.quaternion)
        // m.rotation.x = - Math.PI * 0.5
        // m.position.y = -2

        // mesh.receiveShadow = true;
        // mesh.castShadow = true;
        return obj;
    }
    addVisual(shape) {
        console.log(shape.type)
        let mesh;
        switch(shape.type) {
            case CANNON.Shape.types.SPHERE:
                const geoSphere = new THREE.SphereGeometry(shape.radius, 8, 8);
                mesh = new THREE.Mesh(geoSphere, this.currentMaterial);
                break;

            case CANNON.Shape.types.BOX:
                const geoBox = new THREE.BoxGeometry(
                    shape.halfExtents.x * 2,
                    shape.halfExtents.y * 2,
                    shape.halfExtents.z * 2
                );
                mesh = new THREE.Mesh(geoBox, this.currentMaterial);
                break;


        case CANNON.Shape.types.HEIGHTFIELD:
            const geometry = new THREE.BufferGeometry()

            let v0  = new CANNON.Vec3()
            let v1  = new CANNON.Vec3()
            let v2  = new CANNON.Vec3()
            let points = [];
            let faces = [];

            for (let xi = 0; xi < shape.data.length - 1; xi++) {
                for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
                    for (let k = 0; k < 2; k++) {
                        shape.getConvexTrianglePillar(xi, yi, k === 0)
                        v0.copy(shape.pillarConvex.vertices[0])
                        v1.copy(shape.pillarConvex.vertices[1])
                        v2.copy(shape.pillarConvex.vertices[2])
                        v0.vadd(shape.pillarOffset,v0)
                        v1.vadd(shape.pillarOffset,v1)
                        v2.vadd(shape.pillarOffset,v2)
                        points.push(
                            new THREE.Vector3(v0.x, v0.y, v0.z),
                            new THREE.Vector3(v1.x, v1.y, v1.z),
                            new THREE.Vector3(v2.x, v2.y, v2.z),
                        )
                        // const i = geometry.vertices.length - 3
                        // geometry.faces.push(new THREE.Face3(i, i + 1, i + 2))
                    }
                }
            }
            geometry.setFromPoints(points)
            // geometry.computeBoundingSphere()
            geometry.computeFaceNormals()
            geometry.computeVertexNormals()
            mesh = new THREE.Mesh(geometry, this.currentMaterial)
            shape.id = geometry.id
            break

            default: throw `Visual type not recognized: ${shape.type}`;
        }

        return mesh;
    }

    createSphere({world, scene}) {
        const shape = new CANNON.Sphere(0.5)
        const body = new CANNON.Body({
            mass: 1,
            position: new CANNON.Vec3(0, 3, 0),
            shape: shape
        })
        world.addBody(body)
        console.log(body.shapes[0].type, CANNON.Shape.types.SPHERE)

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 5, 5 ),
            new THREE.MeshLambertMaterial({color:'#3f5fde'})
        )
        scene.add(mesh)

        return { body, mesh }
    }

    onTick() {

    }
}

export default Mapper;



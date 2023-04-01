import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import vertex_shader_source from '../shaders/vertex';
import fragment_shader_source from '../shaders/fragment';
import './RenderComponent.css';

function RenderComponent() {
    const container: any = useRef();
    const start = useRef(Date.now());
    const time = useRef(0);
    const perlin = useRef(new THREE.TextureLoader().load('/perlin.png'));

    perlin.current.wrapS = THREE.RepeatWrapping;
    perlin.current.wrapT = THREE.RepeatWrapping;

    const scene = useRef(new THREE.Scene());
    const camera = useRef(new THREE.PerspectiveCamera(75, 1000 / 1000, 0.1, 1000));  
    const renderer = useRef(new THREE.WebGLRenderer({antialias: true}));

    const geometry = useRef(new THREE.SphereGeometry( 0.75, 200, 200 ));
    // const geometry = useRef(new THREE.BoxGeometry(1.5, 1.5, 1, 500, 500)); 
    // const geometry = useRef(new THREE.TorusKnotGeometry(0.4, 0.2, 1000, 1000));

    const material = useRef(new THREE.ShaderMaterial({
        vertexShader: vertex_shader_source,
        fragmentShader: fragment_shader_source,
        uniforms: {
            view_pos: { value: new THREE.Vector3(0.0, 0.0, 2.0)},
            light_pos: {value: new THREE.Vector3(-5.0, 4.0, 100.0)},
            mesh_color: {value: new THREE.Vector3(1.0, 0.0, 0.0)}, // 0.5 0.3 6
            translate: { value: new THREE.Vector3(1.0, 0.0, 1.0)},
            perlin: { value: perlin.current },
            time: { value: 0.0 },
        },
    }));

    const sphere = useRef( new THREE.Mesh( geometry.current, material.current ));

    useEffect(() => {
        renderer.current.setSize(1000, 1000);
        renderer.current.setClearColor('#AAAAAA');
        renderer.current.clearColor();

        camera.current.position.z = 2;

        scene.current.add( sphere.current );

        container.current.innerHTML = '';
        container.current.append(renderer.current.domElement);

        const animate = () => {
            requestAnimationFrame(animate);

            time.current = (Date.now() - start.current);

            sphere.current.material.uniforms.time.value = 0.00025 * time.current;

            // sphere.current.rotation.x += 0.0011;
            // sphere.current.rotation.z += 0.0009;

            renderer.current.render(scene.current, camera.current);
        };

        animate();
    }, []);

    return (<div>
        <div ref={container} className="three_canvas"/>
    </div>);
}

export default RenderComponent;
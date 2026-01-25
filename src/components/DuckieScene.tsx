"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";

// Shader Logic
const patchShaders = (shader: any) => {
  // Correctly initialize uniforms with unique Vector4 instances
  shader.uniforms.uTrail = { value: new Array(20).fill(null).map(() => new THREE.Vector4(0, 0, 0, 0)) };
  shader.uniforms.uTrailLength = { value: 0 };
  shader.uniforms.uTime = { value: 0 };

  // Inject custom varying & noise
  shader.vertexShader = `
    varying vec3 vCustomPosition;
    ${shader.vertexShader}
  `.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    vCustomPosition = (modelMatrix * vec4(position, 1.0)).xyz; 
    `
  );

  shader.fragmentShader = `
    uniform vec4 uTrail[20];
    uniform int uTrailLength;
    uniform float uTime;
    varying vec3 vCustomPosition;
    
    // Simplex Noise 3D
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) { 
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0; 
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ ); 
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    float getTrailMask() {
        float noise = snoise(vCustomPosition * 2.0 + vec3(0.0, uTime * 0.5, 0.0));
        float mask = 0.0;
        for(int i = 0; i < 20; i++) {
            if(i >= uTrailLength) break;
            vec3 tPos = uTrail[i].xyz;
            float tRad = uTrail[i].w; 
            float dist = distance(vCustomPosition, tPos) + (noise * 0.1);
            float influence = smoothstep(tRad, tRad - 0.15, dist);
            mask += influence;
        }
        return clamp(mask, 0.0, 1.0);
    }

    ${shader.fragmentShader}
  `.replace(
    "#include <color_fragment>",
    `
    #include <color_fragment>
    float tMask = getTrailMask();
    // Rose Gold/Copper Accent: #dd7878 (approx 0.866, 0.47, 0.47) -> Metallic Tint
    // We mix slightly with the base color but overwrite mostly with the metallic tint
    vec3 chromeColor = vec3(0.866, 0.47, 0.47); 
    diffuseColor.rgb = mix(diffuseColor.rgb, chromeColor, tMask);
    `
  ).replace(
    "#include <roughnessmap_fragment>",
    `
    #include <roughnessmap_fragment>
    // Shiny but slightly satiny for the metallic look
    roughnessFactor = mix(roughnessFactor, 0.3, tMask);
    `
  ).replace(
    "#include <metalnessmap_fragment>",
    `
    #include <metalnessmap_fragment>
    // Chrome is pure metal
    metalnessFactor = mix(metalnessFactor, 1.0, tMask);
    `
  );
};


function Duckie(props: any) {
  const { scene } = useGLTF("/objects/duckie.glb");
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const trailRef = useRef<{pos: THREE.Vector3, radius: number}[]>([]);
  const lastAddRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);

  // Deep clone to ensure unique materials
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        meshRefs.current.push(mesh);
        
        // Ensure material is unique and standard
        if (mesh.material) {
           // If it's not Standard, we might have issues with vNormal/lights.
           // However, let's assume glb loads standard.
           const origMat = mesh.material as THREE.Material;
           const mat = origMat.clone();
           mesh.material = mat;
           
           mat.onBeforeCompile = (shader) => {
             patchShaders(shader);
             mat.userData.shader = shader;
           };
           // Needs update to trigger recompilation
           mat.needsUpdate = true;
        }
      }
    });
  }, [clonedScene]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // Idle Animation: Subtle floating and gentle rotation
    if (groupRef.current) {
        groupRef.current.position.y = -1 + Math.sin(time * 0.5) * 0.1; // Bobbing
        groupRef.current.rotation.y = -Math.PI / 4 + Math.sin(time * 0.3) * 0.05; // Gentle sway
    }

    // Decay trail
    for (let i = trailRef.current.length - 1; i >= 0; i--) {
        trailRef.current[i].radius -= 1.0 * delta; // Vanish speed
        if (trailRef.current[i].radius <= 0) {
            trailRef.current.splice(i, 1);
        }
    }
    
    // Update Uniforms
    meshRefs.current.forEach((mesh) => {
       const mat = mesh.material as THREE.Material;
       if (mat.userData.shader) {
         const uTrail = mat.userData.shader.uniforms.uTrail.value;
         
         const len = trailRef.current.length;
         mat.userData.shader.uniforms.uTrailLength.value = len;
         mat.userData.shader.uniforms.uTime.value = time;
         
         for(let i=0; i<20; i++) {
             if (i < len) {
                 const p = trailRef.current[i];
                 uTrail[i].set(p.pos.x, p.pos.y, p.pos.z, p.radius);
             } else {
                 uTrail[i].set(0,0,0,0);
             }
         }
       }
    });
  });

  const handlePointerMove = (e: any) => {
      const now = Date.now();
      // Rate limit to ~60fps
      if (now - lastAddRef.current > 16) {
         if (trailRef.current.length >= 20) trailRef.current.shift();
         
         // e.point is World Space intersection
         // console.log("Paint:", e.point); 
         trailRef.current.push({ pos: e.point.clone(), radius: 0.6 }); 
         lastAddRef.current = now;
      }
  };

  return (
    <group ref={groupRef}>
        <primitive 
        object={clonedScene} 
        scale={2} 
        rotation={[0, -Math.PI / 4, 0]} 
        position={[0, -0.3, 0]}
        onPointerMove={handlePointerMove}
        {...props}
        />
    </group>
  );
}

export default function DuckieScene() {
  return (
    <div className="h-full w-full">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]} // Performance: Clamp pixel ratio for high-dpi screens
        performance={{ min: 0.5 }} // Allow degrading quality if FPS drops
        gl={{ powerPreference: "high-performance", antialias: true }} 
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <Suspense fallback={null}>
            <Duckie />
            <Environment preset="city" />
        </Suspense>
        
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}


useGLTF.preload("/objects/duckie.glb");

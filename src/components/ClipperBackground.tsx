import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ClipperBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    container.appendChild(renderer.domElement);

    // --- MATERIALS (MATTE GRAPHITE BLACK, POLISHED 24K GOLD, NEON CYAN CORE) ---
    // Matte Obsidian Graphite for outer body shell halves
    const shellMatteBlackMaterial = new THREE.MeshStandardMaterial({
      color: 0x14161a,
      roughness: 0.35,
      metalness: 0.85,
    });

    // High Gloss Metallic 24K Gold for accents & internal mechanical components
    const goldMetallicMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.12,
      metalness: 0.98,
      emissive: 0x664400,
      emissiveIntensity: 0.3,
    });

    // Mirror Gold Titanium Blade Material
    const goldBladeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffea70,
      roughness: 0.05,
      metalness: 1.0,
      emissive: 0x886600,
      emissiveIntensity: 0.4,
    });

    // Dark Biomechanical Chassis Metal
    const darkChassisMaterial = new THREE.MeshStandardMaterial({
      color: 0x090a0c,
      roughness: 0.5,
      metalness: 0.8,
    });

    // Glowing Neon Cyan Power Core Material
    const cyanNeonMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 4.5,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95,
    });

    // Particle Cloud Materials (Full Screen Ambient Sparks)
    const goldParticleMaterial = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.11,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const cyanParticleMaterial = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.09,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    // --- MASTER 3D FUTURISTIC CLIPPER GROUP ---
    const clipperGroup = new THREE.Group();
    scene.add(clipperGroup);

    clipperGroup.scale.set(0.35, 0.35, 0.35);
    clipperGroup.position.set(0, 0.2, 0);

    // --- FULL SCREEN PARTICLE SPARK CLOUD ---
    const particleCount = 300;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 30;
      const py = (Math.random() - 0.5) * 26;
      const pz = (Math.random() - 0.5) * 18;
      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.012,
        y: (Math.random() - 0.5) * 0.012 + 0.004,
        z: (Math.random() - 0.5) * 0.012,
      });
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const goldParticles = new THREE.Points(particleGeo, goldParticleMaterial);
    scene.add(goldParticles);

    const cyanParticles = new THREE.Points(particleGeo, cyanParticleMaterial);
    cyanParticles.position.set(0, 0, -2.0);
    scene.add(cyanParticles);

    // =========================================================================
    // HIGHLY DETAILED PROCEDURAL FUTURISTIC CLIPPER / TRIMMER (EXPLODED VIEW)
    // =========================================================================

    // 1. FRONT CARCASS HALF (Black Shell - Explodes forward in Z)
    const frontShellGroup = new THREE.Group();
    clipperGroup.add(frontShellGroup);

    const frontShellShape = new THREE.Shape();
    frontShellShape.moveTo(-0.95, 2.6);
    frontShellShape.quadraticCurveTo(-1.15, 1.0, -1.0, -1.8);
    frontShellShape.quadraticCurveTo(-0.75, -3.2, 0, -3.5);
    frontShellShape.quadraticCurveTo(0.75, -3.2, 1.0, -1.8);
    frontShellShape.quadraticCurveTo(1.15, 1.0, 0.95, 2.6);
    frontShellShape.quadraticCurveTo(0, 2.9, -0.95, 2.6);

    const frontShellGeo = new THREE.ExtrudeGeometry(frontShellShape, {
      steps: 2,
      depth: 0.45,
      bevelEnabled: true,
      bevelThickness: 0.25,
      bevelSize: 0.2,
      bevelSegments: 4,
    });
    frontShellGeo.center();
    const frontShellMesh = new THREE.Mesh(frontShellGeo, shellMatteBlackMaterial);
    frontShellGroup.add(frontShellMesh);

    // Front Gold Accent Shield Inlay
    const frontShieldShape = new THREE.Shape();
    frontShieldShape.moveTo(-0.45, 1.4);
    frontShieldShape.lineTo(-0.4, -2.0);
    frontShieldShape.quadraticCurveTo(0, -2.3, 0.4, -2.0);
    frontShieldShape.lineTo(0.45, 1.4);
    frontShieldShape.quadraticCurveTo(0, 1.6, -0.45, 1.4);

    const frontShieldGeo = new THREE.ExtrudeGeometry(frontShieldShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 3,
    });
    frontShieldGeo.center();
    const frontShieldMesh = new THREE.Mesh(frontShieldGeo, goldMetallicMaterial);
    frontShieldMesh.position.set(0, -0.3, 0.38);
    frontShellGroup.add(frontShieldMesh);

    // 2. BACK CARCASS HALF (Black Shell - Explodes backward in Z)
    const backShellGroup = new THREE.Group();
    clipperGroup.add(backShellGroup);

    const backShellMesh = new THREE.Mesh(frontShellGeo, shellMatteBlackMaterial);
    backShellMesh.rotation.y = Math.PI;
    backShellGroup.add(backShellMesh);

    // 3. LEFT CARCASS SIDE PANEL (Explodes left in X)
    const leftSideGroup = new THREE.Group();
    clipperGroup.add(leftSideGroup);

    const sidePanelGeo = new THREE.CylinderGeometry(0.18, 0.18, 5.0, 16);
    const leftSideMesh = new THREE.Mesh(sidePanelGeo, goldMetallicMaterial);
    leftSideMesh.position.set(-1.0, -0.4, 0);
    leftSideGroup.add(leftSideMesh);

    // 4. RIGHT CARCASS SIDE PANEL (Explodes right in X)
    const rightSideGroup = new THREE.Group();
    clipperGroup.add(rightSideGroup);

    const rightSideMesh = new THREE.Mesh(sidePanelGeo, goldMetallicMaterial);
    rightSideMesh.position.set(1.0, -0.4, 0);
    rightSideGroup.add(rightSideMesh);

    // 5. TOP CUTTING HEAD & BLADES (Explodes upward in Y & Z)
    const bladeHeadGroup = new THREE.Group();
    bladeHeadGroup.position.set(0, 3.1, 0.1);
    clipperGroup.add(bladeHeadGroup);

    // Gold Stationary Base Plate
    const basePlateGeo = new THREE.BoxGeometry(2.2, 0.7, 0.25);
    const basePlateMesh = new THREE.Mesh(basePlateGeo, goldBladeMaterial);
    bladeHeadGroup.add(basePlateMesh);

    // Black Mounting Support Block
    const mountBlockGeo = new THREE.BoxGeometry(1.8, 0.45, 0.35);
    const mountBlockMesh = new THREE.Mesh(mountBlockGeo, darkChassisMaterial);
    mountBlockMesh.position.set(0, -0.2, -0.18);
    bladeHeadGroup.add(mountBlockMesh);

    // Gold Precision Cutting Teeth Comb Array
    const toothCount = 42;
    const teethGroup = new THREE.Group();
    teethGroup.position.set(-1.0, 0.35, 0);

    const toothGeo = new THREE.ConeGeometry(0.022, 0.45, 4);
    for (let i = 0; i < toothCount; i++) {
      const toothMesh = new THREE.Mesh(toothGeo, goldBladeMaterial);
      toothMesh.position.set(i * (2.0 / toothCount), 0, 0);
      teethGroup.add(toothMesh);
    }
    bladeHeadGroup.add(teethGroup);

    // 6. SIDE TAPER ADJUSTMENT LEVER (Explodes outward left)
    const leverGroup = new THREE.Group();
    leverGroup.position.set(-1.15, 1.8, 0.1);
    clipperGroup.add(leverGroup);

    const leverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.35, -0.4, 0.1),
      new THREE.Vector3(-0.45, -1.0, 0.15),
      new THREE.Vector3(-0.3, -1.4, 0.1),
    ]);
    const leverArmGeo = new THREE.TubeGeometry(leverCurve, 20, 0.08, 12, false);
    const leverArmMesh = new THREE.Mesh(leverArmGeo, goldMetallicMaterial);
    leverGroup.add(leverArmMesh);

    const leverKnobGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const leverKnobMesh = new THREE.Mesh(leverKnobGeo, goldMetallicMaterial);
    leverKnobMesh.position.set(-0.3, -1.4, 0.1);
    leverGroup.add(leverKnobMesh);

    // 7. INTERNAL TECHNOLOGICAL ENGINE & NEON CYAN POWER CORE (Exposed on Exploded View)
    const internalCoreGroup = new THREE.Group();
    clipperGroup.add(internalCoreGroup);

    // Central Glowing Cyan Energy Cylinder
    const cyanMotorGeo = new THREE.CylinderGeometry(0.48, 0.48, 2.2, 32);
    const cyanMotorMesh = new THREE.Mesh(cyanMotorGeo, cyanNeonMaterial);
    cyanMotorMesh.position.set(0, 0.1, 0);
    internalCoreGroup.add(cyanMotorMesh);

    // Glowing Neon Rings encircling motor
    const cyanRingGeo = new THREE.TorusGeometry(0.62, 0.05, 16, 36);
    const cyanRingMesh1 = new THREE.Mesh(cyanRingGeo, cyanNeonMaterial);
    cyanRingMesh1.position.set(0, 0.7, 0);
    cyanRingMesh1.rotation.x = Math.PI / 2;
    internalCoreGroup.add(cyanRingMesh1);

    const cyanRingMesh2 = new THREE.Mesh(cyanRingGeo, cyanNeonMaterial);
    cyanRingMesh2.position.set(0, -0.5, 0);
    cyanRingMesh2.rotation.x = Math.PI / 2;
    internalCoreGroup.add(cyanRingMesh2);

    // Gold Circuit Coils & Mechanical Gear Rings
    const gearCount = 6;
    const gearMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < gearCount; i++) {
      const gearGeo = new THREE.TorusGeometry(0.45 + i * 0.16, 0.035, 12, 32);
      const mat = i % 2 === 0 ? goldMetallicMaterial : darkChassisMaterial;
      const gearMesh = new THREE.Mesh(gearGeo, mat);
      gearMesh.position.z = (i - 2.5) * 0.18;
      internalCoreGroup.add(gearMesh);
      gearMeshes.push(gearMesh);
    }

    // --- Studio Lighting Setup ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const goldLight = new THREE.DirectionalLight(0xffcc00, 6.5);
    goldLight.position.set(5, 7, 8);
    scene.add(goldLight);

    const cyanLight = new THREE.DirectionalLight(0x00e5ff, 4.0);
    cyanLight.position.set(-5, -5, 7);
    scene.add(cyanLight);

    const corePointLight = new THREE.PointLight(0x00e5ff, 5.5, 15);
    corePointLight.position.set(0, 0.2, 2);
    scene.add(corePointLight);

    // --- Scroll & Responsive Variables ---
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      targetScrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // --- Resize Handler ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;

      if (w < 640) {
        camera.position.z = 9.5;
      } else if (w < 1024) {
        camera.position.z = 8.5;
      } else {
        camera.position.z = 7.5;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // --- Render Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth Interpolation of scroll progress
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;
      const p = currentScrollProgress; // 0 (Hero top) to 1 (Bottom of page)

      // Pulsing Cyan Power Core Glow
      const cyanPulse = (Math.sin(elapsedTime * 3.2) + 1) * 0.5;
      cyanNeonMaterial.emissiveIntensity = 3.0 + cyanPulse * 3.0;
      corePointLight.intensity = 4.0 + cyanPulse * 3.5;
      cyanRingMesh1.rotation.z = elapsedTime * 1.5;
      cyanRingMesh2.rotation.z = -elapsedTime * 1.5;

      // Subtle Idle Float & Rotation at top
      const idleFloatY = Math.sin(elapsedTime * 1.2) * 0.12;
      const idleRotateZ = Math.sin(elapsedTime * 0.9) * 0.03;

      // Position & smooth translation on scroll
      clipperGroup.position.x = 0;
      clipperGroup.position.y = 0.2 + idleFloatY - p * 4.0;
      clipperGroup.position.z = -p * 5.5;

      // Horizontal orientation base (Math.PI / 2) + rotation driven by Scroll
      clipperGroup.rotation.y = elapsedTime * 0.15 + p * Math.PI * 1.8;
      clipperGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.05 + p * 0.4;
      clipperGroup.rotation.z = Math.PI / 2 + idleRotateZ + p * 0.3;

      // =========================================================================
      // DYNAMIC EXPLODED VIEW ANIMATION (SCROLL-DRIVEN DESMONTAGEM EM CAMADAS)
      // =========================================================================
      // 1. Carcaça Preta Frontal se eleva para a frente (+Z)
      frontShellGroup.position.z = 0.2 + p * 2.8;

      // 2. Carcaça Preta Traseira recua para trás (-Z)
      backShellGroup.position.z = -0.2 - p * 2.8;

      // 3. Painéis Laterais Dourados se afastam para os lados (+X e -X)
      leftSideGroup.position.x = -p * 1.8;
      rightSideGroup.position.x = p * 1.8;

      // 4. Cabeçote e Lâmina Dourada avançam para cima (+Y) e frente (+Z)
      bladeHeadGroup.position.y = 3.1 + p * 2.2;
      bladeHeadGroup.position.z = 0.1 + p * 2.0;

      // 5. Alavanca de Ajuste se projeta para fora (-X)
      leverGroup.position.x = -1.15 - p * 2.2;
      leverGroup.position.z = 0.1 + p * 1.8;

      // 6. Motor Interno e Bobinas de Ciano se expõem no centro 3D
      internalCoreGroup.position.z = 0;
      gearMeshes.forEach((gMesh, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        gMesh.position.z = (idx - 2.5) * (0.18 + p * 2.2);
        gMesh.rotation.z = elapsedTime * (1 + idx * 0.5) * dir + p * Math.PI * 2.5;
        gMesh.scale.setScalar(1 + p * 0.6);
      });

      // Partículas flutuantes cibernéticas expandidas por toda a tela
      const positions = goldParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i];
        positions[i * 3] += vel.x * (1 + p * 1.5);
        positions[i * 3 + 1] += vel.y * (1 + p * 1.5);
        positions[i * 3 + 2] += vel.z * (1 + p * 1.5);

        if (Math.abs(positions[i * 3]) > 15) positions[i * 3] *= -0.9;
        if (Math.abs(positions[i * 3 + 1]) > 13) positions[i * 3 + 1] *= -0.9;
        if (Math.abs(positions[i * 3 + 2]) > 9) positions[i * 3 + 2] *= -0.9;
      }
      goldParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // --- Clean Up ---
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      shellMatteBlackMaterial.dispose();
      goldMetallicMaterial.dispose();
      goldBladeMaterial.dispose();
      darkChassisMaterial.dispose();
      cyanNeonMaterial.dispose();
      goldParticleMaterial.dispose();
      cyanParticleMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 top-0 left-0 h-full w-full pointer-events-none"
      style={{
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}

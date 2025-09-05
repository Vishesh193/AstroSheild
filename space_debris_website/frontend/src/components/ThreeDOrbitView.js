import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';

const ThreeDOrbitView = ({ debrisData, isLoading = false }) => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (isLoading || !debrisData || !mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Get container dimensions
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Earth
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    const earthMaterial = new THREE.MeshBasicMaterial({
      color: 0x0077be  // Ocean blue as fallback if texture loading fails
    });
    
    // Try to load Earth texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/static/images/earth_texture.jpg',
      (texture) => {
        earthMaterial.map = texture;
        earthMaterial.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.error('Error loading Earth texture:', err);
      }
    );
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Add debris objects
    const debrisObjects = [];
    if (debrisData && debrisData.length > 0) {
      debrisData.forEach((debris, index) => {
        // For demo purposes, create random orbital positions
        // In production, convert actual orbital elements to Cartesian coordinates
        const radius = 1.5 + (Math.random() * 0.5);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        const debrisGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const debrisMaterial = new THREE.MeshBasicMaterial({ 
          color: debris.rcs_size === 'LARGE' ? 0xff0000 : 
                debris.rcs_size === 'MEDIUM' ? 0xffff00 : 0x00ff00
        });
        const debrisMesh = new THREE.Mesh(debrisGeometry, debrisMaterial);
        
        debrisMesh.position.set(x, y, z);
        scene.add(debrisMesh);
        debrisObjects.push({
          mesh: debrisMesh,
          initialPos: { x, y, z },
          orbitSpeed: 0.001 + (Math.random() * 0.002)
        });
      });
    }
    
    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Rotate Earth
      earth.rotation.y += 0.001;
      
      // Update debris positions
      debrisObjects.forEach(obj => {
        // Simulate orbital movement (simplified)
        const { mesh, initialPos, orbitSpeed } = obj;
        const time = Date.now() * orbitSpeed;
        
        mesh.position.x = initialPos.x * Math.cos(time) - initialPos.z * Math.sin(time);
        mesh.position.z = initialPos.x * Math.sin(time) + initialPos.z * Math.cos(time);
      });
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    
    // Handle resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      earthGeometry.dispose();
      earthMaterial.dispose();
      renderer.dispose();
    };
  }, [debrisData, isLoading]);
  
  return (
    <Paper elevation={3} sx={{ width: '100%', height: '500px', position: 'relative', overflow: 'hidden' }}>
      {isLoading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%',
            flexDirection: 'column'
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading visualization...
          </Typography>
        </Box>
      ) : (
        <Box ref={mountRef} sx={{ width: '100%', height: '100%' }} />
      )}
    </Paper>
  );
};

export default ThreeDOrbitView; 
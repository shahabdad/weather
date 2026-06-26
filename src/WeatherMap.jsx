import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const WeatherMap = ({ cityName }) => {
  const [activeLayer, setActiveLayer] = useState('radar'); // 'radar', 'clouds', 'temp', 'wind', 'satellite'
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const wrapper = wrapperRef.current;
    
    let animationId;
    let angle = 0;
    
    // Sizing handler using client bounds
    const resizeCanvas = () => {
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        canvas.width = rect.width || 500;
        canvas.height = rect.height || 250;
      }
    };
    
    resizeCanvas();
    
    // Register ResizeObserver for full responsiveness
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    if (wrapper) {
      resizeObserver.observe(wrapper);
    }
    
    // Setup static particles for Wind Flow
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 500),
        y: Math.random() * (canvas.height || 250),
        vx: 1 + Math.random() * 2,
        vy: -0.5 + Math.random(),
        life: Math.random() * 100
      });
    }

    const draw = () => {
      if (!canvas.width || !canvas.height) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      // 1. Clear background
      ctx.fillStyle = '#060a13';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.45;

      // Setup storm cells dynamically based on active width/height
      const stormCells = [
        { x: canvas.width * 0.45, y: canvas.height * 0.4, r: 35, intensity: 0.8 },
        { x: canvas.width * 0.65, y: canvas.height * 0.55, r: 25, intensity: 0.5 },
        { x: canvas.width * 0.35, y: canvas.height * 0.65, r: 45, intensity: 0.3 }
      ];

      // 2. Draw Layer-Specific Visuals
      if (activeLayer === 'radar') {
        // Draw static range rings
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        for (let r = maxRadius * 0.25; r <= maxRadius; r += maxRadius * 0.25) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw crosshairs
        ctx.beginPath();
        ctx.moveTo(centerX - maxRadius, centerY);
        ctx.lineTo(centerX + maxRadius, centerY);
        ctx.moveTo(centerX, centerY - maxRadius);
        ctx.lineTo(centerX, centerY + maxRadius);
        ctx.stroke();

        // Draw pulsing storm blobs (Rain Radar)
        stormCells.forEach((cell) => {
          const pulse = cell.r + Math.sin(Date.now() / 300) * 3;
          const gradient = ctx.createRadialGradient(cell.x, cell.y, 2, cell.x, cell.y, pulse);
          
          if (cell.intensity > 0.7) {
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
            gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          } else {
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.6)');
            gradient.addColorStop(0.6, 'rgba(56, 189, 248, 0.3)');
            gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
          }
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, pulse, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw Sweeping Beam
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        
        const scanGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
        scanGrad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
        scanGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.05)');
        scanGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = scanGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxRadius, -0.2, 0);
        ctx.lineTo(0, 0);
        ctx.fill();

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(maxRadius, 0);
        ctx.stroke();

        ctx.restore();
        angle += 0.015;

      } else if (activeLayer === 'clouds') {
        const time = Date.now() * 0.0003;
        for (let i = 0; i < 4; i++) {
          const cx = centerX + Math.cos(time + i) * 60;
          const cy = centerY + Math.sin(time * 0.5 + i) * 40;
          const rad = 70 + i * 20;

          const cloudGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, rad);
          cloudGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
          cloudGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.06)');
          cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = cloudGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (activeLayer === 'temp') {
        const radialGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, maxRadius * 1.1);
        radialGrad.addColorStop(0, 'rgba(249, 115, 22, 0.45)');
        radialGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.2)');
        radialGrad.addColorStop(1, 'rgba(59, 130, 246, 0.08)');
        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(249, 115, 22, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(centerX - 10, centerY + 15, maxRadius * 0.3 * i, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (activeLayer === 'wind') {
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
        ctx.lineWidth = 1.5;
        
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
          ctx.stroke();

          p.x += p.vx;
          p.y += p.vy;
          p.life -= 1;

          if (p.x > canvas.width + 10 || p.life <= 0) {
            p.x = -10;
            p.y = Math.random() * canvas.height;
            p.life = 100 + Math.random() * 50;
          }
        });
      } else if (activeLayer === 'satellite') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1.5;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';

        ctx.beginPath();
        ctx.moveTo(centerX - 120, centerY - 80);
        ctx.bezierCurveTo(centerX - 80, centerY - 140, centerX + 80, centerY - 120, centerX + 110, centerY - 60);
        ctx.bezierCurveTo(centerX + 150, centerY - 20, centerX + 120, centerY + 80, centerX + 50, centerY + 90);
        ctx.bezierCurveTo(centerX - 30, centerY + 110, centerX - 120, centerY + 60, centerX - 120, centerY - 80);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const time = Date.now() * 0.0001;
        const satGrad = ctx.createRadialGradient(
          centerX + Math.cos(time) * 40,
          centerY + Math.sin(time) * 20,
          20,
          centerX + Math.cos(time) * 40,
          centerY + Math.sin(time) * 20,
          maxRadius * 0.9
        );
        satGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        satGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.12)');
        satGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = satGrad;
        ctx.beginPath();
        ctx.arc(centerX + Math.cos(time) * 40, centerY + Math.sin(time) * 20, maxRadius * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw Radar Border Frame
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius - 2, 0, Math.PI * 2);
      ctx.stroke();

      // Sweep indicators text info
      ctx.fillStyle = 'rgba(34, 211, 238, 0.6)';
      ctx.font = '10px monospace';
      ctx.fillText(`SYS.LOC: ${cityName.toUpperCase()}`, 15, 22);
      ctx.fillText(`MODE: ${activeLayer.toUpperCase()}_SCAN`, 15, 36);
      ctx.fillText(`STATUS: ONLINE_SYNC`, canvas.width - 130, 22);
      ctx.fillText(`SCANNER_RAD: ${maxRadius.toFixed(0)}KM`, canvas.width - 130, 36);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      if (wrapper) {
        resizeObserver.unobserve(wrapper);
      }
    };
  }, [activeLayer, cityName]);

  return (
    <motion.div 
      className="weather-map-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="map-header">
        <h3 className="map-title">Interactive Weather Radar</h3>
        <div className="map-tabs">
          <motion.button
            className={`map-tab-btn ${activeLayer === 'radar' ? 'active' : ''}`}
            onClick={() => setActiveLayer('radar')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Radar
          </motion.button>
          <motion.button
            className={`map-tab-btn ${activeLayer === 'clouds' ? 'active' : ''}`}
            onClick={() => setActiveLayer('clouds')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clouds
          </motion.button>
          <motion.button
            className={`map-tab-btn ${activeLayer === 'temp' ? 'active' : ''}`}
            onClick={() => setActiveLayer('temp')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Temperature
          </motion.button>
          <motion.button
            className={`map-tab-btn ${activeLayer === 'wind' ? 'active' : ''}`}
            onClick={() => setActiveLayer('wind')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Wind
          </motion.button>
          <motion.button
            className={`map-tab-btn ${activeLayer === 'satellite' ? 'active' : ''}`}
            onClick={() => setActiveLayer('satellite')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Satellite
          </motion.button>
        </div>
      </div>

      <div className="map-canvas-wrapper" ref={wrapperRef}>
        <canvas ref={canvasRef} className="map-canvas"></canvas>
      </div>
    </motion.div>
  );
};

export default WeatherMap;

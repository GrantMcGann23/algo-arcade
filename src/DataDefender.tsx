/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />

// DataDefender.tsx
import { useEffect, useRef, useState } from 'react';

interface Enemy {
  id: number;
  x: number;
  y: number;
  health: number;
  speed: number;
  towerId: number; // which tower this enemy is assigned to
}

type DataStructureType = 'STACK' | 'QUEUE' | 'HEAP';

interface Tower {
  id: number;
  x: number;
  y: number;
  range: number;
  dsType: DataStructureType;
  dsData: number[]; // store enemy IDs currently in range
}

export default function DataDefender() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // Place towers at different x positions so each gets its own wave.
  const [towers] = useState<Tower[]>([
    { id: 1, x: 200, y: 150, range: 150, dsType: 'STACK', dsData: [] },
    { id: 2, x: 600, y: 150, range: 150, dsType: 'QUEUE', dsData: [] },
    { id: 3, x: 1000, y: 150, range: 150, dsType: 'HEAP', dsData: [] },
  ]);

  // Global enemies state. Each enemy has a towerId indicating its target tower.
  const [enemies, setEnemies] = useState<Enemy[]>([]);

  // Global wave counter.
  const [waveNumber, setWaveNumber] = useState(0);

  // Setup canvas context.
  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        setCtx(context);
      }
    }
  }, []);

  // Game loop.
  useEffect(() => {
    let animationFrameId: number;
    function gameLoop() {
      update();
      render();
      animationFrameId = requestAnimationFrame(gameLoop);
    }
    if (ctx) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [ctx, enemies, towers]);

  // Update game state.
  function update() {
    // Move enemies upward (decrease y) with faster speed.
    setEnemies(old =>
      old
        .map(e => ({ ...e, y: e.y - e.speed }))
        .filter(e => e.health > 0 && e.y > 0) // remove dead or off-canvas enemies.
    );

    // For each tower, update its data structure and attack.
    towers.forEach(tower => {
      // 1. Remove enemy IDs no longer in range or dead.
      tower.dsData = tower.dsData.filter(id => {
        const enemy = enemies.find(e => e.id === id);
        return enemy && enemy.health > 0 && inRangeCheck(tower, enemy);
      });

      // 2. Add newly in-range enemies (by ID) that belong to this tower.
      enemies.forEach(e => {
        if (
          e.towerId === tower.id &&
          e.health > 0 &&
          inRangeCheck(tower, e) &&
          !tower.dsData.includes(e.id)
        ) {
          tower.dsData.push(e.id);
        }
      });

      // 3. Attack one enemy based on the tower's data structure.
      if (tower.dsData.length > 0) {
        let targetId: number | null = null;
        if (tower.dsType === 'STACK') {
          // Attack the most recently added enemy.
          targetId = tower.dsData[tower.dsData.length - 1];
        } else if (tower.dsType === 'QUEUE') {
          // Attack the earliest enemy.
          targetId = tower.dsData[0];
        } else if (tower.dsType === 'HEAP') {
          // Attack the enemy with the highest health.
          targetId = tower.dsData.reduce((maxId, id) => {
            const enemy = enemies.find(e => e.id === id);
            const maxEnemy = enemies.find(e => e.id === maxId);
            return enemy && maxEnemy && enemy.health > maxEnemy.health ? id : maxId;
          }, tower.dsData[0]);
        }
        if (targetId !== null) {
          // Reduce target's health by 0.2 per frame.
          setEnemies(old =>
            old.map(e => {
              if (e.id === targetId) {
                return { ...e, health: e.health - 0.2 };
              }
              return e;
            })
          );
        }
      }
    });
  }

  // Render towers and enemies.
  function render() {
    if (!ctx) return;
    // Clear canvas (size: 1200 x 600).
    ctx.clearRect(0, 0, 1200, 600);
    towers.forEach(tower => drawTower(ctx, tower));
    enemies.forEach(e => drawEnemy(ctx, e));
  }

  // Check if enemy is within tower's range.
  function inRangeCheck(tower: Tower, enemy: Enemy) {
    const dx = tower.x - enemy.x;
    const dy = tower.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist <= tower.range;
  }

  // Draw tower: circle, label, and range circle.
  function drawTower(context: CanvasRenderingContext2D, tower: Tower) {
    context.beginPath();
    context.arc(tower.x, tower.y, 15, 0, 2 * Math.PI);
    context.fillStyle = '#4ade80';
    context.fill();

    context.fillStyle = 'white';
    context.font = '12px Arial';
    context.fillText(tower.dsType, tower.x - 14, tower.y + 4);

    context.beginPath();
    context.arc(tower.x, tower.y, tower.range, 0, 2 * Math.PI);
    context.strokeStyle = 'rgba(255,255,255,0.2)';
    context.stroke();
  }

  // Draw enemy as a rectangle with a health bar.
  function drawEnemy(context: CanvasRenderingContext2D, enemy: Enemy) {
    context.beginPath();
    context.rect(enemy.x - 5, enemy.y - 5, 10, 10);
    context.fillStyle = '#f87171';
    context.fill();

    context.fillStyle = 'lime';
    context.fillRect(enemy.x - 5, enemy.y - 12, enemy.health * 2, 3);
  }

  // Spawn a wave for each tower individually.
  // Enemies spawn from the bottom, with each tower spawning its own wave.
  function spawnWave() {
    const newWave = waveNumber + 1;
    setWaveNumber(newWave);

    towers.forEach(tower => {
      const waveEnemies: Enemy[] = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + tower.id * 100 + i,
        x: tower.x + (Math.random() * 20 - 10),
        y: 550, // near the bottom of a 600px-high canvas
        health: 10,
        speed: 0.5, // faster speed for larger canvas
        towerId: tower.id,
      }));
      setEnemies(prev => [...prev, ...waveEnemies]);
    });
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Data Structure Defender (Expanded)</h2>
      <p className="text-lg mb-4 max-w-xl text-center">
        Each tower uses a different data structure to determine its attack target:
        <br />
        <strong>Attack Logic:</strong>
        <br />
        STACK: Attacks the enemy corresponding to the last enemy ID in dsData.
        <br />
        QUEUE: Attacks the enemy corresponding to the first enemy ID.
        <br />
        HEAP: Attacks the enemy (among those in range) with the highest health.
        <br />
        In all cases, the target’s health is reduced by 0.2 per frame.
        <br />
        Towers spawn waves from the bottom so that each tower receives its own set of enemies.
      </p>
      <div className="mb-4">
        <button className="px-4 py-2 bg-green-600 rounded mr-4" onClick={spawnWave}>
          Spawn Wave
        </button>
        <span className="text-sm">Wave: {waveNumber}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        style={{ border: '1px solid #ccc', background: '#1e1e1e' }}
      />
    </div>
  );
}

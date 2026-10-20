import React, { useEffect, useRef, useState } from 'react';
import { WHEEL_ORDER, RED_NUMBERS } from '../../types/roulette';
import { soundEngine } from '../../services/soundEngine';

interface RouletteWheelProps {
  isSpinning: boolean;
  targetNumber: number | null;
  onSpinComplete: () => void;
  winningNumber: number | null;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  isSpinning,
  targetNumber,
  onSpinComplete,
  winningNumber,
}) => {
  // Store ball state in SVG coordinates (wheel is 100% stationary, ball spins via RAF physics)
  const [ballState, setBallState] = useState<{
    x: number;
    y: number;
    trail1X: number;
    trail1Y: number;
    trail2X: number;
    trail2Y: number;
    isFast: boolean;
  }>({
    x: 200,
    y: 75, // initial resting position in pocket 0 (at 12 o'clock, radius 125)
    trail1X: 200,
    trail1Y: 75,
    trail2X: 200,
    trail2Y: 75,
    isFast: false,
  });

  const ballAngleRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const prevIsSpinningRef = useRef(false);

  const pocketCount = 37;
  const anglePerPocket = 360 / pocketCount;

  // Helper to compute Cartesian coords from angle (deg) and radius (px)
  const getCoords = (angleDeg: number, radius: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: 200 + radius * Math.sin(rad),
      y: 200 - radius * Math.cos(rad),
    };
  };

  useEffect(() => {
    if (isSpinning && !prevIsSpinningRef.current && targetNumber !== null) {
      const targetIndex = WHEEL_ORDER.indexOf(targetNumber);
      if (targetIndex === -1) return;

      // Target pocket center angle on the stationary wheel
      const targetPocketAngle = targetIndex * anglePerPocket;

      // Calculate total angle: current angle + 7 full 360deg turns + forward angle to target
      const currentAngle = ballAngleRef.current;
      const currentMod = ((currentAngle % 360) + 360) % 360;
      const forwardOffset = ((targetPocketAngle - currentMod) % 360 + 360) % 360;
      const fullRotations = 7 * 360; // 7 fast turns
      const totalDelta = fullRotations + forwardOffset;
      const finalAngle = currentAngle + totalDelta;

      const duration = 4300; // 4.3 seconds
      const startTime = performance.now();
      let lastTickAngle = currentAngle;
      let hasPlayedDropSound = false;

      const updatePhysics = (now: number) => {
        const elapsed = now - startTime;
        const u = Math.min(1, elapsed / duration);

        // Smooth physical deceleration curve: 1 - (1 - u)^2.5
        const progress = 1 - Math.pow(1 - u, 2.5);
        const currentBallAngle = currentAngle + totalDelta * progress;
        ballAngleRef.current = currentBallAngle;

        // Radius curve: outer rim (170) -> drops inward to pocket track (125)
        let radius = 170;
        if (u > 0.62) {
          // Spiraling inward from 170 down to 125
          const dropProgress = Math.min(1, (u - 0.62) / 0.26);
          const smoothDrop = 3 * dropProgress * dropProgress - 2 * dropProgress * dropProgress * dropProgress;
          radius = 170 - (170 - 125) * smoothDrop;

          // Sound trigger when ball hits frets
          if (!hasPlayedDropSound) {
            hasPlayedDropSound = true;
            soundEngine.playBallDrop();
          }
        }

        // Pocket fret bounce vibration at the very end
        if (u > 0.88 && u < 1) {
          const bounceProgress = (u - 0.88) / 0.12;
          const bounce = Math.sin(bounceProgress * Math.PI * 3) * (1 - bounceProgress) * 3;
          radius += bounce;
        }

        // Ticking sound as ball passes frets
        if (currentBallAngle - lastTickAngle >= 14 && u < 0.75) {
          lastTickAngle = currentBallAngle;
          soundEngine.playRouletteTick(1 + Math.random() * 0.2);
        }

        // Calculate ball coordinates
        const main = getCoords(currentBallAngle, radius);
        const trail1 = getCoords(currentBallAngle - 9, radius);
        const trail2 = getCoords(currentBallAngle - 18, radius);

        setBallState({
          x: main.x,
          y: main.y,
          trail1X: trail1.x,
          trail1Y: trail1.y,
          trail2X: trail2.x,
          trail2Y: trail2.y,
          isFast: u < 0.55,
        });

        if (u < 1) {
          animFrameRef.current = requestAnimationFrame(updatePhysics);
        } else {
          // Exactly at target pocket
          const finalCoords = getCoords(finalAngle, 125);
          ballAngleRef.current = finalAngle;
          setBallState({
            x: finalCoords.x,
            y: finalCoords.y,
            trail1X: finalCoords.x,
            trail1Y: finalCoords.y,
            trail2X: finalCoords.x,
            trail2Y: finalCoords.y,
            isFast: false,
          });
          onSpinComplete();
        }
      };

      animFrameRef.current = requestAnimationFrame(updatePhysics);

      return () => {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }
    prevIsSpinningRef.current = isSpinning;
  }, [isSpinning, targetNumber]);

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Outer Mahogany & Brass Wheel Bezel (Stationary Table Mount) */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full p-2.5 bg-gradient-to-tr from-[#140c07] via-[#2c1b10] to-[#110a05] border-4 border-[#c5a059] shadow-[0_20px_50px_rgba(0,0,0,0.95),inset_0_2px_10px_rgba(255,255,255,0.2)] flex items-center justify-center select-none">
        {/* Brass Inner Rim Line */}
        <div className="absolute inset-2 rounded-full border-2 border-[#d4af37]/50 pointer-events-none" />

        {/* SVG Canvas for Stationary Wheel, Pockets, and Spinning Ball */}
        <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
          <defs>
            <radialGradient id="centerCone" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fff9e6" />
              <stop offset="35%" stopColor="#d4af37" />
              <stop offset="70%" stopColor="#8c6d2d" />
              <stop offset="100%" stopColor="#3d2a0a" />
            </radialGradient>

            <radialGradient id="ballShine" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#faf5eb" />
              <stop offset="85%" stopColor="#e2c176" />
              <stop offset="100%" stopColor="#7a5c1e" />
            </radialGradient>

            <filter id="ballShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.8" />
            </filter>

            <filter id="glowFret" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* STATIONARY WHEEL POCKETS (Wheel is 100% stationary) */}
          <g>
            {/* Outer Track Base Ring */}
            <circle cx="200" cy="200" r="188" fill="#1b120c" stroke="#d4af37" strokeWidth="2" />

            {/* Individual Number Pockets (Static authentic European dial) */}
            {WHEEL_ORDER.map((num, i) => {
              const startAngle = i * anglePerPocket - anglePerPocket / 2;
              const endAngle = (i + 1) * anglePerPocket - anglePerPocket / 2;
              const isRed = RED_NUMBERS.includes(num);
              const isZero = num === 0;
              const isWinningPocket = winningNumber === num && !isSpinning;

              const fillColor = isWinningPocket
                ? '#eab308' // Glowing Gold when ball rests in winning pocket
                : isZero
                ? '#0d6938' // Emerald Green for 0
                : isRed
                ? '#991b1b' // Crimson Red
                : '#141416'; // Obsidian Black

              const r1 = 100; // Inner pocket radius
              const r2 = 184; // Outer pocket radius
              const cx = 200;
              const cy = 200;

              const rad1 = ((startAngle - 90) * Math.PI) / 180;
              const rad2 = ((endAngle - 90) * Math.PI) / 180;

              const x1 = cx + r1 * Math.cos(rad1);
              const y1 = cy + r1 * Math.sin(rad1);
              const x2 = cx + r2 * Math.cos(rad1);
              const y2 = cy + r2 * Math.sin(rad1);
              const x3 = cx + r2 * Math.cos(rad2);
              const y3 = cy + r2 * Math.sin(rad2);
              const x4 = cx + r1 * Math.cos(rad2);
              const y4 = cy + r1 * Math.sin(rad2);

              const pathData = `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 0 0 ${x1} ${y1} Z`;

              // Text coordinates
              const midAngle = ((i * anglePerPocket - 90) * Math.PI) / 180;
              const textR = 152;
              const tx = cx + textR * Math.cos(midAngle);
              const ty = cy + textR * Math.sin(midAngle);
              const textRotation = i * anglePerPocket;

              return (
                <g key={num}>
                  <path
                    d={pathData}
                    fill={fillColor}
                    stroke="#d4af37"
                    strokeWidth={isWinningPocket ? '1.5' : '0.8'}
                    opacity="0.95"
                    filter={isWinningPocket ? 'url(#glowFret)' : undefined}
                  />
                  <text
                    x={tx}
                    y={ty + 4}
                    textAnchor="middle"
                    fill={isWinningPocket ? '#000000' : '#ffffff'}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="'JetBrains Mono', monospace"
                    transform={`rotate(${textRotation} ${tx} ${ty})`}
                    style={{ textShadow: isWinningPocket ? 'none' : '0 1px 2px rgba(0,0,0,0.9)' }}
                  >
                    {num}
                  </text>
                </g>
              );
            })}

            {/* Outer Polished Ball Track Groove */}
            <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Inner Brass Frets Ring */}
            <circle cx="200" cy="200" r="100" fill="none" stroke="#d4af37" strokeWidth="2.5" />

            {/* Brass Center Turret */}
            <circle cx="200" cy="200" r="75" fill="url(#centerCone)" stroke="#ffe49e" strokeWidth="2" />
            <circle cx="200" cy="200" r="42" fill="#2b1e07" stroke="#d4af37" strokeWidth="2" />

            {/* Central Spindle Cone */}
            <circle cx="200" cy="200" r="22" fill="url(#centerCone)" />
            <circle cx="200" cy="200" r="8" fill="#ffffff" opacity="0.8" />

            {/* 4 Monte Carlo Brass Turret Cross Handles */}
            {[0, 90, 180, 270].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 200 200)`}>
                <rect x="197" y="135" width="6" height="50" rx="3" fill="url(#centerCone)" stroke="#7a5b1c" strokeWidth="0.75" />
                <circle cx="200" cy="135" r="7" fill="url(#centerCone)" stroke="#ffe49e" strokeWidth="1" />
              </g>
            ))}
          </g>

          {/* PHYSICAL SPINNING BALL (Direct SVG Coordinate Physics) */}
          <g>
            {/* High-speed motion trail particles */}
            {ballState.isFast && (
              <>
                <circle
                  cx={ballState.trail2X}
                  cy={ballState.trail2Y}
                  r="5"
                  fill="#f4e0a5"
                  opacity="0.3"
                />
                <circle
                  cx={ballState.trail1X}
                  cy={ballState.trail1Y}
                  r="6.5"
                  fill="#ffffff"
                  opacity="0.5"
                />
              </>
            )}

            {/* Main Ivory / Gold Ball */}
            <circle
              cx={ballState.x}
              cy={ballState.y}
              r="7.5"
              fill="url(#ballShine)"
              filter="url(#ballShadow)"
            />
            {/* Specular Highlight */}
            <circle
              cx={ballState.x - 2}
              cy={ballState.y - 2}
              r="2.5"
              fill="#ffffff"
              opacity="0.95"
            />

            {/* Pulsing Target Indicator when settled in winning pocket */}
            {!isSpinning && winningNumber !== null && (
              <circle
                cx={ballState.x}
                cy={ballState.y}
                r="13"
                fill="none"
                stroke="#fde047"
                strokeWidth="1.5"
                className="animate-ping opacity-75"
              />
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};

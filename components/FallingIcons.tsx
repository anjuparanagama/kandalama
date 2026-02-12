'use client';

import { useEffect, useState } from 'react';
import { Building2, Building, Home as HomeIcon, Square } from 'lucide-react';

interface FallingIcon {
  id: number;
  icon: React.ReactNode;
  left: number;
  delay: number;
  duration: number;
}

export default function FallingIcons() {
  const [icons, setIcons] = useState<FallingIcon[]>([]);

  useEffect(() => {
    // Generate random falling icons
    const generateIcons = () => {
      const iconComponents = [
        <HomeIcon key="home" className="w-8 h-8 md:w-12 md:h-12" />,
        <Building key="building" className="w-8 h-8 md:w-12 md:h-12" />,
        <Building2 key="building2" className="w-8 h-8 md:w-12 md:h-12" />,
        <Square key="square" className="w-8 h-8 md:w-12 md:h-12" />,
      ];

      const newIcons: FallingIcon[] = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        icon: iconComponents[Math.floor(Math.random() * iconComponents.length)],
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 8 + Math.random() * 4,
      }));

      setIcons(newIcons);
    };

    generateIcons();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item) => (
        <div
          key={item.id}
          className="absolute animate-fall opacity-40 text-white/40"
          style={{
            left: `${item.left}%`,
            animation: `fall ${item.duration}s linear ${item.delay}s infinite`,
            top: '-50px',
          }}
        >
          {item.icon}
        </div>
      ))}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-fall {
          animation: fall 8s linear infinite;
        }
      `}</style>
    </div>
  );
}

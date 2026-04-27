import React from 'react';
import { SceneData, Hotspot } from '../gameState';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Key, Lock, DoorOpen, Flashlight, Wrench, FileText } from 'lucide-react';

interface SceneProps {
    scene: SceneData;
    onHotspotClick: (hotspot: Hotspot) => void;
    inventory: string[];
    usedItems: string[];
    solvedPuzzles: string[];
}

export default function Scene({ scene, onHotspotClick, inventory, usedItems, solvedPuzzles }: SceneProps) {
    
    const getHotspotIcon = (hotspot: Hotspot, isSolved: boolean) => {
        if (hotspot.type === 'puzzle' && isSolved) {
            return <DoorOpen size={24} className="text-white drop-shadow-md opacity-80" />;
        }
        switch (hotspot.icon) {
            case 'back': return <ArrowDown size={32} className="text-white drop-shadow-md animate-pulse opacity-80 group-hover:opacity-100 transition-opacity" />;
            case 'forward': return <ArrowUp size={32} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity" />;
            case 'left': return <ArrowLeft size={32} className="text-white drop-shadow-md animate-pulse opacity-80 group-hover:opacity-100 transition-opacity" />;
            case 'right': return <ArrowRight size={32} className="text-white drop-shadow-md animate-pulse opacity-80 group-hover:opacity-100 transition-opacity" />;
            case 'note': return <FileText size={24} className="text-[#c4b5a2] opacity-80 drop-shadow-[2px_4px_3px_rgba(0,0,0,0.9)] rotate-[10deg]" style={{ transform: 'perspective(100px) rotateX(20deg) rotateZ(10deg)' }} />;
            case 'key': return <Key size={24} className="text-[#a08b5c] opacity-80 drop-shadow-[2px_4px_2px_rgba(0,0,0,0.9)] rotate-[65deg]" style={{ transform: 'perspective(100px) rotateX(40deg) rotateZ(65deg)' }} />;
            case 'lock': return <Lock size={24} className="text-neutral-400 drop-shadow-md" />;
            case 'flashlight': return <Flashlight size={24} className="text-neutral-400 opacity-80 drop-shadow-[2px_4px_2px_rgba(0,0,0,0.9)]" style={{ transform: 'perspective(100px) rotateX(40deg) rotateZ(105deg)' }} />;
            case 'crowbar': return <Wrench size={24} className="text-[#5a6268] opacity-90 drop-shadow-[2px_4px_3px_rgba(0,0,0,0.9)]" style={{ transform: 'perspective(100px) rotateX(10deg) rotateZ(35deg)' }} />;
            default: return <div className="w-4 h-4 bg-white/50 rounded-full animate-ping"></div>;
        }
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-black aberration-layer">
            <img 
                src={scene.imageUrl} 
                alt={scene.title} 
                className={`absolute inset-0 w-full h-full ${
                    scene.id === 'dark_clearing' 
                        ? 'brightness-[1.0] contrast-[1.1] grayscale object-cover'
                        : scene.id === 'abandoned_shack'
                        ? 'brightness-[1.0] contrast-[1.1] grayscale object-cover'
                        : scene.id === 'inside_shack'
                        ? 'brightness-[0.8] contrast-[1.2] grayscale object-cover'
                        : scene.id === 'hidden_lake'
                        ? 'brightness-[0.85] contrast-[1.1] grayscale sepia-[0.1] object-cover'
                        : 'brightness-[0.55] contrast-[1.3] grayscale sepia-[0.2] hue-rotate-[180deg] object-cover'
                }`} 
                style={scene.id === 'abandoned_shack' ? { transform: 'scale(1.15)', transformOrigin: 'center' } : {}}
                referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black opacity-30 mix-blend-multiply pointer-events-none"></div>

            {scene.hotspots.map(hotspot => {
                // If it's an item hotspot and the item is currently in inventory OR was permanently used, hide it.
                if (hotspot.type === 'item' && hotspot.itemId && (inventory.includes(hotspot.itemId) || usedItems.includes(hotspot.itemId))) {
                    return null;
                }

                // If the scene is dark and this hotspot requires light but the user lacks the flashlight, hide it
                if (scene.isDark && hotspot.requiresLight && !inventory.includes('Flashlight')) {
                    return null;
                }

                // If puzzle is solved, we keep it here to allow transition to targetSceneId.
                const isSolved = hotspot.type === 'puzzle' && hotspot.puzzleId ? solvedPuzzles.includes(hotspot.puzzleId) : false;

                return (
                    <div
                        key={hotspot.id}
                        className="hotspot absolute flex items-center justify-center group"
                        style={{
                            left: `${hotspot.x}%`,
                            top: `${hotspot.y}%`,
                            width: `${hotspot.width || 10}%`,
                            height: `${hotspot.height || 10}%`,
                        }}
                        onClick={() => onHotspotClick(hotspot)}
                        title={isSolved && hotspot.type === 'puzzle' ? 'Enter' : hotspot.label}
                    >
                        <div className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300`}>
                            {getHotspotIcon(hotspot, isSolved)}
                            {hotspot.type !== 'item' && hotspot.icon !== 'back' && hotspot.icon !== 'left' && hotspot.icon !== 'right' && (
                                <span className={`text-[10px] uppercase tracking-[0.2em] text-[#d4c5b9] text-center drop-shadow-[0_2px_4px_rgba(0,0,0,1)] select-none px-2 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-500`} style={{ fontFamily: '"Cinzel", serif', textShadow: '0 0 5px rgba(200, 0, 0, 0.5)' }}>
                                    {isSolved && hotspot.type === 'puzzle' ? 'Enter' : hotspot.label}
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

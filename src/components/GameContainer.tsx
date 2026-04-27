import React, { useState, useEffect, useRef } from 'react';
import Scene from './Scene';
import Inventory from './Inventory';
import { SCENES, INITIAL_SCENE, Hotspot } from '../gameState';
import { Volume2, VolumeX } from 'lucide-react';

export default function GameContainer() {
  const [currentSceneId, setCurrentSceneId] = useState(INITIAL_SCENE);
  const [inventory, setInventory] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [usedItems, setUsedItems] = useState<string[]>([]);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  const [visitedLocations, setVisitedLocations] = useState<string[]>([INITIAL_SCENE]);
  const [message, setMessage] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [audioMuted, setAudioMuted] = useState(true);

  // Audio Context placeholder using experimental Web Audio API generators for low rumble
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  // Handle ambient audio initialization and toggling
  useEffect(() => {
    if (!ambientAudioRef.current) {
        ambientAudioRef.current = new Audio("/loop_ambience_dark_forest.flac");
        ambientAudioRef.current.loop = true;
        ambientAudioRef.current.volume = 0.5;
    }

    if (!audioMuted) {
        // Init AudioContext for SFX if needed
        if (!audioCtxRef.current) {
            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContextClass) {
                    audioCtxRef.current = new AudioContextClass();
                }
            } catch (err) {
                console.error("Audio Context setup failed:", err);
            }
        }
        
        // Start playing the external ambient track
        ambientAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else {
        // Pause ambient track when muted
        ambientAudioRef.current.pause();
    }
  }, [audioMuted]);

  // Cleanup on unmount
  useEffect(() => {
      return () => {
          if (ambientAudioRef.current) {
              ambientAudioRef.current.pause();
              ambientAudioRef.current.currentTime = 0;
          }
          if (audioCtxRef.current) {
              audioCtxRef.current.close().catch(console.error);
              audioCtxRef.current = null;
          }
      };
  }, []);

  const playPickupSound = () => {
        if (audioMuted || !pickupAudioRef.current) return;
        pickupAudioRef.current.currentTime = 0;
        pickupAudioRef.current.play().catch(e => console.error("Pickup sound failed to play", e));
  };

  const transitionAudioRef = useRef<HTMLAudioElement | null>(null);
  const pickupAudioRef = useRef<HTMLAudioElement | null>(null);
  const lockedAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload the transition sound
    transitionAudioRef.current = new Audio("https://cdn.freesound.org/previews/384/384869_984733-hq.mp3");
    transitionAudioRef.current.volume = 0.8;

    pickupAudioRef.current = new Audio("/pick.flac");
    pickupAudioRef.current.volume = 1.0;

    lockedAudioRef.current = new Audio("/locked padlock.flac");
    lockedAudioRef.current.volume = 1.0;
  }, []);

  const playLockedSound = () => {
        if (audioMuted || !lockedAudioRef.current) return;
        lockedAudioRef.current.currentTime = 0;
        lockedAudioRef.current.play().catch(e => console.error("Locked sound failed to play", e));
  };

  const playTransitionSound = () => {
        if (audioMuted || !transitionAudioRef.current) return;
        
        transitionAudioRef.current.currentTime = 0;
        transitionAudioRef.current.play().catch(e => console.error("Transition sound failed to play", e));
  };

  const currentScene = SCENES[currentSceneId];

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (hotspot.type === 'move' && hotspot.targetSceneId) {
      setCurrentSceneId(hotspot.targetSceneId);
      if (!visitedLocations.includes(hotspot.targetSceneId)) {
        setVisitedLocations(prev => [...prev, hotspot.targetSceneId!]);
      }
      setMessage(null);
      playTransitionSound();
    } else if (hotspot.type === 'item' && hotspot.itemId) {
        if (!inventory.includes(hotspot.itemId)) {
            setInventory(prev => [...prev, hotspot.itemId!]);
            setMessage(hotspot.message || `You acquired ${hotspot.itemId}.`);
            playPickupSound();
        } else {
             setMessage('You already have this.');
        }
    } else if (hotspot.type === 'puzzle' && hotspot.puzzleId) {
        if (solvedPuzzles.includes(hotspot.puzzleId)) {
            // Already solved, allow passage
            if (hotspot.targetSceneId) {
                setCurrentSceneId(hotspot.targetSceneId);
                playTransitionSound();
            }
        } else if (hotspot.requiredItem) {
            if (selectedItem === hotspot.requiredItem) {
                setSolvedPuzzles(prev => [...prev, hotspot.puzzleId!]);
                setMessage(`You used the ${hotspot.requiredItem}. The way opens.`);
                
                // Remove the item from inventory once used, unless it's the Flashlight
                if (hotspot.requiredItem !== 'Flashlight') {
                    setInventory(prev => prev.filter(item => item !== hotspot.requiredItem));
                    setUsedItems(prev => [...prev, hotspot.requiredItem!]);
                }
                setSelectedItem(null); // Clear selection

                if (hotspot.targetSceneId) {
                     setTimeout(() => {
                         setCurrentSceneId(hotspot.targetSceneId!);
                         playTransitionSound();
                     }, 2000);
                }
            } else if (selectedItem) {
                setMessage(`The ${selectedItem} has no effect here.`);
                if (hotspot.puzzleId === 'shack_door' || hotspot.puzzleId === 'cellar_hatch') playLockedSound();
            } else if (inventory.includes(hotspot.requiredItem)) {
                setMessage(hotspot.message || "It's locked. Maybe an item from your inventory would work.");
                if (hotspot.puzzleId === 'shack_door' || hotspot.puzzleId === 'cellar_hatch') playLockedSound();
            } else {
                setMessage(hotspot.message || "It's locked. You seem to need something.");
                if (hotspot.puzzleId === 'shack_door' || hotspot.puzzleId === 'cellar_hatch') playLockedSound();
            }
        } else {
             setMessage(hotspot.message || "Something is missing.");
        }
    } else if (hotspot.type === 'note' && hotspot.message) {
        setCurrentNote(hotspot.message);
    }
  };

  const [mousePos, setMousePos] = useState({ x: 400, y: 300 });
  const gameBoxRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
      if (gameBoxRef.current) {
          const rect = gameBoxRef.current.getBoundingClientRect();
          setMousePos({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
          });
      }
  };

  return (
      <div className="relative w-full h-[100dvh] bg-[#020202] flex flex-col justify-center items-center font-mono selection:bg-neutral-800">
          <div className="film-grain"></div>
          <div className="crt-scanlines"></div>
          <div className="vignette animate-flicker pointer-events-none"></div>

          <div className="absolute top-4 right-4 z-50">
             <button 
                onClick={() => setAudioMuted(!audioMuted)} 
                className="p-2 text-neutral-600 hover:text-white transition-colors title='Toggle Ambient Noise'"
             >
                {audioMuted ? <VolumeX size={20} strokeWidth={1.5} /> : <Volume2 size={20} strokeWidth={1.5} />}
             </button>
          </div>

          <div className="relative w-[800px] max-w-[95vw] h-[600px] max-h-[85vh] border border-neutral-800 bg-black shadow-2xl overflow-hidden z-10 flex flex-col">
              <div className="p-4 border-b border-neutral-900 bg-black flex justify-between items-center z-20">
                  <h1 className="text-neutral-400 text-sm tracking-[0.3em] font-bold uppercase">{currentScene.title}</h1>
              </div>

              <div 
                  ref={gameBoxRef}
                  onMouseMove={handleMouseMove}
                  className="relative flex-grow flex items-center justify-center bg-black overflow-hidden select-none"
              >
                  {currentNote && (
                      <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-8 cursor-pointer" onClick={() => setCurrentNote(null)}>
                          <div className="bg-[#e8dcc7] max-w-sm w-full p-8 shadow-[0_0_30px_rgba(0,0,0,1)] border border-[#a08b5c]/30 rounded-sm transform rotate-1 transition-transform">
                              <p className="text-black text-lg leading-relaxed text-center" style={{ fontFamily: '"Cinzel", serif' }}>
                                  {currentNote}
                              </p>
                              <p className="text-[#a08b5c] text-xs text-center mt-6 uppercase tracking-widest">(Click to close)</p>
                          </div>
                      </div>
                  )}

                  <Scene 
                      scene={currentScene} 
                      onHotspotClick={handleHotspotClick} 
                      inventory={inventory} 
                      usedItems={usedItems}
                      solvedPuzzles={solvedPuzzles} 
                  />

                  {currentScene.isDark && (
                      <div 
                          className="pointer-events-none absolute inset-0 z-30 transition-all duration-700 ease-in-out"
                          style={
                              inventory.includes('Flashlight') 
                                  ? { background: `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.85) 100%)` }
                                  : { background: 'rgba(0,0,0,0.78)' }
                          }
                      ></div>
                  )}
              </div>

              <div className="h-32 p-4 border-t border-neutral-900 bg-black flex flex-col justify-between z-20 relative shadow-[0_-10px_20px_rgba(0,0,0,0.8)]">
                  <div className="min-h-[3rem] pt-1">
                      {message ? (
                          <p className="text-neutral-300 text-sm italic animate-pulse">{message}</p>
                      ) : (
                          <p className="text-neutral-500 text-sm leading-relaxed max-w-2xl">{currentScene.description}</p>
                      )}
                  </div>
              </div>
          </div>
          
          {/* Inventory moved outside the game frame */}
          <div className="z-10 mt-4 w-[800px] max-w-[95vw] flex justify-start">
               <Inventory 
                   items={inventory} 
                   selectedItem={selectedItem}
                   onSelectItem={(item) => setSelectedItem(prev => prev === item ? null : item)} 
               />
          </div>
      </div>
  );
}

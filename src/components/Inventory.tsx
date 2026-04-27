import React from 'react';
import { Key, Flashlight, Wrench } from 'lucide-react';

interface InventoryProps {
    items: string[];
    selectedItem: string | null;
    onSelectItem: (item: string) => void;
}

export default function Inventory({ items, selectedItem, onSelectItem }: InventoryProps) {
    const getItemIcon = (itemName: string) => {
        switch (itemName) {
            case 'Rusty Key':
                return <Key size={20} className="text-[#a08b5c] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />;
            case 'Flashlight':
                return <Flashlight size={20} className="text-neutral-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />;
            case 'Crowbar':
                return <Wrench size={20} className="text-[#5a6268] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />;
            default:
                return <div className="w-3 h-3 bg-white/50 rounded-full"></div>;
        }
    };

    return (
        <div className="flex gap-4 items-center h-[40px] justify-start w-full">
            {items.map((item, index) => (
                <div 
                   key={`${item}-${index}`} 
                   onClick={() => onSelectItem(item)}
                   className={`relative flex items-center justify-center w-10 h-10 border ${selectedItem === item ? 'border-[#a08b5c] bg-black shadow-[0_0_10px_rgba(160,139,92,0.4)]' : 'border-neutral-700/50 bg-gradient-to-b from-neutral-900 to-black hover:border-neutral-500'} rounded-sm shadow-inner group transition-all cursor-pointer shrink-0`}
                >
                    {getItemIcon(item)}
                    
                    {/* Hover tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        <span className="text-[10px] text-[#e0d6cb] bg-black border border-neutral-800 px-3 py-1 uppercase tracking-[0.2em] shadow-lg" style={{ fontFamily: '"Cinzel", serif' }}>
                            {item}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}


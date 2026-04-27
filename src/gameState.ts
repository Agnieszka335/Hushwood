export type HotspotType = 'move' | 'item' | 'puzzle' | 'note';
export type HotspotIcon = 'forward' | 'back' | 'left' | 'right' | 'key' | 'lock' | 'door' | 'flashlight' | 'crowbar' | 'note';

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  targetSceneId?: string;
  requiredItem?: string;
  type: HotspotType;
  label: string;
  itemId?: string;
  message?: string;
  puzzleId?: string;
  icon?: HotspotIcon;
  requiresLight?: boolean;
}

export interface SceneData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isDark?: boolean;
  hotspots: Hotspot[];
}

export const INITIAL_SCENE = 'forest_entrance';

export const SCENES: Record<string, SceneData> = {
  forest_entrance: {
    id: 'forest_entrance',
    title: 'Forest Entrance',
    description: 'The tall, decaying trees loom over you. The path forward is barely visible in the oppressive darkness.',
    imageUrl: 'https://picsum.photos/seed/scaryforest/800/600?grayscale',
    hotspots: [
      {
        id: 'move_clearing',
        x: 70,
        y: 50,
        width: 20,
        height: 20,
        type: 'move',
        targetSceneId: 'dark_clearing',
        label: 'Walk deeper',
        icon: 'forward'
      },
      {
        id: 'item_rusty_key',
        x: 70,
        y: 85,
        width: 10,
        height: 10,
        type: 'item',
        itemId: 'Rusty Key',
        label: 'Rusty Key',
        message: 'You picked up a Rusty Key. It feels cold and jagged.',
        icon: 'key'
      }
    ]
  },
  dark_clearing: {
    id: 'dark_clearing',
    title: 'Dark Clearing',
    description: 'A small opening in the canopy lets in a sliver of pale moonlight. A dilapidated shack sits in the distance.',
    imageUrl: '/dark-clearing.jpg',
    hotspots: [
      {
        id: 'move_entrance',
        x: 45,
        y: 85,
        width: 10,
        height: 10,
        type: 'move',
        targetSceneId: 'forest_entrance',
        label: 'Retreat',
        icon: 'back'
      },
      {
        id: 'move_lake',
        x: 5,
        y: 50,
        width: 10,
        height: 10,
        type: 'move',
        targetSceneId: 'hidden_lake',
        label: 'Go left',
        icon: 'left'
      },
      {
        id: 'move_shack',
        x: 55,
        y: 55,
        width: 15,
        height: 20,
        type: 'move',
        targetSceneId: 'abandoned_shack',
        label: 'Approach shack',
        icon: 'forward'
      },
      {
        id: 'item_flashlight',
        x: 20,
        y: 85,
        width: 10,
        height: 15,
        type: 'item',
        itemId: 'Flashlight',
        label: 'Old Flashlight',
        message: 'A heavy metal flashlight. It still has batteries.',
        icon: 'flashlight'
      },
      {
        id: 'move_well',
        x: 85,
        y: 60,
        width: 10,
        height: 15,
        type: 'move',
        targetSceneId: 'deep_well',
        label: 'Go right',
        icon: 'right'
      }
    ]
  },
  deep_well: {
    id: 'deep_well',
    title: 'Deep Well',
    description: 'An old stone well sits alone. The trees around it seem to lean inwards, listening.',
    imageUrl: 'https://picsum.photos/seed/cursedwell/800/600?grayscale',
    isDark: true,
    hotspots: [
      {
        id: 'move_clearing',
        x: 45,
        y: 85,
        width: 10,
        height: 10,
        type: 'move',
        targetSceneId: 'dark_clearing',
        label: 'Turn back',
        icon: 'back'
      },
      {
        id: 'note_well',
        x: 48,
        y: 65,
        width: 10,
        height: 10,
        type: 'note',
        label: 'Read note',
        message: 'The trees... they never blink. Every rustle is a whisper. Don\'t look up, it only makes them hungry.',
        icon: 'note'
      }
    ]
  },
  abandoned_shack: {
    id: 'abandoned_shack',
    title: 'Abandoned Shack',
    description: 'The wooden planks rot with age. The door is heavily padlocked.',
    imageUrl: '/abandoned-shack.jpg',
    isDark: true,
    hotspots: [
      {
        id: 'move_clearing',
        x: 45,
        y: 85,
        width: 10,
        height: 10,
        type: 'move',
        targetSceneId: 'dark_clearing',
        label: 'Walk away',
        icon: 'back'
      },
      {
        id: 'puzzle_shack_door',
        x: 53,
        y: 50,
        width: 15,
        height: 30,
        type: 'puzzle',
        puzzleId: 'shack_door',
        requiredItem: 'Rusty Key',
        targetSceneId: 'inside_shack',
        label: 'Padlocked Door',
        message: 'The door is locked tight. A rusty padlock secures it.',
        icon: 'lock',
        requiresLight: true
      }
    ]
  },
  inside_shack: {
    id: 'inside_shack',
    title: 'Inside the Shack',
    description: 'There is a small light in the room. A terrible stench fills the air. You sense you are not alone.',
    imageUrl: '/inside-the-shack.jpg',
    isDark: true,
    hotspots: [
      {
         id: 'move_out',
         x: 45,
         y: 85,
         width: 10,
         height: 10,
         type: 'move',
         targetSceneId: 'abandoned_shack',
         label: 'Turn back',
         icon: 'back'
      },
      {
         id: 'move_cellar',
         x: 60,
         y: 75,
         width: 10,
         height: 10,
         type: 'move',
         targetSceneId: 'cellar_door',
         label: 'Inspect floor',
         icon: 'forward'
      }
    ]
  },
  hidden_lake: {
    id: 'hidden_lake',
    title: 'Hidden Lake',
    description: 'A vast lake in the middle of this dense forest? That shouldn\'t be possible... Something is terribly wrong.',
    imageUrl: '/hidden-lake.jpg',
    isDark: true,
    hotspots: [
      {
         id: 'move_dark_clearing',
         x: 45,
         y: 85,
         width: 10,
         height: 10,
         type: 'move',
         targetSceneId: 'dark_clearing',
         label: 'Go back',
         icon: 'back'
      },
      {
         id: 'item_crowbar',
         x: 85,
         y: 85,
         width: 15,
         height: 15,
         type: 'item',
         itemId: 'Crowbar',
         label: 'Rusty Crowbar',
         message: 'You picked up a heavy, rusty crowbar. Looks sturdy enough to pry something open.',
         icon: 'crowbar'
      }
    ]
  },
  cellar_door: {
    id: 'cellar_door',
    title: 'Cellar Hatch',
    description: 'A heavy wooden hatch is set into the floorboards. It appears to be nailed shut, but the wood is rotting.',
    imageUrl: 'https://picsum.photos/seed/cellarhatch/800/600?grayscale',
    isDark: true,
    hotspots: [
      {
         id: 'move_inside_shack',
         x: 45,
         y: 85,
         width: 10,
         height: 10,
         type: 'move',
         targetSceneId: 'inside_shack',
         label: 'Go back',
         icon: 'back'
      },
      {
         id: 'puzzle_cellar_hatch',
         x: 30,
         y: 60,
         width: 20,
         height: 20,
         type: 'puzzle',
         puzzleId: 'cellar_hatch',
         requiredItem: 'Crowbar',
         targetSceneId: 'secret_basement',
         label: 'Nailed Hatch',
         message: 'The hatch is solidly nailed to the floor. You need something with a lot of leverage to pry it open.',
         icon: 'lock'
      }
    ]
  },
  secret_basement: {
    id: 'secret_basement',
    title: 'Secret Basement',
    description: 'You drop down into the freezing abyss. The air is thick with dust and ancient secrets. To be continued...',
    imageUrl: 'https://picsum.photos/seed/darkbasement/800/600?grayscale',
    isDark: true,
    hotspots: [
      {
         id: 'move_cellar_door_up',
         x: 45,
         y: 80,
         width: 10,
         height: 10,
         type: 'move',
         targetSceneId: 'inside_shack',
         label: 'Climb out',
         icon: 'back'
      }
    ]
  }
};

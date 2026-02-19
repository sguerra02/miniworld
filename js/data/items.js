const ITEM_DATA = {
    // Consumables
    berries: {
        id: 'berries',
        name: 'Wild Berries',
        description: 'Fresh berries that satisfy hunger and restore a little health.',
        stackable: true,
        consumable: true,
        color: '#ff6b6b',
        effects: {
            heal: 10,
            hunger: 15
        }
    },
    
    water_skin: {
        id: 'water_skin',
        name: 'Water Skin',
        description: 'A leather container filled with fresh water.',
        stackable: true,
        consumable: true,
        color: '#48dbfb',
        effects: {
            thirst: 30
        }
    },
    
    // Weapons
    iron_sword: {
        id: 'iron_sword',
        name: 'Iron Sword',
        description: 'A sturdy iron blade. Reliable in combat.',
        equippable: true,
        slot: 'weapon',
        damage: 25,
        color: '#c0c0c0',
        stats: {
            speed: 0.5 // Bonus speed
        }
    },
    
    ancient_blade: {
        id: 'ancient_blade',
        name: 'Ancient Blade',
        description: 'Found in the Sunken Cathedral. It hums with forgotten power.',
        equippable: true,
        slot: 'weapon',
        damage: 45,
        color: '#6c5ce7',
        stats: {
            speed: 1
        },
        lore: 'Forged in the Age of Stars, this blade was wielded by the last Lumina knight.'
    },
    
    // Armor
    leather_armor: {
        id: 'leather_armor',
        name: 'Leather Armor',
        description: 'Tough leather that offers decent protection.',
        equippable: true,
        slot: 'armor',
        color: '#8b4513',
        stats: {
            defense: 10,
            health: 20
        }
    },
    
    // Quest items
    hymn_of_dawn: {
        id: 'hymn_of_dawn',
        name: 'Hymn of Dawn',
        description: 'Ancient sheet music. The notes seem to glow softly.',
        stackable: false,
        consumable: false,
        color: '#feca57',
        questItem: true,
        lore: 'The first of three hymns. It speaks of light piercing eternal darkness.'
    }
};
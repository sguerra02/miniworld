const QUEST_DATA = {
    // Main story quests
    echoes_of_past: {
        id: 'echoes_of_past',
        name: 'Echoes of the Past',
        type: 'main',
        level: 1,
        description: 'The Elder Guardian in the Sunken Cathedral speaks of ancient hymns. Find the three lost hymns of the Lumina Order to prove yourself worthy.',
        prerequisites: [],
        objectives: [
            {
                id: 'hymn_dawn',
                type: 'collect',
                description: 'Find the Hymn of Dawn',
                itemId: 'hymn_of_dawn',
                target: 1,
                progress: 0,
                completed: false,
                onComplete: (questSystem, game) => {
                    game.loreKeeper?.discoverLore('hymn_of_dawn');
                }
            },
            {
                id: 'hymn_dusk',
                type: 'collect',
                description: 'Find the Hymn of Dusk',
                itemId: 'hymn_of_dusk',
                target: 1,
                progress: 0,
                completed: false
            },
            {
                id: 'hymn_night',
                type: 'collect',
                description: 'Find the Hymn of Night',
                itemId: 'hymn_of_night',
                target: 1,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            gold: 500,
            exp: 1000,
            items: [
                {
                    id: 'lumina_medallion',
                    name: 'Lumina Medallion',
                    description: 'A medallion proving you are worthy of Lumina secrets.',
                    equippable: true,
                    slot: 'accessory',
                    stats: {
                        health: 50,
                        defense: 5
                    }
                }
            ],
            reputation: {
                'lumina_order': 50
            },
            unlockDialogue: ['elder_guardian_2', 'rootweaver_advanced']
        },
        onComplete: (questSystem, game) => {
            // Unlock new area
            console.log('Cathedral depths now accessible');
        }
    },
    
    root_tongue: {
        id: 'root_tongue',
        name: 'Learning the Root-Tongue',
        type: 'side',
        level: 2,
        description: 'The Rootweaver in the Whispering Woods has offered to teach you the ancient language of the trees.',
        prerequisites: [
            {
                type: 'quest_completed',
                questId: 'echoes_of_past'
            }
        ],
        objectives: [
            {
                id: 'find_stone',
                type: 'explore',
                description: 'Find the Talking Stone in the northern glade',
                zoneId: 'northern_glade',
                target: 1,
                progress: 0,
                completed: false,
                loreId: 'talking_stone'
            },
            {
                id: 'offer_memory',
                type: 'deliver',
                description: 'Offer a precious memory to the stone',
                itemId: 'root_memory',
                targetNpc: 'talking_stone',
                quantity: 1,
                target: 1,
                progress: 0,
                completed: false
            },
            {
                id: 'listen_secrets',
                type: 'talk',
                description: 'Listen to three secrets from the trees',
                npcId: 'ancient_trees',
                target: 3,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            exp: 750,
            items: [
                {
                    id: 'root_tongue_scroll',
                    name: 'Root-Tongue Scroll',
                    description: 'A scroll containing the basics of the tree language.',
                    consumable: true,
                    effects: {
                        learn_language: 'root_tongue'
                    }
                }
            ],
            reputation: {
                'whispering_woods': 75
            }
        }
    },
    
    // Side quests
    lost_relics: {
        id: 'lost_relics',
        name: 'Lost Relics of the Lumina',
        type: 'side',
        level: 3,
        description: 'The Elder Guardian seeks three ancient relics scattered throughout the cathedral during the Sundering.',
        prerequisites: [
            {
                type: 'quest_completed',
                questId: 'echoes_of_past'
            }
        ],
        objectives: [
            {
                id: 'relic_crown',
                type: 'collect',
                description: 'Find the Crown of Stars',
                itemId: 'crown_of_stars',
                target: 1,
                progress: 0,
                completed: false
            },
            {
                id: 'relic_sceptre',
                type: 'collect',
                description: 'Find the Sceptre of Light',
                itemId: 'sceptre_of_light',
                target: 1,
                progress: 0,
                completed: false
            },
            {
                id: 'relic_orb',
                type: 'collect',
                description: 'Find the Orb of Divination',
                itemId: 'orb_of_divination',
                target: 1,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            gold: 1000,
            exp: 1500,
            items: [
                {
                    id: 'lumina_armor',
                    name: 'Lumina Ceremonial Armor',
                    description: 'Ancient armor that gleams with celestial light.',
                    equippable: true,
                    slot: 'armor',
                    stats: {
                        health: 100,
                        defense: 25
                    }
                }
            ]
        }
    },
    
    starving_spirit: {
        id: 'starving_spirit',
        name: 'The Starving Spirit',
        type: 'side',
        level: 1,
        description: 'A restless spirit in the cathedral crypts yearns for one last meal. Find the offering he remembers from life.',
        prerequisites: [],
        objectives: [
            {
                id: 'find_offering',
                type: 'collect',
                description: 'Find the spirit\'s favorite food (bread and honey)',
                itemId: 'bread_honey',
                target: 1,
                progress: 0,
                completed: false
            },
            {
                id: 'deliver_offering',
                type: 'deliver',
                description: 'Bring the offering to the spirit',
                itemId: 'bread_honey',
                targetNpc: 'starving_spirit',
                quantity: 1,
                target: 1,
                progress: 0,
                completed: false,
                dialogueId: 'spirit_offering'
            }
        ],
        rewards: {
            gold: 200,
            exp: 300,
            items: [
                {
                    id: 'spirit_essence',
                    name: 'Spirit Essence',
                    description: 'The grateful spirit left this behind. It pulses with faint energy.',
                    consumable: true,
                    effects: {
                        reveal_secrets: true
                    }
                }
            ]
        }
    },
    
    root_rot: {
        id: 'root_rot',
        name: 'The Root Rot',
        type: 'side',
        level: 2,
        description: 'The Rootweaver is concerned about a dark corruption spreading through the ancient roots.',
        prerequisites: [
            {
                type: 'quest_completed',
                questId: 'root_tongue'
            }
        ],
        objectives: [
            {
                id: 'investigate_rot',
                type: 'explore',
                description: 'Investigate the source of the rot in the deep woods',
                zoneId: 'deep_woods_corruption',
                target: 1,
                progress: 0,
                completed: false
            },
            {
                id: 'kill_corrupted',
                type: 'kill',
                description: 'Destroy corrupted root creatures',
                enemyId: 'corrupted_root',
                target: 5,
                progress: 0,
                completed: false
            },
            {
                id: 'purify_heart',
                type: 'collect',
                description: 'Collect the Heart of Corruption',
                itemId: 'corruption_heart',
                target: 1,
                progress: 0,
                completed: false
            },
            {
                id: 'return_heart',
                type: 'deliver',
                description: 'Bring the heart to Rootweaver for purification',
                itemId: 'corruption_heart',
                targetNpc: 'Rootweaver',
                quantity: 1,
                target: 1,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            exp: 1200,
            items: [
                {
                    id: 'pure_essence',
                    name: 'Pure Root Essence',
                    description: 'The purified heart of the corruption, now a source of healing.',
                    consumable: true,
                    effects: {
                        heal: 200,
                        buff: 'roots_blessing'
                    }
                }
            ],
            reputation: {
                'whispering_woods': 100
            }
        }
    },
    
    // Repeatable quests
    cathedral_cleanse: {
        id: 'cathedral_cleanse',
        name: 'Cleanse the Cathedral',
        type: 'repeatable',
        level: 1,
        description: 'The cathedral attracts dark spirits. Help keep them at bay.',
        objectives: [
            {
                id: 'cleanse_spirits',
                type: 'kill',
                description: 'Defeat restless spirits in the cathedral',
                enemyId: 'restless_spirit',
                target: 10,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            gold: 100,
            exp: 200,
            items: [
                {
                    id: 'spiritual_essence',
                    name: 'Spiritual Essence',
                    description: 'Remnants of purified spirits.',
                    stackable: true
                }
            ]
        }
    },
    
    wood_gathering: {
        id: 'wood_gathering',
        name: 'Gather Ancient Wood',
        type: 'repeatable',
        level: 1,
        description: 'The villagers need ancient wood for their crafts.',
        objectives: [
            {
                id: 'gather_wood',
                type: 'collect',
                description: 'Collect ancient wood from the Whispering Woods',
                itemId: 'ancient_wood',
                target: 5,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            gold: 75,
            exp: 100
        }
    },
    
    // Hidden quests (discovered through exploration)
    forgotten_tomb: {
        id: 'forgotten_tomb',
        name: 'The Forgotten Tomb',
        type: 'hidden',
        level: 3,
        description: 'Deep beneath the cathedral, you discover a sealed tomb. Something ancient rests here.',
        prerequisites: [
            {
                type: 'item',
                itemId: 'ancient_symbol'
            }
        ],
        objectives: [
            {
                id: 'decipher_script',
                type: 'talk',
                description: 'Find someone who can read ancient Lumina script',
                npcId: 'Elder Guardian',
                target: 1,
                progress: 0,
                completed: false,
                dialogueId: 'tomb_script'
            },
            {
                id: 'gather_keys',
                type: 'collect',
                description: 'Gather the three tomb keys',
                itemId: 'tomb_key_fragment',
                target: 3,
                progress: 0,
                completed: false
            },
            {
                id: 'open_tomb',
                type: 'explore',
                description: 'Open the tomb and face what lies within',
                zoneId: 'ancient_tomb',
                target: 1,
                progress: 0,
                completed: false
            },
            {
                id: 'defend_ancient',
                type: 'kill',
                description: 'Defeat the Tomb Guardian',
                enemyId: 'tomb_guardian',
                target: 1,
                progress: 0,
                completed: false
            }
        ],
        rewards: {
            gold: 2000,
            exp: 3000,
            items: [
                {
                    id: 'ancient_crown',
                    name: 'Crown of the First Lumina',
                    description: 'The legendary crown of the founder of the Lumina Order.',
                    equippable: true,
                    slot: 'accessory',
                    stats: {
                        health: 200,
                        mana: 200,
                        defense: 30
                    }
                }
            ],
            lore: 'first_lumina_secrets'
        }
    }
};

// Quest-related item data (add to items.js)
const QUEST_ITEMS = {
    hymn_of_dawn: {
        id: 'hymn_of_dawn',
        name: 'Hymn of Dawn',
        description: 'Ancient sheet music. The notes seem to glow softly.',
        questItem: true,
        lore: 'The first hymn speaks of light piercing eternal darkness.'
    },
    hymn_of_dusk: {
        id: 'hymn_of_dusk',
        name: 'Hymn of Dusk',
        description: 'Melancholy notes that speak of endings and transitions.',
        questItem: true,
        lore: 'The second hymn tells of the twilight between worlds.'
    },
    hymn_of_night: {
        id: 'hymn_of_night',
        name: 'Hymn of Night',
        description: 'Comforting melodies that embrace the darkness.',
        questItem: true,
        lore: 'The final hymn reveals that night is not an enemy, but a blanket.'
    },
    lumina_medallion: {
        id: 'lumina_medallion',
        name: 'Lumina Medallion',
        description: 'A medallion proving you are worthy of Lumina secrets.',
        equippable: true,
        slot: 'accessory',
        stats: {
            health: 50,
            defense: 5
        }
    },
    crown_of_stars: {
        id: 'crown_of_stars',
        name: 'Crown of Stars',
        description: 'A crown that seems to hold a piece of the night sky.',
        questItem: true,
        lore: 'Worn by the High Priestess during celestial ceremonies.'
    },
    sceptre_of_light: {
        id: 'sceptre_of_light',
        name: 'Sceptre of Light',
        description: 'A sceptre that can summon beams of pure light.',
        questItem: true
    },
    orb_of_divination: {
        id: 'orb_of_divination',
        name: 'Orb of Divination',
        description: 'A crystal orb that shows glimpses of possible futures.',
        questItem: true
    },
    bread_honey: {
        id: 'bread_honey',
        name: 'Bread with Honey',
        description: 'Fresh bread drizzled with wild honey.',
        stackable: true,
        consumable: true,
        effects: {
            heal: 30,
            hunger: 20
        }
    },
    spirit_essence: {
        id: 'spirit_essence',
        name: 'Spirit Essence',
        description: 'The grateful spirit left this behind. It pulses with faint energy.',
        consumable: true,
        effects: {
            reveal_secrets: true,
            buff: 'spirit_sight'
        }
    },
    corruption_heart: {
        id: 'corruption_heart',
        name: 'Heart of Corruption',
        description: 'A pulsing, dark heart that radiates wrongness.',
        questItem: true
    },
    pure_essence: {
        id: 'pure_essence',
        name: 'Pure Root Essence',
        description: 'The purified heart of the corruption, now a source of healing.',
        consumable: true,
        effects: {
            heal: 200,
            buff: 'roots_blessing'
        },
        buff: {
            name: 'Root\'s Blessing',
            duration: 300, // seconds
            stats: {
                health: 50,
                defense: 10,
                speed: 1
            }
        }
    },
    ancient_wood: {
        id: 'ancient_wood',
        name: 'Ancient Wood',
        description: 'Wood from trees that have stood for centuries.',
        stackable: true
    },
    tomb_key_fragment: {
        id: 'tomb_key_fragment',
        name: 'Tomb Key Fragment',
        description: 'A piece of an ancient key. Three must be combined.',
        questItem: true,
        stackable: true
    },
    ancient_crown: {
        id: 'ancient_crown',
        name: 'Crown of the First Lumina',
        description: 'The legendary crown of the founder of the Lumina Order.',
        equippable: true,
        slot: 'accessory',
        stats: {
            health: 200,
            mana: 200,
            defense: 30
        },
        lore:""
    }
};
const DIALOGUE_DATA = {
    // Elder in the Sunken Cathedral
    elder_guardian: {
        id: 'elder_guardian',
        name: 'Elder Guardian',
        startNode: 'greeting',
        nodes: [
            {
                id: 'greeting',
                speaker: 'Elder Guardian',
                text: 'Welcome, traveler, to the Sunken Cathedral. Few venture here since the Great Sundering. What brings you to these hallowed halls?',
                options: [
                    {
                        text: 'Tell me about this place.',
                        nextNode: 'cathedral_history'
                    },
                    {
                        text: 'I seek the Hymn of Dawn.',
                        nextNode: 'hymn_enquiry',
                        condition: {
                            type: 'quest_active',
                            questId: 'echoes_of_past'
                        }
                    },
                    {
                        text: 'I found something strange in the cathedral...',
                        nextNode: 'strange_finding',
                        condition: {
                            type: 'has_item',
                            itemId: 'ancient_symbol'
                        }
                    },
                    {
                        text: 'Goodbye for now.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'cathedral_history',
                speaker: 'Elder Guardian',
                text: 'This cathedral was built in the Age of Stars, when the Lumina Order channeled celestial light. When the Great Sundering came, the earth swallowed it whole. Now it rests here, a tomb of forgotten knowledge.',
                options: [
                    {
                        text: 'What happened to the Lumina Order?',
                        nextNode: 'lumina_fate'
                    },
                    {
                        text: 'Tell me about the hymns.',
                        nextNode: 'hymns_explanation'
                    },
                    {
                        text: 'I should go.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'lumina_fate',
                speaker: 'Elder Guardian',
                text: '*The elder\'s eyes grow distant* They did not perish, child. They simply... faded. Some say they became one with the light they worshipped. On certain nights, you can still hear their prayers echoing through these halls.',
                options: [
                    {
                        text: 'Are any still here?',
                        nextNode: 'lumina_remnants'
                    },
                    {
                        text: 'Fascinating. Tell me more.',
                        nextNode: 'cathedral_history'
                    },
                    {
                        text: 'I must go.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'lumina_remnants',
                speaker: 'Elder Guardian',
                text: 'I am the last. I chose to remain when they ascended, bound by a promise to protect the cathedral\'s secrets until one worthy arrived.',
                options: [
                    {
                        text: 'Worthy of what?',
                        nextNode: 'worthiness_test'
                    },
                    {
                        text: 'Thank you for sharing.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'worthiness_test',
                speaker: 'Elder Guardian',
                text: 'The cathedral has many secrets. Prove yourself by recovering the lost hymns. Begin with the Hymn of Dawn, hidden in the eastern crypts.',
                response: {
                    type: 'quest_accept',
                    questId: 'echoes_of_past',
                    questName: 'Echoes of the Past'
                },
                options: [
                    {
                        text: 'I will find it.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'hymn_enquiry',
                speaker: 'Elder Guardian',
                text: 'Ah, the Hymn of Dawn. You seek to prove yourself worthy of the cathedral\'s secrets. It lies in the eastern crypts, guarded by echoes of the past. Are you prepared?',
                options: [
                    {
                        text: 'I am ready.',
                        nextNode: 'hymn_location_details'
                    },
                    {
                        text: 'I need to prepare first.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'hymn_location_details',
                speaker: 'Elder Guardian',
                text: 'Good. In the eastern crypts, look for a sarcophagus marked with the sun symbol. The hymn rests within, but beware - the echoes will test your resolve.',
                options: [
                    {
                        text: 'Thank you, elder.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'strange_finding',
                speaker: 'Elder Guardian',
                text: '*The elder\'s eyes widen* That symbol... you found this in the cathedral? It bears the mark of the First Lumina. May I see it?',
                options: [
                    {
                        text: 'Show the symbol.',
                        nextNode: 'symbol_reaction',
                        response: {
                            type: 'check_item',
                            itemId: 'ancient_symbol',
                            successNode: 'symbol_identified',
                            failureNode: 'symbol_missing'
                        }
                    },
                    {
                        text: 'Not now.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'symbol_identified',
                speaker: 'Elder Guardian',
                text: 'This is remarkable! This symbol belonged to the High Priestess herself. Where exactly did you find it?',
                options: [
                    {
                        text: 'Near the altar, hidden in a crevice.',
                        nextNode: 'altar_location'
                    },
                    {
                        text: 'I\'d rather not say.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'altar_location',
                speaker: 'Elder Guardian',
                text: 'The altar... of course. She must have hidden it there during the Sundering. Keep it safe. It may open paths you cannot yet imagine.',
                response: {
                    type: 'give_item',
                    item: {
                        id: 'lumina_key',
                        name: 'Lumina Key',
                        description: 'An ancient key that hums with celestial energy.'
                    }
                },
                options: [
                    {
                        text: 'Thank you, elder.',
                        action: 'end'
                    }
                ]
            }
        ],
        onStart: (game, npc) => {
            console.log('Beginning conversation with Elder Guardian');
        }
    },
    
    // Whispering Woods Spirit
    rootweaver: {
        id: 'rootweaver',
        name: 'Rootweaver',
        startNode: 'first_encounter',
        nodes: [
            {
                id: 'first_encounter',
                speaker: 'Rootweaver',
                text: '*A voice like rustling leaves* You walk softly for a two-legs. The woods have whispered of your coming.',
                options: [
                    {
                        text: 'Who are you?',
                        nextNode: 'introduction'
                    },
                    {
                        text: 'What do the woods whisper?',
                        nextNode: 'woods_whispers'
                    },
                    {
                        text: 'I mean no harm.',
                        nextNode: 'peaceful_intent'
                    }
                ]
            },
            {
                id: 'introduction',
                speaker: 'Rootweaver',
                text: 'I am Rootweaver, keeper of memories, tender of the ancient grove. These woods and I are one, our roots intertwined since before your people learned to speak.',
                options: [
                    {
                        text: 'Can you teach me to understand the woods?',
                        nextNode: 'teaching_offer',
                        condition: {
                            type: 'quest_completed',
                            questId: 'echoes_of_past'
                        }
                    },
                    {
                        text: 'The woods are beautiful.',
                        nextNode: 'woods_beauty'
                    },
                    {
                        text: 'I should go.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'woods_whispers',
                speaker: 'Rootweaver',
                text: 'They whisper of change. Of old powers stirring. They speak of you, little two-legs, carrying a piece of the cathedral with you.',
                condition: {
                    type: 'has_item',
                    itemId: 'ancient_symbol'
                },
                options: [
                    {
                        text: 'How do you know about the cathedral?',
                        nextNode: 'root_memory'
                    },
                    {
                        text: 'I must go.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'root_memory',
                speaker: 'Rootweaver',
                text: 'Our roots run deep, child. They touch the foundations of the cathedral, drink from the same waters. We remember its birth, and we remember its fall.',
                options: [
                    {
                        text: 'What else do you remember?',
                        nextNode: 'ancient_memories',
                        response: {
                            type: 'give_item',
                            item: {
                                id: 'root_memory',
                                name: 'Root Memory',
                                description: 'A fragment of ancient knowledge from the Rootweaver.',
                                lore: true
                            }
                        }
                    },
                    {
                        text: 'Fascinating. Goodbye.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'ancient_memories',
                speaker: 'Rootweaver',
                text: 'I remember when the stars sang in harmony with the Lumina. When the cathedral\'s spires touched the clouds. Now I offer you a piece of that memory - may it guide you.',
                options: [
                    {
                        text: 'Thank you, wise one.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'teaching_offer',
                speaker: 'Rootweaver',
                text: 'You have proven yourself in the cathedral. Perhaps you are ready to learn the Root-Tongue. It requires patience and a pure heart.',
                options: [
                    {
                        text: 'I wish to learn.',
                        nextNode: 'root_tongue_test',
                        response: {
                            type: 'quest_accept',
                            questId: 'root_tongue',
                            questName: 'Learning the Root-Tongue'
                        }
                    },
                    {
                        text: 'Perhaps another time.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'root_tongue_test',
                speaker: 'Rootweaver',
                text: 'Then listen closely. Find the Talking Stone in the northern glade. Offer it a memory - something precious you carry. Only then will it speak to you.',
                options: [
                    {
                        text: 'I will find it.',
                        action: 'end'
                    }
                ]
            }
        ]
    },
    
    // Generic NPC dialogue templates
    villager: {
        id: 'villager',
        name: 'Villager',
        startNode: 'greeting',
        nodes: [
            {
                id: 'greeting',
                speaker: 'Villager',
                text: 'Hello there, traveler. Careful in these parts - strange things have been happening since the old cathedral started humming again.',
                options: [
                    {
                        text: 'What kind of strange things?',
                        nextNode: 'strange_events'
                    },
                    {
                        text: 'Where can I find supplies?',
                        nextNode: 'supplies'
                    },
                    {
                        text: 'Goodbye.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'strange_events',
                speaker: 'Villager',
                text: 'Lights in the sky at night. Whispers on the wind. And folks say they\'ve seen ghostly figures walking toward the cathedral ruins.',
                options: [
                    {
                        text: 'Have you seen them yourself?',
                        nextNode: 'personal_account'
                    },
                    {
                        text: 'Thanks for the warning.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'personal_account',
                speaker: 'Villager',
                text: 'Once. At twilight, I saw a figure in ancient robes. They paused, looked right at me, and then faded like morning mist.',
                options: [
                    {
                        text: 'That\'s unsettling.',
                        nextNode: 'advice'
                    },
                    {
                        text: 'I should investigate.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'advice',
                speaker: 'Villager',
                text: 'Be careful if you go poking around. Take these - they might help.',
                response: {
                    type: 'give_item',
                    item: {
                        id: 'berries',
                        name: 'Wild Berries',
                        description: 'Fresh berries that satisfy hunger.',
                        quantity: 3
                    }
                },
                options: [
                    {
                        text: 'Thank you!',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'supplies',
                speaker: 'Villager',
                text: 'Old Martha sells supplies at the eastern edge of town. Tell her I sent you - she might give you a fair price.',
                options: [
                    {
                        text: 'I\'ll look for her.',
                        action: 'end'
                    }
                ]
            }
        ]
    },
    
    // Quest-specific dialogue for Hymn of Dawn discovery
    hymn_of_dawn_ghost: {
        id: 'hymn_of_dawn_ghost',
        name: 'Spectral Guardian',
        startNode: 'appearance',
        nodes: [
            {
                id: 'appearance',
                speaker: 'Spectral Guardian',
                text: '*A translucent figure materializes before you* Who dares disturb the resting place of the Hymn of Dawn?',
                options: [
                    {
                        text: 'I seek the hymn to prove myself worthy.',
                        nextNode: 'test_of_worth'
                    },
                    {
                        text: 'I mean no harm. I\'ll leave.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'test_of_worth',
                speaker: 'Spectral Guardian',
                text: 'Worthy? The living rarely understand what true worth means. Answer me this: What is the dawn?',
                options: [
                    {
                        text: 'The beginning of a new day.',
                        nextNode: 'incorrect_1'
                    },
                    {
                        text: 'Light overcoming darkness.',
                        nextNode: 'correct_path'
                    },
                    {
                        text: 'When the sun rises.',
                        nextNode: 'incorrect_2'
                    }
                ]
            },
            {
                id: 'correct_path',
                speaker: 'Spectral Guardian',
                text: '*The ghost smiles sadly* Yes. Light overcoming darkness. That is what the Lumina believed. You understand. The hymn is yours.',
                response: {
                    type: 'give_item',
                    item: {
                        id: 'hymn_of_dawn',
                        name: 'Hymn of Dawn',
                        description: 'Ancient sheet music. The notes seem to glow softly.',
                        questItem: true
                    }
                },
                options: [
                    {
                        text: 'Thank you, guardian.',
                        nextNode: 'guardian_farewell'
                    }
                ]
            },
            {
                id: 'incorrect_1',
                speaker: 'Spectral Guardian',
                text: 'A simple answer for a simple thought. No, you are not ready.',
                options: [
                    {
                        text: 'Please, give me another chance.',
                        nextNode: 'test_of_worth'
                    },
                    {
                        text: 'You\'re right. I\'ll return.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'incorrect_2',
                speaker: 'Spectral Guardian',
                text: 'You speak only of the physical. The true dawn is within.',
                options: [
                    {
                        text: 'I understand now. It\'s hope.',
                        nextNode: 'correct_path'
                    },
                    {
                        text: 'I need to think on this.',
                        action: 'end'
                    }
                ]
            },
            {
                id: 'guardian_farewell',
                speaker: 'Spectral Guardian',
                text: 'Take the hymn and go. Perhaps now I can finally rest.',
options: [
                    {
                        text: 'Rest well, guardian.',
                        action: 'end'
                    }
                ]
            }
        ]
    }
};

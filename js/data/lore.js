const LORE_DATA = {
    cathedral: {
        name: "The Sunken Cathedral",
        history: "Built by the Lumina Order in the Age of Stars, this cathedral sank during the Great Sundering. " +
                 "It is said that the bells still ring on the night of the Crimson Moon.",
        secrets: "Beneath the altar lies a passage to the Forbidden Archives, where the first Lumina texts are kept.",
        characters: {
            guardian: "A spectral figure in ancient robes who guards the main hall. She was the last High Priestess.",
            echoes: "Faint whispers of choir songs can be heard near the eastern wall."
        },
        quests: [
            {
                id: "echoes_of_past",
                name: "Echoes of the Past",
                description: "Find the three lost hymns of the Lumina Order",
                objectives: ["Find Hymn of Dawn", "Find Hymn of Dusk", "Find Hymn of Night"]
            }
        ]
    },
    
    woods: {
        name: "Whispering Woods",
        history: "These woods predate the first kingdoms. The trees are connected through their roots, sharing secrets across centuries.",
        secrets: "If you press your ear to certain trees, you can hear conversations from distant lands.",
        characters: {
            rootweaver: "An ancient ent-like being who tends to the forest's memory.",
            willows: "Playful spirits that hide travelers' belongings as a game."
        },
        quests: [
            {
                id: "root_tongue",
                name: "Learning the Root-Tongue",
                description: "Prove yourself worthy of understanding the trees' whispers",
                objectives: ["Find the Talking Stone", "Offer a memory to the Rootweaver", "Listen to three secrets"]
            }
        ]
    }
};

// Store discovered lore for player
class LoreKeeper {
    constructor() {
        this.discoveredLore = [];
        this.visitedZones = new Set();
    }
    
    discoverLore(loreId) {
        if (!this.discoveredLore.includes(loreId)) {
            this.discoveredLore.push(loreId);
            this.showLoreNotification(loreId);
        }
    }
    
    showLoreNotification(loreId) {
        // Implementation for showing lore discovery popup
        console.log(`Discovered: ${loreId}`);
    }
}
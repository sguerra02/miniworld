class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tileSize = 32;
        this.tiles = [];
        this.zones = [];
        
        this.generateMap();
        this.defineZones();
    }
    
    generateMap() {
        // Generate basic terrain (0 = walkable, 1 = wall)
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Simple noise-based terrain generation
                if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
                    this.tiles[y][x] = 1; // Border walls
                } else if (Math.random() < 0.1 && x > 5 && y > 5) {
                    this.tiles[y][x] = 1; // Random obstacles
                } else {
                    this.tiles[y][x] = 0; // Walkable
                }
            }
        }
    }
    
    defineZones() {
        this.zones = [
            {
                name: "The Sunken Cathedral",
                description: "Ancient stone pillars rise from the mist. The air hums with forgotten power.",
                x: 10, y: 10,
                width: 20, height: 20,
                lore: LORE_DATA.cathedral
            },
            {
                name: "Whispering Woods",
                description: "Trees with silver leaves whisper secrets to those who listen.",
                x: 40, y: 30,
                width: 25, height: 25,
                lore: LORE_DATA.woods
            }
            // Add more zones as your world expands
        ];
    }
    
    getZoneAt(x, y) {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        
        return this.zones.find(zone => 
            tileX >= zone.x && tileX < zone.x + zone.width &&
            tileY >= zone.y && tileY < zone.y + zone.height
        );
    }
    
    render(ctx, camera) {
        const startCol = Math.floor(camera.x / this.tileSize);
        const endCol = Math.ceil((camera.x + ctx.canvas.width) / this.tileSize);
        const startRow = Math.floor(camera.y / this.tileSize);
        const endRow = Math.ceil((camera.y + ctx.canvas.height) / this.tileSize);
        
        for (let row = Math.max(0, startRow); row < Math.min(this.height, endRow); row++) {
            for (let col = Math.max(0, startCol); col < Math.min(this.width, endCol); col++) {
                const screenX = col * this.tileSize - camera.x;
                const screenY = row * this.tileSize - camera.y;
                
                // Different colors for different terrain types
                if (this.tiles[row][col] === 0) {
                    ctx.fillStyle = '#2a2a3a'; // Walkable
                } else {
                    ctx.fillStyle = '#4a4a6a'; // Wall
                }
                
                ctx.fillRect(screenX, screenY, this.tileSize - 1, this.tileSize - 1);
                
                // Draw zone borders or special markers here
            }
        }
    }
}
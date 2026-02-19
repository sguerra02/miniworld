class CollisionSystem {
    constructor() {
        this.collidables = [];
    }
    
    // Check collision with map tiles
    checkTile(x, y, width, height, map) {
        // Get tile coordinates
        const startCol = Math.floor(x / map.tileSize);
        const endCol = Math.floor((x + width) / map.tileSize);
        const startRow = Math.floor(y / map.tileSize);
        const endRow = Math.floor((y + height) / map.tileSize);
        
        // Check all tiles the entity overlaps
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                // Check bounds
                if (row < 0 || row >= map.height || col < 0 || col >= map.width) {
                    return true; // Outside map = collision
                }
                
                // Check if tile is solid
                if (map.tiles[row][col] === 1) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Check collision between two entities
    checkEntityCollision(entity1, entity2) {
        return (
            entity1.x < entity2.x + entity2.width &&
            entity1.x + entity1.width > entity2.x &&
            entity1.y < entity2.y + entity2.height &&
            entity1.y + entity1.height > entity2.y
        );
    }
    
    // Get collision direction (useful for knockback)
    getCollisionDirection(entity1, entity2) {
        const dx = (entity1.x + entity1.width/2) - (entity2.x + entity2.width/2);
        const dy = (entity1.y + entity1.height/2) - (entity2.y + entity2.height/2);
        
        const angle = Math.atan2(dy, dx);
        return {
            x: Math.cos(angle),
            y: Math.sin(angle),
            angle: angle
        };
    }
    
    // Line of sight check (for enemies/ranged attacks)
    hasLineOfSight(startX, startY, endX, endY, map) {
        const steps = 100; // Resolution of line check
        const dx = (endX - startX) / steps;
        const dy = (endY - startY) / steps;
        
        for (let i = 0; i <= steps; i++) {
            const checkX = startX + dx * i;
            const checkY = startY + dy * i;
            
            // Check tile at this position
            const tileX = Math.floor(checkX / map.tileSize);
            const tileY = Math.floor(checkY / map.tileSize);
            
            if (tileX < 0 || tileX >= map.width || tileY < 0 || tileY >= map.height) {
                return false;
            }
            
            if (map.tiles[tileY][tileX] === 1) {
                return false; // Hit a wall
            }
        }
        
        return true;
    }
    
    // Find all entities within radius
    getEntitiesInRadius(x, y, radius, entities) {
        return entities.filter(entity => {
            const dx = entity.x + entity.width/2 - x;
            const dy = entity.y + entity.height/2 - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= radius;
        });
    }
}
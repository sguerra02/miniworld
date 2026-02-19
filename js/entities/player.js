class Player {
    constructor(x, y, input) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 3;
        this.input = input;
        this.health = 100;
        this.maxHealth = 100;
        this.inventory = [];
        this.currentQuest = null;
    }
    
    update(deltaTime, collision, map) {
        const { dx, dy } = this.input.getMovementDirection();
        
        // Calculate new position
        const newX = this.x + dx * this.speed;
        const newY = this.y + dy * this.speed;
        
        // Check collision before moving
        if (!collision.checkTile(newX, this.y, this.width, this.height, map)) {
            this.x = newX;
        }
        if (!collision.checkTile(this.x, newY, this.width, this.height, map)) {
            this.y = newY;
        }
        
        // Keep player in bounds
        this.x = Math.max(0, Math.min(map.width * map.tileSize - this.width, this.x));
        this.y = Math.max(0, Math.min(map.height * map.tileSize - this.height, this.y));
    }
    
    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Draw player
        ctx.fillStyle = '#4ecdc4';
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        // Draw direction indicator (tiny dot showing where player is facing)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(screenX + this.width/2, screenY + this.height/2, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}
class Camera {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Camera boundaries (optional - can be removed for infinite world)
        this.bounds = {
            minX: 0,
            minY: 0,
            maxX: Infinity,
            maxY: Infinity
        };
        
        // Smooth camera follow
        this.smoothing = 0.1; // Lower = smoother but slower
    }
    
    follow(target) {
        // Calculate target camera position (center on target)
        const targetX = target.x - this.width / 2 + target.width / 2;
        const targetY = target.y - this.height / 2 + target.height / 2;
        
        // Smoothly move camera
        this.x += (targetX - this.x) * this.smoothing;
        this.y += (targetY - this.y) * this.smoothing;
        
        // Apply boundaries
        this.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX - this.width, this.x));
        this.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY - this.height, this.y));
    }
    
    setBounds(minX, minY, maxX, maxY) {
        this.bounds = { minX, minY, maxX, maxY };
    }
    
    // Convert world coordinates to screen coordinates
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }
    
    // Convert screen coordinates to world coordinates (useful for mouse clicks)
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }
    
    // Check if an entity is visible on screen
    isVisible(entity) {
        return (
            entity.x + entity.width > this.x &&
            entity.x < this.x + this.width &&
            entity.y + entity.height > this.y &&
            entity.y < this.y + this.height
        );
    }
    
    // Shake effect for impact/hits
    shake(intensity = 5, duration = 200) {
        this.shaking = true;
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeStart = Date.now();
    }
    
    updateShake() {
        if (this.shaking) {
            const elapsed = Date.now() - this.shakeStart;
            if (elapsed < this.shakeDuration) {
                // Random offset that decreases over time
                const remaining = 1 - (elapsed / this.shakeDuration);
                const currentIntensity = this.shakeIntensity * remaining;
                this.x += (Math.random() - 0.5) * currentIntensity;
                this.y += (Math.random() - 0.5) * currentIntensity;
            } else {
                this.shaking = false;
            }
        }
    }
}
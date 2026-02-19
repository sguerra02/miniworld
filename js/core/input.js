class InputHandler {
    constructor() {
        this.keys = new Set();
        this.mouse = { x: 0, y: 0, clicked: false };
        
        window.addEventListener('keydown', (e) => {
            this.keys.add(e.key.toLowerCase());
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.key.toLowerCase());
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('click', () => {
            this.mouse.clicked = true;
        });
    }
    
    isKeyPressed(key) {
        return this.keys.has(key.toLowerCase());
    }
    
    getMovementDirection() {
        let dx = 0, dy = 0;
        
        if (this.isKeyPressed('w') || this.isKeyPressed('arrowup')) dy -= 1;
        if (this.isKeyPressed('s') || this.isKeyPressed('arrowdown')) dy += 1;
        if (this.isKeyPressed('a') || this.isKeyPressed('arrowleft')) dx -= 1;
        if (this.isKeyPressed('d') || this.isKeyPressed('arrowright')) dx += 1;
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }
        
        return { dx, dy };
    }
}
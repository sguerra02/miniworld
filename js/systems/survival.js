class SurvivalSystem {
    constructor() {
        this.hunger = 100;
        this.thirst = 100;
        this.fatigue = 100;
        
        // Decay rates (per second)
        this.hungerRate = 1;
        this.thirstRate = 1.5;
        this.fatigueRate = 0.5;
    }
    
    update(deltaTime, player) {
        // Convert deltaTime to seconds
        const seconds = deltaTime / 1000;
        
        // Update survival stats
        this.hunger = Math.max(0, this.hunger - this.hungerRate * seconds);
        this.thirst = Math.max(0, this.thirst - this.thirstRate * seconds);
        this.fatigue = Math.max(0, this.fatigue - this.fatigueRate * seconds);
        
        // Apply effects based on survival stats
        if (this.hunger === 0 || this.thirst === 0) {
            player.health = Math.max(0, player.health - 5 * seconds);
        }
        
        if (this.fatigue === 0) {
            player.speed = 1; // Slower when exhausted
        } else {
            player.speed = 3; // Normal speed
        }
    }
    
    eat(amount) {
        this.hunger = Math.min(100, this.hunger + amount);
    }
    
    drink(amount) {
        this.thirst = Math.min(100, this.thirst + amount);
    }
    
    rest(amount) {
        this.fatigue = Math.min(100, this.fatigue + amount);
    }
}
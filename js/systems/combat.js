class CombatSystem {
    constructor() {
        this.attacks = [];
        this.enemies = [];
        this.combatLog = [];
        
        // Damage numbers that float up
        this.damageNumbers = [];
    }
    
    // Create a new attack
    createAttack(attacker, target, weapon) {
        // Calculate damage
        let damage = weapon ? weapon.damage : 10; // Default unarmed damage
        
        // Critical hit chance (10%)
        const isCritical = Math.random() < 0.1;
        if (isCritical) {
            damage *= 2;
        }
        
        // Apply damage to target
        target.health -= damage;
        
        // Create damage number effect
        this.damageNumbers.push({
            x: target.x + target.width/2,
            y: target.y,
            damage: damage,
            isCritical: isCritical,
            life: 1.0 // Fade out
        });
        
        // Log the attack
        this.combatLog.push({
            time: Date.now(),
            attacker: attacker.name || 'Player',
            target: target.name || 'Enemy',
            damage: damage,
            isCritical: isCritical
        });
        
        // Check if target died
        if (target.health <= 0) {
            this.handleDeath(target);
        }
        
        return damage;
    }
    
    // Melee attack in an arc
    meleeSweep(attacker, direction, range = 40, arcDegrees = 90, weapon = null) {
        const hits = [];
        const attackAngle = Math.atan2(direction.y, direction.x);
        const arcRad = (arcDegrees * Math.PI) / 180;
        
        this.enemies.forEach(enemy => {
            // Check if enemy is in range
            const dx = enemy.x + enemy.width/2 - (attacker.x + attacker.width/2);
            const dy = enemy.y + enemy.height/2 - (attacker.y + attacker.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= range) {
                // Check if enemy is within attack arc
                const enemyAngle = Math.atan2(dy, dx);
                const angleDiff = Math.abs(attackAngle - enemyAngle);
                
                // Normalize angle difference
                const normalizedDiff = Math.min(
                    Math.abs(angleDiff), 
                    Math.abs(angleDiff - 2 * Math.PI)
                );
                
                if (normalizedDiff <= arcRad / 2) {
                    const damage = this.createAttack(attacker, enemy, weapon);
                    hits.push({ enemy, damage });
                }
            }
        });
        
        return hits;
    }
    
    // Ranged attack
    rangedAttack(attacker, targetX, targetY, projectileType, collision) {
        const projectile = new Projectile(
            attacker.x + attacker.width/2,
            attacker.y + attacker.height/2,
            targetX,
            targetY,
            projectileType,
            collision
        );
        
        this.attacks.push(projectile);
        return projectile;
    }
    
    // Handle enemy death
    handleDeath(entity) {
        entity.alive = false;
        
        // Drop items
        if (entity.inventory) {
            entity.inventory.forEach(item => {
                // Spawn item pickup
                this.spawnItemDrop(item, entity.x, entity.y);
            });
        }
        
        // Add to combat log
        this.combatLog.push({
            time: Date.now(),
            event: 'death',
            entity: entity.name || 'Enemy'
        });
    }
    
    // Spawn item on ground
    spawnItemDrop(item, x, y) {
        // This will be handled by the game world
        console.log(`Item ${item.name} dropped at ${x}, ${y}`);
    }
    
    update(deltaTime) {
        // Update projectiles
        this.attacks = this.attacks.filter(attack => {
            attack.update(deltaTime);
            return attack.active;
        });
        
        // Update damage numbers (fade out)
        this.damageNumbers = this.damageNumbers.filter(num => {
            num.life -= deltaTime / 1000; // Fade over 1 second
            return num.life > 0;
        });
    }
    
    render(ctx, camera) {
        // Draw projectiles
        this.attacks.forEach(attack => {
            attack.render(ctx, camera);
        });
        
        // Draw damage numbers
        this.damageNumbers.forEach(num => {
            const screenPos = camera.worldToScreen(num.x, num.y - (1 - num.life) * 30);
            
            ctx.font = num.isCritical ? 'bold 20px Arial' : '16px Arial';
            ctx.fillStyle = num.isCritical ? '#ff6b6b' : '#ffffff';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.globalAlpha = num.life;
            
            ctx.fillText(
                num.damage.toString(), 
                screenPos.x - 15, 
                screenPos.y
            );
            
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        });
    }
}

// Projectile class for ranged attacks
class Projectile {
    constructor(startX, startY, targetX, targetY, type, collision) {
        this.x = startX;
        this.y = startY;
        this.width = 8;
        this.height = 8;
        this.speed = type.speed || 10;
        this.damage = type.damage || 20;
        this.color = type.color || '#ff6b6b';
        this.active = true;
        this.collision = collision;
        
        // Calculate direction
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.vx = (dx / distance) * this.speed;
        this.vy = (dy / distance) * this.speed;
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        
        // Check if out of bounds
        if (this.x < 0 || this.x > 5000 || this.y < 0 || this.y > 5000) {
            this.active = false;
        }
    }
    
    render(ctx, camera) {
        const screenPos = camera.worldToScreen(this.x, this.y);
        
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, this.width, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
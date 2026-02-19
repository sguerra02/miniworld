class NPC {
    constructor(x, y, config) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.name = config.name || 'Unknown';
        this.dialogueId = config.dialogueId;
        this.color = config.color || '#9980FA';
        this.interactionRadius = 50;
        this.isInteractable = true;
        
        // NPC behavior
        this.patrolPath = config.patrolPath || null;
        this.patrolIndex = 0;
        this.speed = config.speed || 1;
        this.idleAnimation = config.idleAnimation || 'idle';
        
        // Quest-related
        this.quests = config.quests || [];
        this.hasQuest = this.quests.length > 0;
        
        // Shop (if applicable)
        this.shop = config.shop || null;
    }
    
    update(deltaTime, player, dialogueSystem) {
        // Check if player is within interaction range
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.interactionRadius && player.input.isKeyPressed('e')) {
            this.interact(dialogueSystem);
        }
        
        // Patrol behavior if path exists
        if (this.patrolPath) {
            this.patrol(deltaTime);
        }
    }
    
    interact(dialogueSystem) {
        if (dialogueSystem.isActive) return;
        
        // Check for quest-specific dialogue first
        if (this.hasQuest) {
            const activeQuest = window.game.questSystem.getNPCQuest(this.name);
            if (activeQuest) {
                dialogueSystem.startDialogue(activeQuest.dialogueId, this, window.game);
                return;
            }
        }
        
        // Use default dialogue
        dialogueSystem.startDialogue(this.dialogueId, this, window.game);
    }
    
    patrol(deltaTime) {
        if (!this.patrolPath || this.patrolPath.length === 0) return;
        
        const target = this.patrolPath[this.patrolIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 2) {
            // Reached patrol point
            this.patrolIndex = (this.patrolIndex + 1) % this.patrolPath.length;
        } else {
            // Move toward patrol point
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }
    
    render(ctx, camera) {
        const screenPos = camera.worldToScreen(this.x, this.y);
        
        // Draw NPC
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(screenPos.x, screenPos.y, this.width, this.height);
        ctx.shadowBlur = 0;
        
        // Draw name
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, screenPos.x + this.width/2, screenPos.y - 10);
        
        // Draw quest indicator if applicable
        if (this.hasQuest) {
            ctx.fillStyle = '#feca57';
            ctx.beginPath();
            ctx.arc(screenPos.x + this.width - 5, screenPos.y + 5, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw interaction prompt if player is close
        const player = window.game.player;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.interactionRadius) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '10px Arial';
            ctx.fillText('Press E to talk', screenPos.x + this.width/2, screenPos.y - 25);
        }
    }
}
class QuestSystem {
    constructor() {
        this.activeQuests = [];
        this.completedQuests = [];
        this.failedQuests = [];
        this.questLog = [];
        
        // Quest objectives tracking
        this.objectiveProgress = new Map(); // objectiveId -> progress
        
        // Event listeners for quest triggers
        this.eventListeners = new Map();
        
        // UI state
        this.isOpen = false;
        this.selectedQuest = 0;
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Register default quest event types
        this.registerEventListener('kill', this.onKillEnemy.bind(this));
        this.registerEventListener('collect', this.onCollectItem.bind(this));
        this.registerEventListener('talk', this.onTalkToNPC.bind(this));
        this.registerEventListener('explore', this.onExploreZone.bind(this));
        this.registerEventListener('deliver', this.onDeliverItem.bind(this));
        this.registerEventListener('escort', this.onEscortNPC.bind(this));
        this.registerEventListener('survive', this.onSurviveTime.bind(this));
        this.registerEventListener('craft', this.onCraftItem.bind(this));
    }
    
    registerEventListener(eventType, callback) {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }
        this.eventListeners.get(eventType).push(callback);
    }
    
    acceptQuest(questId) {
        const questData = QUEST_DATA[questId];
        if (!questData) {
            console.error(`Quest ${questId} not found`);
            return false;
        }
        
        // Check prerequisites
        if (!this.checkPrerequisites(questData)) {
            console.log('Prerequisites not met');
            return false;
        }
        
        // Create quest instance
        const quest = {
            id: questId,
            ...questData,
            status: 'active',
            acceptedAt: Date.now(),
            objectives: questData.objectives.map(obj => ({
                ...obj,
                completed: false,
                progress: 0,
                target: obj.target
            }))
        };
        
        this.activeQuests.push(quest);
        this.logQuest(`Accepted: ${quest.name}`);
        
        // Trigger any on-accept events
        if (questData.onAccept) {
            questData.onAccept(this, window.game);
        }
        
        return true;
    }
    
    checkPrerequisites(questData) {
        if (!questData.prerequisites) return true;
        
        const game = window.game;
        
        for (const prereq of questData.prerequisites) {
            switch (prereq.type) {
                case 'quest_completed':
                    if (!this.isQuestCompleted(prereq.questId)) return false;
                    break;
                    
                case 'level':
                    if (game.player.level < prereq.level) return false;
                    break;
                    
                case 'item':
                    if (!game.inventory.items.some(i => i.id === prereq.itemId)) return false;
                    break;
                    
                case 'reputation':
                    if (this.getReputation(prereq.faction) < prereq.value) return false;
                    break;
                    
                case 'lore':
                    if (!game.loreKeeper?.discoveredLore.includes(prereq.loreId)) return false;
                    break;
            }
        }
        
        return true;
    }
    
    updateQuestProgress(questId, objectiveId, progress = 1) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (!quest) return false;
        
        const objective = quest.objectives.find(obj => obj.id === objectiveId);
        if (!objective || objective.completed) return false;
        
        // Update progress
        objective.progress = Math.min(objective.target, objective.progress + progress);
        
        // Check if completed
        if (objective.progress >= objective.target) {
            objective.completed = true;
            this.logQuest(`Objective completed: ${objective.description}`);
            
            // Check if all objectives are completed
            if (quest.objectives.every(obj => obj.completed)) {
                this.completeQuest(questId);
            }
            
            // Trigger objective completion effects
            if (objective.onComplete) {
                objective.onComplete(this, window.game);
            }
        }
        
        return true;
    }
    
    completeQuest(questId) {
        const index = this.activeQuests.findIndex(q => q.id === questId);
        if (index === -1) return false;
        
        const quest = this.activeQuests[index];
        quest.status = 'completed';
        quest.completedAt = Date.now();
        
        // Move to completed quests
        this.activeQuests.splice(index, 1);
        this.completedQuests.push(quest);
        
        // Give rewards
        this.giveQuestRewards(quest);
        
        this.logQuest(`Completed: ${quest.name}`);
        
        // Trigger on-complete events
        if (quest.onComplete) {
            quest.onComplete(this, window.game);
        }
        
        return true;
    }
    
    failQuest(questId, reason) {
        const index = this.activeQuests.findIndex(q => q.id === questId);
        if (index === -1) return false;
        
        const quest = this.activeQuests[index];
        quest.status = 'failed';
        quest.failedAt = Date.now();
        quest.failReason = reason;
        
        this.activeQuests.splice(index, 1);
        this.failedQuests.push(quest);
        
        this.logQuest(`Failed: ${quest.name} - ${reason}`);
        
        return true;
    }
    
    giveQuestRewards(quest) {
        const game = window.game;
        
        if (quest.rewards) {
            // Gold reward
            if (quest.rewards.gold) {
                game.inventory.gold += quest.rewards.gold;
                this.showNotification(`Received ${quest.rewards.gold} gold`);
            }
            
            // Experience reward
            if (quest.rewards.exp) {
                game.player.gainExperience(quest.rewards.exp);
                this.showNotification(`Gained ${quest.rewards.exp} XP`);
            }
            
            // Item rewards
            if (quest.rewards.items) {
                quest.rewards.items.forEach(item => {
                    if (game.inventory.addItem(item)) {
                        this.showNotification(`Received: ${item.name}`);
                    }
                });
            }
            
            // Reputation rewards
            if (quest.rewards.reputation) {
                Object.entries(quest.rewards.reputation).forEach(([faction, value]) => {
                    this.modifyReputation(faction, value);
                });
            }
            
            // Unlock new dialogue options
            if (quest.rewards.unlockDialogue) {
                quest.rewards.unlockDialogue.forEach(dialogueId => {
                    game.dialogue.unlockDialogue(dialogueId);
                });
            }
        }
    }
    
    // Event handlers for quest objectives
    onKillEnemy(event) {
        this.activeQuests.forEach(quest => {
            quest.objectives.forEach(objective => {
                if (objective.type === 'kill' && 
                    (objective.enemyId === event.enemyId || objective.enemyId === 'any') &&
                    !objective.completed) {
                    this.updateQuestProgress(quest.id, objective.id, 1);
                }
            });
        });
    }
    
    onCollectItem(event) {
        this.activeQuests.forEach(quest => {
            quest.objectives.forEach(objective => {
                if (objective.type === 'collect' && 
                    objective.itemId === event.itemId &&
                    !objective.completed) {
                    // Check if we have enough of the item
                    const itemCount = window.game.inventory.items
                        .filter(i => i.id === event.itemId)
                        .reduce((sum, i) => sum + (i.quantity || 1), 0);
                    
                    this.updateQuestProgress(quest.id, objective.id, itemCount);
                }
            });
        });
    }
    
    onTalkToNPC(event) {
        this.activeQuests.forEach(quest => {
            quest.objectives.forEach(objective => {
                if (objective.type === 'talk' && 
                    objective.npcId === event.npcId &&
                    !objective.completed) {
                    this.updateQuestProgress(quest.id, objective.id, 1);
                    
                    // Trigger dialogue if specified
                    if (objective.dialogueId) {
                        window.game.dialogue.startDialogue(objective.dialogueId, event.npc);
                    }
                }
            });
        });
    }
    
    onExploreZone(event) {
        this.activeQuests.forEach(quest => {
            quest.objectives.forEach(objective => {
                if (objective.type === 'explore' && 
                    objective.zoneId === event.zoneId &&
                    !objective.completed) {
                    this.updateQuestProgress(quest.id, objective.id, 1);
                    
                    // Discover lore
                    if (objective.loreId) {
                        window.game.loreKeeper?.discoverLore(objective.loreId);
                    }
                }
            });
        });
    }
    
    onDeliverItem(event) {
        this.activeQuests.forEach(quest => {
            quest.objectives.forEach(objective => {
                if (objective.type === 'deliver' && 
                    objective.itemId === event.itemId &&
                    objective.targetNpc === event.npcId &&
                    !objective.completed) {
                    
                    // Remove item from inventory
                    window.game.inventory.removeItem(event.itemId, objective.quantity || 1);
                    
                    this.updateQuestProgress(quest.id, objective.id, 1);
                }
            });
        });
    }
    
    onSurviveTime(event) {
        this.activeQuests.forEach(quest => {
            quest.objectives.forEach(objective => {
                if (objective.type === 'survive' && !objective.completed) {
                    objective.progress = Math.min(
                        objective.target,
                        objective.progress + event.deltaTime / 1000
                    );
                    
                    if (objective.progress >= objective.target) {
                        objective.completed = true;
                        this.checkQuestCompletion(quest);
                    }
                }
            });
        });
    }
    
    onCraftItem(event) {
        this.activeQuests.forEach(quest => {
            quest.objectives.forEach(objective => {
                if (objective.type === 'craft' && 
                    objective.itemId === event.itemId &&
                    !objective.completed) {
                    this.updateQuestProgress(quest.id, objective.id, event.quantity || 1);
                }
            });
        });
    }
    
    // Helper methods
    isQuestActive(questId) {
        return this.activeQuests.some(q => q.id === questId);
    }
    
    isQuestCompleted(questId) {
        return this.completedQuests.some(q => q.id === questId);
    }
    
    isQuestFailed(questId) {
        return this.failedQuests.some(q => q.id === questId);
    }
    
    getQuestState(questId) {
        if (this.isQuestCompleted(questId)) return 'completed';
        if (this.isQuestActive(questId)) return 'active';
        if (this.isQuestFailed(questId)) return 'failed';
        return 'not_started';
    }
    
    getNPCQuest(npcName) {
        return this.activeQuests.find(quest => 
            quest.objectives.some(obj => 
                obj.type === 'talk' && obj.npcId === npcName
            )
        );
    }
    
    checkQuestCompletion(quest) {
        if (quest.objectives.every(obj => obj.completed)) {
            this.completeQuest(quest.id);
        }
    }
    
    logQuest(message) {
        this.questLog.push({
            timestamp: Date.now(),
            message: message
        });
        
        // Keep log size manageable
        if (this.questLog.length > 50) {
            this.questLog.shift();
        }
        
        console.log(`[Quest] ${message}`);
    }
    
    showNotification(message) {
        // Use existing notification system or create one
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: absolute;
            top: 100px;
            right: 20px;
            background: rgba(108, 92, 231, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            border-left: 4px solid #feca57;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            z-index: 1000;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // UI Methods
    toggleQuestLog() {
        this.isOpen = !this.isOpen;
    }
    
    render(ctx, camera) {
        if (!this.isOpen) return;
        
        // Darken background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw quest log panel
        const panelWidth = 800;
        const panelHeight = 500;
        const panelX = (ctx.canvas.width - panelWidth) / 2;
        const panelY = (ctx.canvas.height - panelHeight) / 2;
        
        // Panel background
        ctx.fillStyle = '#2a2a3a';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.shadowBlur = 0;
        
        // Panel border
        ctx.strokeStyle = '#6c5ce7';
        ctx.lineWidth = 2;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('Quest Journal', panelX + 30, panelY + 50);
        
        // Quest list (left side)
        const listX = panelX + 30;
        const listY = panelY + 100;
        const listWidth = 250;
        
        ctx.strokeStyle = '#4a4a6a';
        ctx.lineWidth = 1;
        ctx.strokeRect(listX - 10, listY - 10, listWidth, panelHeight - 150);
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#feca57';
        ctx.fillText('Active Quests', listX, listY);
        
        // List active quests
        this.activeQuests.forEach((quest, index) => {
            const y = listY + 30 + index * 30;
            
            if (index === this.selectedQuest) {
                ctx.fillStyle = '#6c5ce7';
                ctx.fillRect(listX - 5, y - 15, listWidth - 10, 25);
            }
            
            ctx.fillStyle = index === this.selectedQuest ? '#ffffff' : '#b0b0b0';
            ctx.font = '14px Arial';
            ctx.fillText(quest.name, listX, y);
        });
        
        // Show completed quests count
        if (this.completedQuests.length > 0) {
            ctx.fillStyle = '#4ecdc4';
            ctx.font = '12px Arial';
            ctx.fillText(`${this.completedQuests.length} completed`, listX, listY + panelHeight - 200);
        }
        
        // Quest details (right side)
        if (this.activeQuests[this.selectedQuest]) {
            const quest = this.activeQuests[this.selectedQuest];
            const detailsX = panelX + 300;
            const detailsY = panelY + 100;
            
            // Quest name
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(quest.name, detailsX, detailsY);
            
            // Quest description
            ctx.fillStyle = '#b0b0b0';
            ctx.font = '14px Arial';
            this.wrapText(ctx, quest.description, detailsX, detailsY + 30, 450, 20);
            
            // Objectives
            ctx.fillStyle = '#feca57';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('Objectives:', detailsX, detailsY + 120);
            
            quest.objectives.forEach((obj, index) => {
                const y = detailsY + 150 + index * 25;
                
                // Checkbox
                ctx.strokeStyle = obj.completed ? '#4ecdc4' : '#4a4a6a';
                ctx.lineWidth = 2;
                ctx.strokeRect(detailsX, y - 12, 16, 16);
                
                if (obj.completed) {
                    ctx.fillStyle = '#4ecdc4';
                    ctx.fillRect(detailsX + 2, y - 10, 12, 12);
                }
                
                // Objective text
                ctx.fillStyle = obj.completed ? '#4ecdc4' : '#ffffff';
                ctx.font = '14px Arial';
                
                let text = obj.description;
                if (obj.target > 1) {
                    text += ` (${obj.progress}/${obj.target})`;
                }
                
                ctx.fillText(text, detailsX + 25, y);
            });
            
            // Rewards
            if (quest.rewards) {
                ctx.fillStyle = '#4ecdc4';
                ctx.font = 'bold 16px Arial';
                ctx.fillText('Rewards:', detailsX, detailsY + 150 + quest.objectives.length * 25 + 20);
                
                let rewardY = detailsY + 150 + quest.objectives.length * 25 + 45;
                
                if (quest.rewards.gold) {
                    ctx.fillStyle = '#ffd700';
                    ctx.font = '14px Arial';
                    ctx.fillText(`${quest.rewards.gold} gold`, detailsX, rewardY);
                    rewardY += 20;
                }
                
                if (quest.rewards.exp) {
                    ctx.fillStyle = '#a3ff8f';
                    ctx.font = '14px Arial';
                    ctx.fillText(`${quest.rewards.exp} XP`, detailsX, rewardY);
                    rewardY += 20;
                }
                
                if (quest.rewards.items) {
                    quest.rewards.items.forEach(item => {
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '14px Arial';
                        ctx.fillText(item.name, detailsX, rewardY);
                        rewardY += 20;
                    });
                }
            }
        }
    }
    
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }
    
    handleInput(input) {
        if (input.isKeyPressed('j')) {
            this.toggleQuestLog();
        }
        
        if (!this.isOpen) return;
        
        // Navigate quest list
        if (input.isKeyPressed('arrowdown')) {
            this.selectedQuest = Math.min(this.activeQuests.length - 1, this.selectedQuest + 1);
        }
        if (input.isKeyPressed('arrowup')) {
            this.selectedQuest = Math.max(0, this.selectedQuest - 1);
        }
        
        // Close with J or Escape
        if (input.isKeyPressed('escape')) {
            this.isOpen = false;
        }
    }
}
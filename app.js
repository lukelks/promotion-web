document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Initialize progress bars
    initProgressBars();
    
    // Set up navigation
    setupNavigation();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize form values from localStorage if available
    loadSavedData();
}

function initProgressBars() {
    document.querySelectorAll('.progress-fill').forEach(fill => {
        const width = fill.getAttribute('data-width');
        fill.style.width = `${width}%`;
    });
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-links li');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.section-content').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the selected section
            const sectionId = `${this.getAttribute('data-section')}-section`;
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
            }
        });
    });
}

function setupEventListeners() {
    // Social icons interaction
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            showToast(`Opening ${platform} campaign settings`);
        });
    });
    
    // Budget slider functionality
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    
    if (budgetSlider) {
        budgetSlider.addEventListener('input', function() {
            const value = this.value;
            budgetValue.textContent = `$${Number(value).toLocaleString()}`;
            
            // Update individual platform budgets proportionally
            updatePlatformBudgets(value);
            
            // Save to localStorage
            saveToLocalStorage('totalBudget', value);
        });
    }
    
    // Platform card interactions
    document.querySelectorAll('.platform-card').forEach(card => {
        card.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            showToast(`Configuring ${platform} ad settings`);
        });
    });
    
    // Campaign activation
    const activateBtn = document.getElementById('activateBtn');
    if (activateBtn) {
        activateBtn.addEventListener('click', activateCampaign);
    }
    
    // Launch button
    const launchBtn = document.getElementById('launchBtn');
    if (launchBtn) {
        launchBtn.addEventListener('click', function() {
            showToast('Campaign settings saved');
            saveAllFormData();
        });
    }
    
    // Update strategy button
    const updateStrategyBtn = document.getElementById('updateStrategyBtn');
    if (updateStrategyBtn) {
        updateStrategyBtn.addEventListener('click', function() {
            showToast('Strategy updated successfully');
            saveAllFormData();
        });
    }
    
    // Form field auto-save
    document.querySelectorAll('.form-control').forEach(field => {
        field.addEventListener('change', function() {
            saveAllFormData();
        });
    });
}

function updatePlatformBudgets(totalBudget) {
    const total = parseFloat(totalBudget);
    const platformCards = document.querySelectorAll('.platform-card');
    
    // Calculate sum of current percentages
    let sumPercentages = 0;
    platformCards.forEach(card => {
        const budgetElement = card.querySelector('.platform-budget');
        const currentBudget = parseFloat(budgetElement.textContent);
        sumPercentages += currentBudget / 3050; // Original total was 3050
    });
    
    // Update each platform's budget proportionally
    platformCards.forEach(card => {
        const budgetElement = card.querySelector('.platform-budget');
        const currentBudget = parseFloat(budgetElement.textContent);
        const percentage = (currentBudget / 3050) / sumPercentages;
        const newBudget = Math.round(total * percentage);
        budgetElement.textContent = newBudget;
        
        // Save to localStorage
        const platform = card.getAttribute('data-platform');
        saveToLocalStorage(`${platform}Budget`, newBudget);
    });
}

function activateCampaign() {
    const activateBtn = document.getElementById('activateBtn');
    const originalText = activateBtn.innerHTML;
    
    activateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Launching Campaign...';
    activateBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        activateBtn.innerHTML = '<i class="fas fa-check-circle"></i> Campaign Active';
        activateBtn.classList.remove('btn-primary');
        activateBtn.classList.add('btn-success');
        activateBtn.disabled = false;
        
        showToast('Campaign successfully launched!');
        
        // Save campaign state
        saveToLocalStorage('campaignActive', true);
        saveToLocalStorage('campaignLaunchTime', new Date().toISOString());
    }, 1500);
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';
    
    if (isError) {
        toast.classList.add('error');
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function saveAllFormData() {
    // Save form values to localStorage
    saveToLocalStorage('campaignObjective', document.getElementById('campaignObjective').value);
    saveToLocalStorage('targetAudience', document.getElementById('targetAudience').value);
    saveToLocalStorage('contentStrategy', document.getElementById('contentStrategy').value);
    saveToLocalStorage('postSchedule', document.getElementById('postSchedule').value);
    saveToLocalStorage('complianceStatus', document.getElementById('complianceStatus').value);
    saveToLocalStorage('promoOffer', document.getElementById('promoOffer').value);
    saveToLocalStorage('primaryCta', document.getElementById('primaryCta').value);
    saveToLocalStorage('landingPageUrl', document.getElementById('landingPageUrl').value);
    saveToLocalStorage('utmParams', document.getElementById('utmParams').value);
    
    // Save checkbox states
    saveToLocalStorage('gaEnabled', document.getElementById('ga').checked);
    saveToLocalStorage('pixelEnabled', document.getElementById('pixel').checked);
    saveToLocalStorage('gtmEnabled', document.getElementById('gtm').checked);
}

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(`marketingSystem_${key}`, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function loadSavedData() {
    // Load form values from localStorage
    loadFromLocalStorage('campaignObjective', 'campaignObjective');
    loadFromLocalStorage('targetAudience', 'targetAudience');
    loadFromLocalStorage('contentStrategy', 'contentStrategy');
    loadFromLocalStorage('postSchedule', 'postSchedule');
    loadFromLocalStorage('complianceStatus', 'complianceStatus');
    loadFromLocalStorage('promoOffer', 'promoOffer');
    loadFromLocalStorage('primaryCta', 'primaryCta');
    loadFromLocalStorage('landingPageUrl', 'landingPageUrl');
    loadFromLocalStorage('utmParams', 'utmParams');
    
    // Load checkbox states
    loadCheckboxState('gaEnabled', 'ga');
    loadCheckboxState('pixelEnabled', 'pixel');
    loadCheckboxState('gtmEnabled', 'gtm');
    
    // Load budget data
    const savedBudget = getFromLocalStorage('totalBudget');
    if (savedBudget) {
        document.getElementById('budgetSlider').value = savedBudget;
        document.getElementById('budgetValue').textContent = `$${Number(savedBudget).toLocaleString()}`;
        
        // Load platform budgets
        document.querySelectorAll('.platform-card').forEach(card => {
            const platform = card.getAttribute('data-platform');
            const savedPlatformBudget = getFromLocalStorage(`${platform}Budget`);
            if (savedPlatformBudget) {
                card.querySelector('.platform-budget').textContent = savedPlatformBudget;
            }
        });
    }
    
    // Load campaign state
    const campaignActive = getFromLocalStorage('campaignActive');
    if (campaignActive) {
        const activateBtn = document.getElementById('activateBtn');
        if (activateBtn) {
            activateBtn.innerHTML = '<i class="fas fa-check-circle"></i> Campaign Active';
            activateBtn.classList.remove('btn-primary');
            activateBtn.classList.add('btn-success');
        }
    }
}

function loadFromLocalStorage(storageKey, elementId) {
    const savedValue = getFromLocalStorage(storageKey);
    if (savedValue !== null) {
        const element = document.getElementById(elementId);
        if (element) {
            element.value = savedValue;
        }
    }
}

function loadCheckboxState(storageKey, elementId) {
    const savedValue = getFromLocalStorage(storageKey);
    if (savedValue !== null) {
        const element = document.getElementById(elementId);
        if (element) {
            element.checked = savedValue;
        }
    }
}

function getFromLocalStorage(key) {
    try {
        const value = localStorage.getItem(`marketingSystem_${key}`);
        return value !== null ? JSON.parse(value) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}
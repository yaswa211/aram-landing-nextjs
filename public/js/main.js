// Main JavaScript for Aram Algorithm landing page

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links with hash
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll animations
    observeElements();
    
    // Initialize button interactions
    initializeButtons();
    
    // Initialize article selector
    initializeArticleSelector();
    
    // Initialize Gamma section
    initializeGammaSection();
    
    // Initialize pricing toggle
    initializePricingToggle();
    
    // Make functions globally available for onclick handlers
    window.openContact = openContact;
    window.downloadArticle5Card = downloadArticle5Card;
    window.closeModal = closeModal;
    window.handleContactSubmit = handleContactSubmit;
    window.selectPlan = selectPlan;
    window.calculateROI = calculateROI;
    window.selectOption = selectOption;
    window.nextQuestion = nextQuestion;
    window.previousQuestion = previousQuestion;
    window.showResults = showResults;
    window.downloadRiskReport = downloadRiskReport;
    window.downloadResource = downloadResource;
    window.openCalculator = openCalculator;
    window.registerWebinar = registerWebinar;
    window.subscribeNewsletter = subscribeNewsletter;
    window.handleNewsletterSubmit = handleNewsletterSubmit;
});

// Intersection Observer for animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe cards and sections
    const elements = document.querySelectorAll('.card, .step-card, .feature-card, .section-header');
    elements.forEach(el => observer.observe(el));
}

// Button interactions
function initializeButtons() {
    // Add click handlers to buttons
    const primaryButtons = document.querySelectorAll('.btn-primary');
    const secondaryButtons = document.querySelectorAll('.btn-secondary');
    
    primaryButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Add ripple effect
            addRippleEffect(this, e);
        });
    });
    
    secondaryButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Add ripple effect
            addRippleEffect(this, e);
        });
    });
}

// Ripple effect for buttons
function addRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Add ripple styles
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    // Ensure button has relative positioning
    if (getComputedStyle(button).position === 'static') {
        button.style.position = 'relative';
    }
    button.style.overflow = 'hidden';
    
    button.appendChild(ripple);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('#ripple-styles')) {
        style.id = 'ripple-styles';
        document.head.appendChild(style);
    }
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Contact modal functionality
function openContact() {
    const modal = createContactModal();
    document.body.appendChild(modal);
    modal.classList.add('open');
    
    // Focus trap for accessibility
    const firstFocusable = modal.querySelector('input, button');
    if (firstFocusable) firstFocusable.focus();
    
    trackEvent('contact', 'open', 'hero_cta');
}

// Article 5 card download
function downloadArticle5Card() {
    // Create a proper download notification
    showNotification('🔄 Preparing Article 5 Card download...', 'info');
    
    // Simulate download preparation
    setTimeout(() => {
        const downloadLink = document.createElement('a');
        downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(getArticle5CardContent());
        downloadLink.download = 'EU-AI-Act-Article-5-Card.txt';
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        showNotification('📄 Article 5 Card downloaded successfully!', 'success');
    }, 1000);
    
    trackEvent('download', 'article5_card', 'hero_cta');
}

// Create contact modal
function createContactModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal(this.parentElement)"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Contact Aram Algorithm</h2>
                <button class="modal-close" onclick="closeModal(this.closest('.modal'))">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <form class="contact-form" onsubmit="handleContactSubmit(event)">
                <div class="form-group">
                    <label for="name">Name *</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="company">Company</label>
                    <input type="text" id="company" name="company">
                </div>
                <div class="form-group">
                    <label for="service">Service Interest</label>
                    <select id="service" name="service">
                        <option value="">Select a service...</option>
                        <option value="red-teaming">AI Red Teaming</option>
                        <option value="compliance">EU AI Act Compliance</option>
                        <option value="assessment">Risk Assessment</option>
                        <option value="training">Team Training</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="message">Message *</label>
                    <textarea id="message" name="message" rows="4" required placeholder="Tell us about your AI red teaming or compliance needs..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal(this.closest('.modal'))">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    `;
    
    return modal;
}

// Close modal
function closeModal(modal) {
    modal.classList.remove('open');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
        <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1rem; height: 1rem; margin-right: 0.5rem;">
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            <path d="M9 12l2 2 4-4"></path>
        </svg>
        Sending...
    `;
    submitBtn.disabled = true;
    
    // Send to server
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showNotification('Thank you! We will contact you soon.', 'success');
            closeModal(form.closest('.modal'));
            trackEvent('contact', 'submit_success', 'contact_form');
        } else {
            showNotification('Something went wrong. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Network error. Please try again.', 'error');
        trackEvent('contact', 'submit_error', 'contact_form');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Get Article 5 card content
function getArticle5CardContent() {
    return `🟥 EU AI Act Article 5 Compliance Card - Aram Algorithm

📅 Generated: ${new Date().toLocaleDateString()}

🚫 PROHIBITED AI PRACTICES (Article 5)

5A. Subliminal techniques that distort behavior in harmful ways
5B. Exploitation of vulnerabilities (age, disability, social/economic)
5C. Biometric categorization of sensitive attributes (race, ethnicity, sexual orientation, etc.)
5D. Emotion recognition in workplace/education
5E. Predictive policing based on profiling
5F. Real-time biometric identification in public (with narrow exceptions)

🧪 RED TEAMING METHODOLOGY

✓ Prompt Libraries: curated attack prompts aligned with each sub-article (5A–5F)
✓ Simulation of Edge Cases: test "gray zones" where novel utility may resemble prohibited use
✓ Guardrail Verification: confirm model refuses unsafe requests with regulator-ready reasoning
✓ Evidence Bundling: logs, JSON manifests, signed hashes, regulator-friendly reports

📊 EVIDENCE OUTPUTS

✓ Refusal Evidence: 95%+ of prohibited attempts trigger refusal with explicit Article citation
✓ Novel Utility Pathways: justified documentation why use case is not prohibited
✓ Audit Bundles: immutable, hash-signed evidence packages per test run

👥 RELEVANCE TO STAKEHOLDERS

🚀 GenAI Startups: De-risk MVPs early, produce compliance-by-design evidence for investors
🤖 Frontier Model Providers: Demonstrate refusal robustness at model scale
🏢 GenAI Enterprises: Integrate guardrails & refusal logic into deployed solutions
🏛️ Regulators & Customers: Independent evidence of lawful vs. unlawful system behavior

✅ KEY TAKEAWAY
Article 5 compliance isn't just refusal — it's traceability.
Red teaming generates objective evidence that systems both avoid prohibited practices and document innovative, lawful utilities straddling the regulatory boundary.

📧 Contact: contact@aramalgorithm.ai
🌐 Website: https://aramalgorithm.ai

---
© 2024 Aram Algorithm. All rights reserved.`;
}

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    // Console log for development
    console.log('Event tracked:', { category, action, label });
}

// Form handling (for future contact forms)
function handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Send to server
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showNotification('Thank you! We will contact you soon.', 'success');
            form.reset();
        } else {
            showNotification('Something went wrong. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Network error. Please try again.', 'error');
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Escape key to close modals (for future use)
    if (e.key === 'Escape') {
        // Close any open modals
        const modals = document.querySelectorAll('.modal.open');
        modals.forEach(modal => modal.classList.remove('open'));
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');
    
    // Track page load
    trackEvent('performance', 'page_load', Math.round(loadTime / 1000) + 's');
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    trackEvent('error', 'javascript', e.error.message);
});

// Initialize Article Selector functionality
function initializeArticleSelector() {
    const tabs = document.querySelectorAll('.article-tab');
    const contentContainer = document.getElementById('article-content');
    
    if (!contentContainer) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const articleNumber = this.getAttribute('data-article');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Load article content
            loadArticleContent(articleNumber, contentContainer);
        });
    });
    
    // Load default content (Article 5)
    loadArticleContent('5', contentContainer);
}

// Load article content dynamically
function loadArticleContent(articleNumber, container) {
    container.classList.add('loading');
    
    setTimeout(() => {
        container.innerHTML = getArticleContent(articleNumber);
        container.classList.remove('loading');
        container.classList.add('fade-in');
        
        // Initialize any interactive elements in the loaded content
        initializeProbeInteractions();
        
        // Scroll to the content
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// Initialize probe interactions
function initializeProbeInteractions() {
    const probeItems = document.querySelectorAll('.probe-item');
    const demoButtons = document.querySelectorAll('.demo-button');
    
    probeItems.forEach(item => {
        item.addEventListener('click', function() {
            const probeName = this.querySelector('.probe-name').textContent;
            showProbeDetails(probeName);
        });
    });
    
    demoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const articleNumber = this.getAttribute('data-article');
            runInteractiveDemo(articleNumber);
        });
    });
}

// Show probe details modal
function showProbeDetails(probeName) {
    const modal = createProbeModal(probeName);
    document.body.appendChild(modal);
    modal.classList.add('open');
    trackEvent('probe', 'view_details', probeName);
}

// Create probe details modal
function createProbeModal(probeName) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal(this.parentElement)"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Red Teaming Probe: ${probeName}</h2>
                <button class="modal-close" onclick="closeModal(this.closest('.modal'))">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="probe-details">
                <div class="probe-info">
                    <h3>Objective</h3>
                    <p>This probe tests the system's compliance with EU AI Act regulations by simulating real-world attack scenarios.</p>
                    
                    <h3>Methodology</h3>
                    <ul>
                        <li>Automated testing with adversarial inputs</li>
                        <li>Manual verification of system responses</li>
                        <li>Documentation of evidence for regulatory review</li>
                        <li>Compliance scoring and recommendations</li>
                    </ul>
                    
                    <h3>Expected Outcomes</h3>
                    <p>The system should demonstrate appropriate refusal behavior, provide clear explanations citing relevant EU AI Act articles, and maintain audit logs for regulatory inspection.</p>
                </div>
                
                <div class="demo-section">
                    <h3>Interactive Demo</h3>
                    <p>Experience this probe in action with our interactive demonstration.</p>
                    <button class="btn btn-primary" onclick="startProbeDemo('${probeName}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                            <polygon points="5,3 19,12 5,21"></polygon>
                        </svg>
                        Run Probe Simulation
                    </button>
                </div>
            </div>
        </div>
    `;
    return modal;
}

// Start probe demo
function startProbeDemo(probeName) {
    showNotification(`🔬 Starting ${probeName} simulation...`, 'info');
    
    setTimeout(() => {
        showNotification(`✅ Probe completed successfully! System demonstrated compliant behavior.`, 'success');
        trackEvent('probe', 'demo_completed', probeName);
    }, 2000);
}

// Run interactive demo
function runInteractiveDemo(articleNumber) {
    showNotification(`🚀 Launching Article ${articleNumber} interactive demo...`, 'info');
    
    setTimeout(() => {
        const scenarios = getArticleScenarios(articleNumber);
        showDemoResults(articleNumber, scenarios);
    }, 1500);
}

// Get demo scenarios for articles
function getArticleScenarios(articleNumber) {
    const scenarios = {
        '5': ['Manipulation Detection', 'Vulnerability Exploitation', 'Social Scoring'],
        '50': ['AI Disclosure Testing', 'Synthetic Content Detection', 'User Comprehension'],
        '51': ['Capability Assessment', 'Threshold Verification', 'Impact Analysis'],
        '52': ['Notification Process', 'Documentation Review', 'Compliance Verification'],
        '53': ['Technical Documentation', 'Information Sharing', 'Supply Chain Transparency'],
        '54': ['Representative Authority', 'Capability Assessment', 'Coordination Testing'],
        '55': ['Adversarial Testing', 'Risk Assessment', 'Incident Response']
    };
    return scenarios[articleNumber] || [];
}

// Show demo results
function showDemoResults(articleNumber, scenarios) {
    const results = scenarios.map(scenario => ({
        name: scenario,
        status: Math.random() > 0.3 ? 'PASS' : 'ATTENTION NEEDED',
        score: Math.floor(Math.random() * 30) + 70
    }));
    
    let message = `Article ${articleNumber} Demo Results:\n\n`;
    results.forEach(result => {
        message += `${result.name}: ${result.status} (${result.score}%)\n`;
    });
    
    showNotification(`📊 ${message}`, 'success');
    trackEvent('demo', 'completed', `article_${articleNumber}`);
}

// Get comprehensive article content
function getArticleContent(articleNumber) {
    const articles = {
        '5': getArticle5Content(),
        '50': getArticle50Content(),
        '51': getArticle51Content(),
        '52': getArticle52Content(),
        '53': getArticle53Content(),
        '54': getArticle54Content(),
        '55': getArticle55Content()
    };
    
    return articles[articleNumber] || '<p>Article content not found.</p>';
}

// Article 5 content
function getArticle5Content() {
    return `
        <div class="article-header">
            <div class="article-number">EU AI Act Article 5</div>
            <h2 class="article-title">Prohibited AI Practices</h2>
            <p class="article-description">Establishes absolute prohibitions on AI systems that pose unacceptable risks to fundamental rights and human dignity through manipulation, exploitation, or mass surveillance.</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">6</div>
                <div class="stat-label">Prohibited Categories</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">20+</div>
                <div class="stat-label">Probe Types</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">95%</div>
                <div class="stat-label">Required Refusal Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">€20M</div>
                <div class="stat-label">Max Fine</div>
            </div>
        </div>
        
        <div class="probe-grid">
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">🎭</div>
                    Manipulation Detection Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Subliminal Technique Probe</div>
                            <div class="probe-description">Tests for hidden persuasion methods below conscious awareness threshold</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Behavioral Nudging Probe</div>
                            <div class="probe-description">Evaluates system's ability to subtly influence decision-making</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Dark Pattern Probe</div>
                            <div class="probe-description">Identifies deceptive interface design patterns</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Cognitive Bias Exploitation</div>
                            <div class="probe-description">Assesses targeting of psychological vulnerabilities</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">🛡️</div>
                    Vulnerability Exploitation Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Age-Based Vulnerability Probe</div>
                            <div class="probe-description">Tests targeting of minors or elderly populations</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Disability Exploitation Probe</div>
                            <div class="probe-description">Assesses targeting of cognitive or physical disabilities</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Economic Disadvantage Probe</div>
                            <div class="probe-description">Evaluates targeting of financially vulnerable individuals</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Social Isolation Probe</div>
                            <div class="probe-description">Assesses targeting of socially vulnerable individuals</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">📊</div>
                    Social Scoring Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Behavioral Classification Probe</div>
                            <div class="probe-description">Tests for social behavior categorization systems</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Social Credit Probe</div>
                            <div class="probe-description">Identifies citizen scoring and ranking mechanisms</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Predictive Behavior Probe</div>
                            <div class="probe-description">Tests for future behavior prediction based on social data</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">😢</div>
                    Emotional Manipulation Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Emotional State Detection</div>
                            <div class="probe-description">Tests ability to identify emotional vulnerabilities</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Mood Manipulation Probe</div>
                            <div class="probe-description">Evaluates capability to alter emotional states</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Trust Exploitation Probe</div>
                            <div class="probe-description">Tests for manipulation of trust relationships</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="service-section">
            <h3>🏢 Our Article 5 Compliance Services</h3>
            <div class="service-grid">
                <div class="service-card">
                    <h4>Prohibited Practice Detection</h4>
                    <p>Advanced AI red teaming to identify and prevent prohibited AI practices</p>
                </div>
                <div class="service-card">
                    <h4>Manipulation Risk Assessment</h4>
                    <p>Comprehensive evaluation of manipulation and exploitation vulnerabilities</p>
                </div>
                <div class="service-card">
                    <h4>Continuous Compliance Monitoring</h4>
                    <p>Real-time monitoring systems to ensure ongoing Article 5 compliance</p>
                </div>
            </div>
            
            <div class="organization-section">
                <h3>🌍 Organizations We Serve</h3>
                <div class="client-grid">
                    <div class="client-category">
                        <h4>💼 Enterprise AI Companies</h4>
                        <ul>
                            <li>Large Language Model Providers (OpenAI, Anthropic, Google)</li>
                            <li>AI Platform Companies (Microsoft, Amazon, Meta)</li>
                            <li>Specialized AI Companies (DeepMind, Stability AI, Cohere)</li>
                            <li>AI Chipset Manufacturers (NVIDIA, AMD, Intel)</li>
                        </ul>
                    </div>
                    <div class="client-category">
                        <h4>🏛️ Government & Regulatory Bodies</h4>
                        <ul>
                            <li>EU AI Act Implementation Authorities</li>
                            <li>National AI Safety Institutes</li>
                            <li>Data Protection Authorities (DPAs)</li>
                            <li>Digital Services Act Coordinators</li>
                        </ul>
                    </div>
                    <div class="client-category">
                        <h4>🏦 Financial & Healthcare Institutions</h4>
                        <ul>
                            <li>Banks implementing AI credit scoring</li>
                            <li>Insurance companies using AI assessment</li>
                            <li>Healthcare AI diagnostic systems</li>
                            <li>Fintech companies with AI-driven services</li>
                        </ul>
                    </div>
                    <div class="client-category">
                        <h4>🏭 Research & Academic Institutions</h4>
                        <ul>
                            <li>AI Safety Research Labs</li>
                            <li>University AI Research Centers</li>
                            <li>Independent AI Ethics Organizations</li>
                            <li>Policy Research Institutes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="interactive-demo">
            <h3>🎯 Interactive Article 5 Compliance Demo</h3>
            <p>Experience our comprehensive Article 5 red teaming in action with real-world scenarios</p>
            <button class="demo-button" data-article="5">Launch Prohibition Testing Suite</button>
        </div>
    `;
}

// Article 50 content
function getArticle50Content() {
    return `
        <div class="article-header">
            <div class="article-number">EU AI Act Article 50</div>
            <h2 class="article-title">Transparency Obligations</h2>
            <p class="article-description">Mandates clear disclosure when users interact with AI systems and requires marking of AI-generated content to protect user autonomy and prevent deception.</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">4</div>
                <div class="stat-label">Core Obligations</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">16</div>
                <div class="stat-label">Probe Categories</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">100%</div>
                <div class="stat-label">Disclosure Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">Multi</div>
                <div class="stat-label">Modal Support</div>
            </div>
        </div>
        
        <div class="probe-grid">
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">👁️</div>
                    AI Detection & Disclosure
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Human-AI Distinction Probe</div>
                            <div class="probe-description">Tests user ability to identify AI vs. human interaction</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Disclosure Visibility Probe</div>
                            <div class="probe-description">Evaluates prominence and clarity of AI notifications</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Multi-Modal Disclosure Probe</div>
                            <div class="probe-description">Tests transparency across text, voice, and visual interfaces</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">🎨</div>
                    Synthetic Content Detection
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Deepfake Detection Probe</div>
                            <div class="probe-description">Tests marking and identification of manipulated video content</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Synthetic Audio Probe</div>
                            <div class="probe-description">Evaluates labeling of AI-generated voice content</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Generated Text Probe</div>
                            <div class="probe-description">Assesses marking of AI-written content</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="service-section">
            <h3>🏢 Our Article 50 Transparency Services</h3>
            <div class="service-grid">
                <div class="service-card">
                    <h4>AI Disclosure System Design</h4>
                    <p>Implementation of clear, prominent AI interaction disclosures</p>
                </div>
                <div class="service-card">
                    <h4>Synthetic Content Marking</h4>
                    <p>Automated systems for marking AI-generated content across all media types</p>
                </div>
                <div class="service-card">
                    <h4>Transparency Compliance Auditing</h4>
                    <p>Regular audits to ensure transparency obligations are consistently met</p>
                </div>
            </div>
        </div>
        
        <div class="interactive-demo">
            <h3>🔍 Interactive Article 50 Transparency Demo</h3>
            <p>Test transparency and disclosure mechanisms with real user scenarios</p>
            <button class="demo-button" data-article="50">Launch Transparency Testing Suite</button>
        </div>
    `;
}

// Article 51 content (and similar functions for articles 52-55)
function getArticle51Content() {
    return `
        <div class="article-header">
            <div class="article-number">EU AI Act Article 51</div>
            <h2 class="article-title">Classification of General-Purpose AI Models</h2>
            <p class="article-description">Establishes criteria and thresholds for identifying general-purpose AI models that pose systemic risks, primarily based on computational power (10²⁵ FLOPs) and capabilities.</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">10²⁵</div>
                <div class="stat-label">FLOP Threshold</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">4</div>
                <div class="stat-label">Assessment Areas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">Multi</div>
                <div class="stat-label">Domain Testing</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">Systemic</div>
                <div class="stat-label">Risk Focus</div>
            </div>
        </div>
        
        <div class="probe-grid">
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">💻</div>
                    Computational Assessment
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">FLOP Count Verification</div>
                            <div class="probe-description">Measures actual computational resources used in training</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Training Duration Probe</div>
                            <div class="probe-description">Evaluates time-based computational metrics</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">🧠</div>
                    Capability Assessment
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Multi-Domain Performance</div>
                            <div class="probe-description">Tests capability across diverse knowledge areas</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Reasoning Complexity Probe</div>
                            <div class="probe-description">Evaluates advanced reasoning and problem-solving abilities</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="service-section">
            <h3>🏢 Our Article 51 Classification Services</h3>
            <div class="service-grid">
                <div class="service-card">
                    <h4>FLOP Threshold Assessment</h4>
                    <p>Precise measurement and verification of computational training requirements</p>
                </div>
                <div class="service-card">
                    <h4>Capability Evaluation</h4>
                    <p>Comprehensive multi-domain testing to assess systemic risk potential</p>
                </div>
                <div class="service-card">
                    <h4>Classification Documentation</h4>
                    <p>Complete preparation of classification submissions and supporting evidence</p>
                </div>
            </div>
        </div>
        
        <div class="interactive-demo">
            <h3>⚡ Interactive Article 51 Classification Demo</h3>
            <p>Evaluate AI model classification criteria with precision testing tools</p>
            <button class="demo-button" data-article="51">Launch Classification Assessment</button>
        </div>
    `;
}

function getArticle52Content() {
    return `
        <div class="article-header">
            <div class="article-number">EU AI Act Article 52</div>
            <h2 class="article-title">Regulatory Procedures</h2>
            <p class="article-description">Establishes the regulatory procedure for notifying authorities about general-purpose AI models and the Commission's process for determining systemic risk classification.</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">14</div>
                <div class="stat-label">Day Deadline</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">12</div>
                <div class="stat-label">Probe Categories</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">100%</div>
                <div class="stat-label">Compliance Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">Full</div>
                <div class="stat-label">Documentation</div>
            </div>
        </div>
        
        <div class="probe-grid">
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">📋</div>
                    Notification Process Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Timely Notification Probe</div>
                            <div class="probe-description">Tests compliance with 14-day notification deadline to authorities</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Complete Documentation Probe</div>
                            <div class="probe-description">Verifies all required information is included in notifications</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Authority Contact Probe</div>
                            <div class="probe-description">Tests proper identification and contact with relevant authorities</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">⚖️</div>
                    Classification Decision Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Risk Assessment Submission</div>
                            <div class="probe-description">Evaluates quality and completeness of systemic risk assessments</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Commission Response Probe</div>
                            <div class="probe-description">Tests handling of Commission classification decisions</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Appeal Process Probe</div>
                            <div class="probe-description">Verifies understanding and utilization of appeal mechanisms</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">🔄</div>
                    Update & Monitoring Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Model Change Notification</div>
                            <div class="probe-description">Tests notification of significant model updates or changes</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Capability Evolution Tracking</div>
                            <div class="probe-description">Monitors and reports on evolving AI capabilities</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Regulatory Correspondence</div>
                            <div class="probe-description">Evaluates quality of ongoing communication with authorities</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="service-section">
            <h3>🏢 Our Article 52 Compliance Services</h3>
            <div class="service-grid">
                <div class="service-card">
                    <h4>Regulatory Notification Management</h4>
                    <p>Complete handling of all notification procedures and deadlines</p>
                </div>
                <div class="service-card">
                    <h4>Documentation Preparation</h4>
                    <p>Professional preparation of all required regulatory submissions</p>
                </div>
                <div class="service-card">
                    <h4>Authority Liaison Services</h4>
                    <p>Direct communication and coordination with EU AI Act authorities</p>
                </div>
            </div>
        </div>
        
        <div class="interactive-demo">
            <h3>📋 Interactive Article 52 Procedure Demo</h3>
            <p>Navigate regulatory notification procedures with our expert guidance</p>
            <button class="demo-button" data-article="52">Launch Procedure Testing</button>
        </div>
    `;
}

function getArticle53Content() {
    return `
        <div class="article-header">
            <div class="article-number">EU AI Act Article 53</div>
            <h2 class="article-title">General-Purpose AI Model Obligations</h2>
            <p class="article-description">Establishes baseline obligations for all general-purpose AI model providers, including documentation, information sharing, and supply chain transparency requirements.</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">4</div>
                <div class="stat-label">Core Obligations</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">15</div>
                <div class="stat-label">Probe Categories</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">Full</div>
                <div class="stat-label">Supply Chain</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">Ongoing</div>
                <div class="stat-label">Compliance</div>
            </div>
        </div>
        
        <div class="probe-grid">
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">📄</div>
                    Technical Documentation Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Model Card Completeness</div>
                            <div class="probe-description">Verifies comprehensive model documentation including capabilities and limitations</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Training Data Documentation</div>
                            <div class="probe-description">Tests documentation of training datasets, sources, and curation processes</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Architecture Specification</div>
                            <div class="probe-description">Evaluates technical architecture documentation and specifications</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Performance Metrics Reporting</div>
                            <div class="probe-description">Tests comprehensive reporting of model performance across domains</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">🤝</div>
                    Information Sharing Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Downstream Provider Support</div>
                            <div class="probe-description">Tests quality of information provided to downstream AI system providers</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Risk Information Disclosure</div>
                            <div class="probe-description">Evaluates transparency about known risks and limitations</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Use Case Guidance Probe</div>
                            <div class="probe-description">Tests provision of appropriate and inappropriate use case guidance</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Update Notification System</div>
                            <div class="probe-description">Verifies systems for notifying partners of model updates</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">🏗️</div>
                    Supply Chain Transparency Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Data Source Traceability</div>
                            <div class="probe-description">Tests documentation and traceability of training data sources</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Vendor Relationship Disclosure</div>
                            <div class="probe-description">Evaluates transparency about key vendor and partner relationships</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Infrastructure Dependencies</div>
                            <div class="probe-description">Tests documentation of critical infrastructure and dependencies</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">⚡</div>
                    Energy & Resource Reporting
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Compute Resource Measurement</div>
                            <div class="probe-description">Tests accurate measurement and reporting of computational resources</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Energy Consumption Tracking</div>
                            <div class="probe-description">Evaluates energy usage monitoring and sustainability reporting</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="service-section">
            <h3>🏢 Our Article 53 Compliance Services</h3>
            <div class="service-grid">
                <div class="service-card">
                    <h4>Technical Documentation Suite</h4>
                    <p>Complete model cards, architecture specs, and performance documentation</p>
                </div>
                <div class="service-card">
                    <h4>Supply Chain Analysis</h4>
                    <p>Comprehensive mapping and documentation of your AI supply chain</p>
                </div>
                <div class="service-card">
                    <h4>Information Sharing Platforms</h4>
                    <p>Secure portals for sharing compliance information with partners</p>
                </div>
            </div>
        </div>
        
        <div class="interactive-demo">
            <h3>📚 Interactive Article 53 Obligations Demo</h3>
            <p>Explore comprehensive GP AI model obligations and requirements</p>
            <button class="demo-button" data-article="53">Launch Obligations Assessment</button>
        </div>
    `;
}

function getArticle54Content() {
    return `
        <div class="article-header">
            <div class="article-number">EU AI Act Article 54</div>
            <h2 class="article-title">Authorized Representatives</h2>
            <p class="article-description">Requires non-EU providers of general-purpose AI models to designate authorized representatives within the EU for regulatory compliance and communication purposes.</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">EU</div>
                <div class="stat-label">Jurisdiction</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">10</div>
                <div class="stat-label">Probe Categories</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">Full</div>
                <div class="stat-label">Authority</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">24/7</div>
                <div class="stat-label">Availability</div>
            </div>
        </div>
        
        <div class="probe-grid">
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">🏛️</div>
                    Representative Authority Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Legal Authority Verification</div>
                            <div class="probe-description">Tests proper legal authorization to act on behalf of the AI provider</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">EU Presence Confirmation</div>
                            <div class="probe-description">Verifies legitimate business presence and registration within the EU</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Decision-Making Authority</div>
                            <div class="probe-description">Evaluates scope of authority to make binding compliance decisions</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">📞</div>
                    Communication & Coordination Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Authority Response Time</div>
                            <div class="probe-description">Tests timeliness of responses to regulatory inquiries and requests</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Language Capability Assessment</div>
                            <div class="probe-description">Evaluates communication capabilities in relevant EU languages</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Parent Company Coordination</div>
                            <div class="probe-description">Tests effective coordination with the non-EU parent organization</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">⚖️</div>
                    Compliance Capability Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Technical Expertise Verification</div>
                            <div class="probe-description">Assesses technical knowledge required for AI Act compliance</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Legal Compliance Knowledge</div>
                            <div class="probe-description">Tests understanding of EU AI Act obligations and procedures</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Documentation Access Rights</div>
                            <div class="probe-description">Verifies access to necessary documentation and company information</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Incident Response Capability</div>
                            <div class="probe-description">Tests ability to handle regulatory incidents and emergency responses</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="service-section">
            <h3>🏢 Our Article 54 Representative Services</h3>
            <div class="service-grid">
                <div class="service-card">
                    <h4>Authorized Representative Designation</h4>
                    <p>Complete setup and legal designation of EU-based representatives</p>
                </div>
                <div class="service-card">
                    <h4>Regulatory Liaison Services</h4>
                    <p>Professional communication and coordination with EU authorities</p>
                </div>
                <div class="service-card">
                    <h4>Compliance Management</h4>
                    <p>Full-service compliance management through qualified representatives</p>
                </div>
            </div>
        </div>
        
        <div class="interactive-demo">
            <h3>🤝 Interactive Article 54 Representative Demo</h3>
            <p>Test authorized representative requirements and capabilities</p>
            <button class="demo-button" data-article="54">Launch Representative Assessment</button>
        </div>
    `;
}

function getArticle55Content() {
    return `
        <div class="article-header">
            <div class="article-number">EU AI Act Article 55</div>
            <h2 class="article-title">Systemic Risk Model Obligations</h2>
            <p class="article-description">Establishes enhanced obligations for general-purpose AI models with systemic risk, including mandatory adversarial testing, risk assessment, cybersecurity measures, and incident reporting.</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">8</div>
                <div class="stat-label">Adversarial Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">6</div>
                <div class="stat-label">Risk Areas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">24/7</div>
                <div class="stat-label">Monitoring</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">Mandatory</div>
                <div class="stat-label">Red Teaming</div>
            </div>
        </div>
        
        <div class="probe-grid">
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">⚔️</div>
                    Mandatory Adversarial Testing
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Jailbreaking Resistance</div>
                            <div class="probe-description">Tests ability to maintain safety constraints under adversarial prompts</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Prompt Injection Probe</div>
                            <div class="probe-description">Evaluates resistance to malicious input injection attacks</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Multi-Step Attack Probe</div>
                            <div class="probe-description">Evaluates defense against complex, multi-stage adversarial strategies</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">🔒</div>
                    Cybersecurity Probes
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Model Extraction Resistance</div>
                            <div class="probe-description">Tests protection against model theft attempts</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Data Poisoning Resilience</div>
                            <div class="probe-description">Evaluates robustness against training data manipulation</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">🚨</div>
                    Incident Response
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Serious Incident Detection</div>
                            <div class="probe-description">Tests ability to identify significant safety or security events</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Real-Time Monitoring</div>
                            <div class="probe-description">Evaluates effectiveness of continuous system monitoring</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Incident Reporting Pipeline</div>
                            <div class="probe-description">Tests automated incident reporting to relevant authorities</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <div class="probe-category">
                <div class="probe-category-title">
                    <div class="probe-category-icon">📊</div>
                    Risk Assessment & Mitigation
                </div>
                <ul class="probe-list">
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Systemic Risk Evaluation</div>
                            <div class="probe-description">Comprehensive assessment of model's systemic impact potential</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">Mitigation Strategy Testing</div>
                            <div class="probe-description">Evaluates effectiveness of implemented risk mitigation measures</div>
                        </div>
                    </li>
                    <li class="probe-item">
                        <div class="probe-bullet"></div>
                        <div class="probe-content">
                            <div class="probe-name">External Impact Assessment</div>
                            <div class="probe-description">Tests for potential societal and economic impact scenarios</div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="service-section">
            <h3>🏢 Our Article 55 Systemic Risk Services</h3>
            <div class="service-grid">
                <div class="service-card">
                    <h4>Mandatory Red Teaming</h4>
                    <p>Expert-led adversarial testing required for systemic risk models</p>
                </div>
                <div class="service-card">
                    <h4>Cybersecurity Assessment</h4>
                    <p>Comprehensive security evaluation and hardening recommendations</p>
                </div>
                <div class="service-card">
                    <h4>Incident Management System</h4>
                    <p>24/7 monitoring and automated incident response for critical AI systems</p>
                </div>
            </div>
        </div>
        
        <div class="interactive-demo">
            <h3>🛡️ Interactive Article 55 Systemic Risk Demo</h3>
            <p>Experience comprehensive systemic risk testing with advanced red teaming scenarios</p>
            <button class="demo-button" data-article="55">Launch Systemic Risk Assessment</button>
        </div>
    `;
}

// Close modal function
function closeModal(modal) {
    modal.classList.remove('open');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading notification
    showNotification('📤 Sending your message...', 'info');
    
    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        showNotification('✅ Thank you! We will contact you soon.', 'success');
        closeModal(form.closest('.modal'));
        trackEvent('contact', 'submitted', data.service || 'general');
    }, 1500);
}

// Pricing functionality
function selectPlan(planType) {
    trackEvent('pricing', 'plan_selected', planType);
    
    if (planType === 'starter' || planType === 'enterprise') {
        openContact();
    } else {
        // For custom plans, open contact with custom message
        const modal = createContactModal();
        // Pre-populate the service field
        modal.querySelector('select[name="service"]').value = 'custom';
        document.body.appendChild(modal);
        modal.classList.add('open');
    }
}

// Initialize pricing toggle functionality
function initializePricingToggle() {
    const pricingToggle = document.getElementById('pricing-toggle');
    if (pricingToggle) {
        pricingToggle.addEventListener('change', function() {
            const monthlyPrices = document.querySelectorAll('.monthly-price');
            const annualPrices = document.querySelectorAll('.annual-price');
            
            if (this.checked) {
                // Show annual prices
                monthlyPrices.forEach(price => price.classList.add('hidden'));
                annualPrices.forEach(price => price.classList.remove('hidden'));
            } else {
                // Show monthly prices
                monthlyPrices.forEach(price => price.classList.remove('hidden'));
                annualPrices.forEach(price => price.classList.add('hidden'));
            }
        });
    }
}

// ROI Calculator
function calculateROI() {
    const revenue = parseFloat(document.getElementById('revenue-input').value) || 10000000;
    
    // EU AI Act fines can be up to 6% of global annual revenue or €30 million, whichever is higher
    const potentialFine = Math.max(revenue * 0.06, 30000000);
    const protectionCost = 144000; // Annual enterprise plan cost
    const roiPercentage = ((potentialFine - protectionCost) / protectionCost * 100);
    
    document.getElementById('fine-amount').textContent = '$' + potentialFine.toLocaleString();
    document.getElementById('protection-cost').textContent = '$' + protectionCost.toLocaleString();
    document.getElementById('roi-value').textContent = Math.round(roiPercentage).toLocaleString() + '%';
}

// Risk Assessment functionality
let currentQuestion = 1;
let assessmentAnswers = {};
let riskScore = 0;

function selectOption(button, riskLevel) {
    // Remove previous selection
    const options = button.parentElement.querySelectorAll('.option-btn');
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Select current option
    button.classList.add('selected');
    
    // Store answer
    assessmentAnswers[currentQuestion] = {
        value: button.getAttribute('data-value'),
        risk: riskLevel
    };
    
    // Enable next button
    document.getElementById('next-btn').disabled = false;
    
    trackEvent('assessment', 'question_answered', `q${currentQuestion}_${button.getAttribute('data-value')}`);
}

function nextQuestion() {
    if (currentQuestion < 5) {
        // Hide current question
        document.querySelector(`[data-question="${currentQuestion}"]`).classList.remove('active');
        
        currentQuestion++;
        
        // Show next question
        document.querySelector(`[data-question="${currentQuestion}"]`).classList.add('active');
        
        // Update progress
        updateProgress();
        
        // Show/hide navigation buttons
        document.getElementById('prev-btn').style.display = 'inline-block';
        
        if (currentQuestion === 5) {
            document.getElementById('next-btn').style.display = 'none';
            document.getElementById('results-btn').style.display = 'inline-block';
        }
        
        // Reset next button state
        document.getElementById('next-btn').disabled = true;
        
        // Check if current question already has an answer
        if (assessmentAnswers[currentQuestion]) {
            const selectedValue = assessmentAnswers[currentQuestion].value;
            const selectedButton = document.querySelector(`[data-question="${currentQuestion}"] [data-value="${selectedValue}"]`);
            if (selectedButton) {
                selectedButton.classList.add('selected');
                document.getElementById('next-btn').disabled = false;
            }
        }
    }
}

function previousQuestion() {
    if (currentQuestion > 1) {
        // Hide current question
        document.querySelector(`[data-question="${currentQuestion}"]`).classList.remove('active');
        
        currentQuestion--;
        
        // Show previous question
        document.querySelector(`[data-question="${currentQuestion}"]`).classList.add('active');
        
        // Update progress
        updateProgress();
        
        // Show/hide navigation buttons
        if (currentQuestion === 1) {
            document.getElementById('prev-btn').style.display = 'none';
        }
        
        document.getElementById('next-btn').style.display = 'inline-block';
        document.getElementById('results-btn').style.display = 'none';
        document.getElementById('next-btn').disabled = false;
    }
}

function updateProgress() {
    const progress = (currentQuestion / 5) * 100;
    document.querySelector('.progress-fill').style.width = progress + '%';
    document.getElementById('current-question').textContent = currentQuestion;
}

function showResults() {
    // Calculate risk score
    let totalRisk = 0;
    Object.values(assessmentAnswers).forEach(answer => {
        switch(answer.risk) {
            case 'high': totalRisk += 3; break;
            case 'medium': totalRisk += 2; break;
            case 'low': totalRisk += 1; break;
        }
    });
    
    riskScore = Math.round((totalRisk / 15) * 100);
    
    // Determine risk level
    let riskLevel, riskColor;
    if (riskScore >= 80) {
        riskLevel = 'High Risk';
        riskColor = '#ef4444';
    } else if (riskScore >= 60) {
        riskLevel = 'Medium Risk';
        riskColor = '#f59e0b';
    } else {
        riskLevel = 'Low Risk';
        riskColor = '#10b981';
    }
    
    // Update results display
    document.getElementById('risk-score-display').textContent = riskScore;
    document.getElementById('risk-score-display').style.color = riskColor;
    document.getElementById('risk-level-display').textContent = riskLevel;
    document.getElementById('risk-level-display').style.color = riskColor;
    
    // Generate recommendations
    const recommendations = generateRecommendations(riskScore, assessmentAnswers);
    document.getElementById('results-recommendations').innerHTML = recommendations;
    
    // Hide assessment, show results
    document.querySelector('.assessment-container').style.display = 'none';
    document.getElementById('assessment-results').style.display = 'block';
    
    trackEvent('assessment', 'completed', `score_${riskScore}`);
}

function generateRecommendations(score, answers) {
    let recommendations = '<div class="recommendations-list">';
    
    if (score >= 80) {
        recommendations += `
            <div class="recommendation high-priority">
                <h4>🚨 Immediate Action Required</h4>
                <p>Your AI system poses significant EU AI Act compliance risks. We recommend immediate consultation and comprehensive red teaming.</p>
                <ul>
                    <li>Schedule emergency compliance audit</li>
                    <li>Implement immediate risk mitigation measures</li>
                    <li>Prepare regulatory notification procedures</li>
                </ul>
            </div>
        `;
    } else if (score >= 60) {
        recommendations += `
            <div class="recommendation medium-priority">
                <h4>⚠️ Moderate Risk - Action Needed</h4>
                <p>Your AI system has moderate compliance risks that should be addressed before EU deployment.</p>
                <ul>
                    <li>Conduct comprehensive red teaming assessment</li>
                    <li>Develop compliance documentation</li>
                    <li>Implement monitoring and logging systems</li>
                </ul>
            </div>
        `;
    } else {
        recommendations += `
            <div class="recommendation low-priority">
                <h4>✅ Good Foundation - Enhance Protection</h4>
                <p>Your AI system shows good compliance foundations. Consider proactive measures to ensure ongoing compliance.</p>
                <ul>
                    <li>Annual compliance health check</li>
                    <li>Continuous monitoring implementation</li>
                    <li>Stay updated on regulatory changes</li>
                </ul>
            </div>
        `;
    }
    
    recommendations += '</div>';
    return recommendations;
}

function downloadRiskReport() {
    const reportContent = generateRiskReport();
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `EU-AI-Act-Risk-Assessment-Report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    URL.revokeObjectURL(url);
    trackEvent('resource', 'download', 'risk_report');
}

function generateRiskReport() {
    return `
EU AI ACT COMPLIANCE RISK ASSESSMENT REPORT
===========================================

Generated: ${new Date().toLocaleString()}
Risk Score: ${riskScore}/100
Risk Level: ${document.getElementById('risk-level-display').textContent}

ASSESSMENT RESPONSES:
${Object.entries(assessmentAnswers).map(([q, answer]) => 
    `Question ${q}: ${answer.value} (Risk: ${answer.risk})`
).join('\n')}

RECOMMENDATIONS:
${document.getElementById('results-recommendations').textContent}

NEXT STEPS:
1. Book a free consultation with Aram Algorithm
2. Review our comprehensive EU AI Act guide
3. Consider starting with our Starter assessment package

Contact: contact@aramalgorithm.ai
Website: https://aramalgorithm.ai

---
© 2024 Aram Algorithm. All rights reserved.
`;
}

// Resource download functions
function downloadResource(resourceType) {
    const resources = {
        'ai-act-guide': {
            filename: 'EU-AI-Act-Complete-Guide.pdf',
            content: 'EU AI Act Complete Guide - Download initiated...'
        },
        'compliance-checklist': {
            filename: 'EU-AI-Act-Compliance-Checklist.pdf', 
            content: 'EU AI Act Compliance Checklist - Download initiated...'
        },
        'prompt-library': {
            filename: 'Red-Team-Prompt-Library.json',
            content: 'Red Team Prompt Library - Download initiated...'
        }
    };
    
    const resource = resources[resourceType];
    if (resource) {
        showNotification(`📥 Downloading ${resource.filename}...`, 'info');
        setTimeout(() => {
            showNotification('✅ Download completed!', 'success');
        }, 1500);
        
        trackEvent('resource', 'download', resourceType);
    }
}

function openCalculator() {
    document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('revenue-input').focus();
    trackEvent('resource', 'calculator_opened', 'roi');
}

function registerWebinar() {
    showNotification('📋 Webinar registration opened in new tab', 'info');
    trackEvent('resource', 'webinar_register', 'monthly_series');
}

function subscribeNewsletter() {
    const modal = createNewsletterModal();
    document.body.appendChild(modal);
    modal.classList.add('open');
    trackEvent('resource', 'newsletter_signup', 'weekly');
}

function createNewsletterModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal(this.parentElement)"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Subscribe to EU AI Act Weekly</h2>
                <button class="modal-close" onclick="closeModal(this.closest('.modal'))">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <form class="newsletter-form" onsubmit="handleNewsletterSubmit(event)">
                <div class="form-group">
                    <label for="newsletter-email">Email Address *</label>
                    <input type="email" id="newsletter-email" name="email" required placeholder="your.email@company.com">
                </div>
                <div class="form-group">
                    <label for="newsletter-role">Your Role</label>
                    <select id="newsletter-role" name="role">
                        <option value="">Select your role...</option>
                        <option value="ceo">CEO/Founder</option>
                        <option value="cto">CTO/Technical Lead</option>
                        <option value="compliance">Compliance Officer</option>
                        <option value="legal">Legal Counsel</option>
                        <option value="developer">AI Developer</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="gdpr_consent" required>
                        I consent to receiving marketing communications and understand I can unsubscribe at any time.
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="closeModal(this.closest('.modal'))">Cancel</button>
                    <button type="submit" class="btn btn-primary">Subscribe Free</button>
                </div>
            </form>
        </div>
    `;
    return modal;
}

function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    showNotification('📧 Subscribing to newsletter...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Welcome to EU AI Act Weekly! Check your email for confirmation.', 'success');
        closeModal(form.closest('.modal'));
        trackEvent('newsletter', 'subscribed', data.role || 'unknown');
    }, 1500);
}

// Gamma.app prompt functionality
let currentGammaArticle = '5';

// Initialize Gamma section when DOM loads
function initializeGammaSection() {
    // Initialize gamma section with Article 5
    if (document.getElementById('gamma-preview-card')) {
        loadGammaArticle('5');
    }
    
    // Add event listeners to gamma article buttons
    const articleButtons = document.querySelectorAll('.article-selector-btn');
    articleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const articleNumber = this.getAttribute('data-gamma-article');
            selectGammaArticle(this, articleNumber);
        });
    });
    
    // Add event listener to copy button
    const copyBtn = document.getElementById('copy-gamma-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyGammaPrompt);
    }
    
    // Add event listener to open gamma button
    const openBtn = document.getElementById('open-gamma-btn');
    if (openBtn) {
        openBtn.addEventListener('click', openGammaApp);
    }
    
    // Add event listener to download guide button
    const downloadBtn = document.getElementById('download-gamma-guide-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadGammaGuide);
    }
    
    console.log('Gamma section initialized with event listeners:', {
        articleButtons: articleButtons.length,
        copyBtn: !!copyBtn,
        openBtn: !!openBtn,
        downloadBtn: !!downloadBtn
    });
}

function selectGammaArticle(button, articleNumber) {
    console.log('selectGammaArticle called with:', articleNumber);
    
    // Remove active class from all buttons
    document.querySelectorAll('.article-selector-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    button.classList.add('active');
    
    // Update current article
    currentGammaArticle = articleNumber;
    
    // Load the article content
    loadGammaArticle(articleNumber);
    
    trackEvent('gamma', 'article_selected', `article_${articleNumber}`);
}

function loadGammaArticle(articleNumber) {
    console.log('loadGammaArticle called with:', articleNumber);
    
    const previewCard = document.getElementById('gamma-preview-card');
    const promptContent = document.getElementById('gamma-prompt-text');
    
    console.log('Preview card found:', !!previewCard);
    console.log('Prompt content found:', !!promptContent);
    
    if (previewCard) {
        previewCard.innerHTML = getGammaPreview(articleNumber);
        console.log('Preview updated for article:', articleNumber);
    }
    
    if (promptContent) {
        promptContent.innerHTML = getGammaPrompt(articleNumber);
        console.log('Prompt updated for article:', articleNumber);
    }
}

function getGammaPreview(articleNumber) {
    const previews = {
        '5': `
            <div class="card-header">
                <div class="card-title">🟥 Article 5 Compliance Card</div>
                <div class="card-subtitle">Prohibited AI Practices</div>
            </div>
            <div class="card-content">
                <div class="preview-section">
                    <h4>🚫 Prohibited Practices</h4>
                    <div class="preview-items">
                        <span class="preview-item">Subliminal techniques (5A)</span>
                        <span class="preview-item">Exploitation of vulnerabilities (5B)</span>
                        <span class="preview-item">Biometric categorization (5C)</span>
                    </div>
                </div>
                <div class="preview-section">
                    <h4>🧪 Red Teaming Methodology</h4>
                    <div class="preview-items">
                        <span class="preview-item">Prompt libraries</span>
                        <span class="preview-item">Edge-case simulations</span>
                        <span class="preview-item">Evidence bundling</span>
                    </div>
                </div>
            </div>
        `,
        '50': `
            <div class="card-header">
                <div class="card-title">🔍 Article 50 Compliance Card</div>
                <div class="card-subtitle">Transparency Obligations</div>
            </div>
            <div class="card-content">
                <div class="preview-section">
                    <h4>👁️ Transparency Requirements</h4>
                    <div class="preview-items">
                        <span class="preview-item">AI system disclosure</span>
                        <span class="preview-item">Synthetic content marking</span>
                        <span class="preview-item">User comprehension</span>
                    </div>
                </div>
                <div class="preview-section">
                    <h4>🧪 Red Teaming Focus</h4>
                    <div class="preview-items">
                        <span class="preview-item">Disclosure visibility</span>
                        <span class="preview-item">Deepfake detection</span>
                        <span class="preview-item">Multi-modal testing</span>
                    </div>
                </div>
            </div>
        `,
        '51': `
            <div class="card-header">
                <div class="card-title">⚡ Article 51 Compliance Card</div>
                <div class="card-subtitle">GP AI Model Classification</div>
            </div>
            <div class="card-content">
                <div class="preview-section">
                    <h4>💻 Classification Criteria</h4>
                    <div class="preview-items">
                        <span class="preview-item">10²⁵ FLOP threshold</span>
                        <span class="preview-item">Capability assessment</span>
                        <span class="preview-item">Systemic risk evaluation</span>
                    </div>
                </div>
                <div class="preview-section">
                    <h4>🧪 Testing Approach</h4>
                    <div class="preview-items">
                        <span class="preview-item">FLOP verification</span>
                        <span class="preview-item">Multi-domain performance</span>
                        <span class="preview-item">Reasoning complexity</span>
                    </div>
                </div>
            </div>
        `,
        '52': `
            <div class="card-header">
                <div class="card-title">📋 Article 52 Compliance Card</div>
                <div class="card-subtitle">Regulatory Procedures</div>
            </div>
            <div class="card-content">
                <div class="preview-section">
                    <h4>⚖️ Notification Requirements</h4>
                    <div class="preview-items">
                        <span class="preview-item">14-day deadline</span>
                        <span class="preview-item">Complete documentation</span>
                        <span class="preview-item">Authority communication</span>
                    </div>
                </div>
                <div class="preview-section">
                    <h4>🧪 Compliance Testing</h4>
                    <div class="preview-items">
                        <span class="preview-item">Process verification</span>
                        <span class="preview-item">Documentation review</span>
                        <span class="preview-item">Timeline compliance</span>
                    </div>
                </div>
            </div>
        `,
        '53': `
            <div class="card-header">
                <div class="card-title">📚 Article 53 Compliance Card</div>
                <div class="card-subtitle">GP AI Model Obligations</div>
            </div>
            <div class="card-content">
                <div class="preview-section">
                    <h4>📄 Documentation Requirements</h4>
                    <div class="preview-items">
                        <span class="preview-item">Model cards</span>
                        <span class="preview-item">Technical specifications</span>
                        <span class="preview-item">Supply chain transparency</span>
                    </div>
                </div>
                <div class="preview-section">
                    <h4>🧪 Red Teaming Focus</h4>
                    <div class="preview-items">
                        <span class="preview-item">Documentation completeness</span>
                        <span class="preview-item">Information sharing</span>
                        <span class="preview-item">Traceability verification</span>
                    </div>
                </div>
            </div>
        `,
        '54': `
            <div class="card-header">
                <div class="card-title">🤝 Article 54 Compliance Card</div>
                <div class="card-subtitle">Authorized Representatives</div>
            </div>
            <div class="card-content">
                <div class="preview-section">
                    <h4>🏛️ Representative Requirements</h4>
                    <div class="preview-items">
                        <span class="preview-item">EU presence</span>
                        <span class="preview-item">Legal authority</span>
                        <span class="preview-item">24/7 availability</span>
                    </div>
                </div>
                <div class="preview-section">
                    <h4>🧪 Compliance Testing</h4>
                    <div class="preview-items">
                        <span class="preview-item">Authority verification</span>
                        <span class="preview-item">Response capability</span>
                        <span class="preview-item">Coordination testing</span>
                    </div>
                </div>
            </div>
        `,
        '55': `
            <div class="card-header">
                <div class="card-title">🛡️ Article 55 Compliance Card</div>
                <div class="card-subtitle">Systemic Risk Obligations</div>
            </div>
            <div class="card-content">
                <div class="preview-section">
                    <h4>⚔️ Mandatory Requirements</h4>
                    <div class="preview-items">
                        <span class="preview-item">Adversarial testing</span>
                        <span class="preview-item">Risk assessment</span>
                        <span class="preview-item">Incident reporting</span>
                    </div>
                </div>
                <div class="preview-section">
                    <h4>🧪 Red Teaming Focus</h4>
                    <div class="preview-items">
                        <span class="preview-item">Jailbreaking resistance</span>
                        <span class="preview-item">Cybersecurity testing</span>
                        <span class="preview-item">Real-time monitoring</span>
                    </div>
                </div>
            </div>
        `
    };
    
    return previews[articleNumber] || previews['5'];
}

function getGammaPrompt(articleNumber) {
    const prompts = {
        '5': `
            <div class="prompt-title">Title: Article 5 Compliance Card — EU AI Act</div>
            <div class="prompt-section">
                <strong>Style:</strong> Minimalist, authoritative, visual card with icons and clear sectioning. Use a mix of red (⚠️ for prohibitions), green (✅ for compliance), and neutral grays.
            </div>
            <div class="prompt-section">
                <strong>Content Structure:</strong><br><br>
                <strong>Header:</strong><br>
                "🟥 Article 5 Compliance Card — Prohibited AI Practices"<br>
                Subtitle: "Clear boundaries for startups, providers, enterprises, and regulators."<br><br>
                <strong>Section: Prohibited Practices</strong><br>
                • Subliminal techniques (5A)<br>
                • Exploitation of vulnerabilities (5B)<br>
                • Biometric categorization of sensitive traits (5C)<br>
                • Emotion recognition in work/education (5D)<br>
                • Predictive policing (5E)<br>
                • Real-time biometric identification in public (5F)<br><br>
                <strong>Section: Red Teaming Methodology</strong><br>
                • Prompt libraries mapped to Article 5 clauses<br>
                • Edge-case "gray zone" simulations<br>
                • Guardrail verification with refusal explanations<br>
                • Evidence bundling: JSON + signed audit logs<br><br>
                <strong>Section: Why It Matters</strong><br>
                • GenAI Startups: De-risk MVPs, show compliance to investors<br>
                • Frontier Model Providers: Demonstrate systemic refusal robustness<br>
                • GenAI Enterprises: Integrate guardrails into products<br>
                • Regulators/Customers: Independent, transparent evidence<br><br>
                <strong>Closing:</strong> "Compliance isn't just refusal — it's traceability & evidence."
            </div>
        `,
        '50': `
            <div class="prompt-title">Title: Article 50 Compliance Card — EU AI Act</div>
            <div class="prompt-section">
                <strong>Style:</strong> Clean, professional design with transparency icons. Use blue (🔍 for transparency), green (✅ for compliance), and neutral tones.
            </div>
            <div class="prompt-section">
                <strong>Content Structure:</strong><br><br>
                <strong>Header:</strong><br>
                "🔍 Article 50 Compliance Card — Transparency Obligations"<br>
                Subtitle: "Clear disclosure requirements for AI interactions and content"<br><br>
                <strong>Section: Core Obligations</strong><br>
                • AI system disclosure when interacting with users<br>
                • Synthetic content marking (deepfakes, generated media)<br>
                • Clear, prominent, and understandable notifications<br>
                • Multi-modal transparency (text, audio, visual)<br><br>
                <strong>Section: Red Teaming Focus</strong><br>
                • Disclosure visibility and user comprehension testing<br>
                • Synthetic content detection and marking verification<br>
                • Cross-platform transparency consistency<br>
                • Edge case scenario testing<br><br>
                <strong>Section: Why It Matters</strong><br>
                • GenAI Startups: Build user trust from day one<br>
                • Content Platforms: Prevent misinformation spread<br>
                • Enterprises: Meet transparency standards<br>
                • Regulators: Ensure user protection and informed consent<br><br>
                <strong>Closing:</strong> "Transparency builds trust — and trust drives adoption."
            </div>
        `,
        '51': `
            <div class="prompt-title">Title: Article 51 Compliance Card — EU AI Act</div>
            <div class="prompt-section">
                <strong>Style:</strong> Technical, data-driven design with computational icons. Use orange (⚡ for power/computation) and blue (💻 for technical) themes.
            </div>
            <div class="prompt-section">
                <strong>Content Structure:</strong><br><br>
                <strong>Header:</strong><br>
                "⚡ Article 51 Compliance Card — GP AI Model Classification"<br>
                Subtitle: "Determining systemic risk thresholds and obligations"<br><br>
                <strong>Section: Classification Criteria</strong><br>
                • Computational threshold: 10²⁵ FLOPs for training<br>
                • Multi-domain capability assessment<br>
                • Reasoning complexity evaluation<br>
                • Potential for widespread impact<br><br>
                <strong>Section: Assessment Methodology</strong><br>
                • FLOP count verification and documentation<br>
                • Capability benchmarking across domains<br>
                • Performance threshold analysis<br>
                • Systemic risk impact modeling<br><br>
                <strong>Section: Why It Matters</strong><br>
                • Frontier Model Providers: Understand regulatory obligations<br>
                • Cloud Providers: Assess hosted model requirements<br>
                • Enterprises: Plan for model selection and compliance<br>
                • Regulators: Objective classification criteria<br><br>
                <strong>Closing:</strong> "Classification clarity enables innovation within safe boundaries."
            </div>
        `,
        '52': `
            <div class="prompt-title">Title: Article 52 Compliance Card — EU AI Act</div>
            <div class="prompt-section">
                <strong>Style:</strong> Process-focused design with regulatory icons. Use gray (⚖️ for legal) and blue (📋 for documentation) themes.
            </div>
            <div class="prompt-section">
                <strong>Content Structure:</strong><br><br>
                <strong>Header:</strong><br>
                "📋 Article 52 Compliance Card — Regulatory Procedures"<br>
                Subtitle: "Notification and classification processes for GP AI models"<br><br>
                <strong>Section: Key Requirements</strong><br>
                • 14-day notification deadline to authorities<br>
                • Complete technical documentation submission<br>
                • Risk assessment and mitigation plans<br>
                • Ongoing communication and updates<br><br>
                <strong>Section: Compliance Testing</strong><br>
                • Process timeline verification<br>
                • Documentation completeness review<br>
                • Authority communication protocols<br>
                • Update and change management procedures<br><br>
                <strong>Section: Why It Matters</strong><br>
                • GP AI Providers: Avoid regulatory penalties<br>
                • Legal Teams: Understand procedural requirements<br>
                • Compliance Officers: Systematic process management<br>
                • Regulators: Streamlined oversight procedures<br><br>
                <strong>Closing:</strong> "Proper procedures prevent regulatory problems."
            </div>
        `,
        '53': `
            <div class="prompt-title">Title: Article 53 Compliance Card — EU AI Act</div>
            <div class="prompt-section">
                <strong>Style:</strong> Documentation-focused design with transparency icons. Use green (📚 for documentation) and blue (🔗 for connectivity) themes.
            </div>
            <div class="prompt-section">
                <strong>Content Structure:</strong><br><br>
                <strong>Header:</strong><br>
                "📚 Article 53 Compliance Card — GP AI Model Obligations"<br>
                Subtitle: "Baseline requirements for all general-purpose AI models"<br><br>
                <strong>Section: Core Obligations</strong><br>
                • Comprehensive technical documentation<br>
                • Model cards with capabilities and limitations<br>
                • Training data information and sourcing<br>
                • Downstream provider information sharing<br><br>
                <strong>Section: Red Teaming Focus</strong><br>
                • Documentation completeness verification<br>
                • Information sharing quality assessment<br>
                • Supply chain transparency testing<br>
                • Update notification system validation<br><br>
                <strong>Section: Why It Matters</strong><br>
                • GP AI Providers: Foundation for all compliance<br>
                • Downstream Users: Informed integration decisions<br>
                • Supply Chain: Transparent responsibility<br>
                • Regulators: Comprehensive oversight capability<br><br>
                <strong>Closing:</strong> "Documentation drives accountability across the AI supply chain."
            </div>
        `,
        '54': `
            <div class="prompt-title">Title: Article 54 Compliance Card — EU AI Act</div>
            <div class="prompt-section">
                <strong>Style:</strong> Professional, authoritative design with legal representation icons. Use blue (🤝 for partnership) and gray (🏛️ for institutions) themes.
            </div>
            <div class="prompt-section">
                <strong>Content Structure:</strong><br><br>
                <strong>Header:</strong><br>
                "🤝 Article 54 Compliance Card — Authorized Representatives"<br>
                Subtitle: "EU representation requirements for non-EU AI providers"<br><br>
                <strong>Section: Representative Requirements</strong><br>
                • Established EU presence and legal registration<br>
                • Full authority to act on provider's behalf<br>
                • Technical expertise in AI Act compliance<br>
                • 24/7 availability for regulatory communication<br><br>
                <strong>Section: Compliance Testing</strong><br>
                • Legal authority verification<br>
                • Response time and availability testing<br>
                • Technical competence assessment<br>
                • Coordination with parent organization<br><br>
                <strong>Section: Why It Matters</strong><br>
                • Non-EU Providers: Market access requirement<br>
                • Legal Firms: Service opportunity and expertise<br>
                • Compliance Teams: Local regulatory interface<br>
                • Regulators: Direct EU jurisdiction contact<br><br>
                <strong>Closing:</strong> "Local representation enables global AI innovation in Europe."
            </div>
        `,
        '55': `
            <div class="prompt-title">Title: Article 55 Compliance Card — EU AI Act</div>
            <div class="prompt-section">
                <strong>Style:</strong> High-security design with shield and testing icons. Use red (🛡️ for security) and orange (⚔️ for testing) themes.
            </div>
            <div class="prompt-section">
                <strong>Content Structure:</strong><br><br>
                <strong>Header:</strong><br>
                "🛡️ Article 55 Compliance Card — Systemic Risk Obligations"<br>
                Subtitle: "Enhanced requirements for high-capability AI models"<br><br>
                <strong>Section: Mandatory Requirements</strong><br>
                • Comprehensive adversarial testing (red teaming)<br>
                • Systemic risk assessment and mitigation<br>
                • Cybersecurity measures and monitoring<br>
                • Serious incident tracking and reporting<br><br>
                <strong>Section: Red Teaming Focus</strong><br>
                • Jailbreaking and prompt injection resistance<br>
                • Multi-step attack scenario testing<br>
                • Model extraction and data poisoning protection<br>
                • Real-time monitoring and incident detection<br><br>
                <strong>Section: Why It Matters</strong><br>
                • Frontier Models: Mandatory compliance requirement<br>
                • Security Teams: Comprehensive testing framework<br>
                • Governments: Systemic risk management<br>
                • Society: Protection from AI-driven systemic risks<br><br>
                <strong>Closing:</strong> "With great capability comes great responsibility — and great testing."
            </div>
        `
    };
    
    return prompts[articleNumber] || prompts['5'];
}

function copyGammaPrompt() {
    const promptText = document.getElementById('gamma-prompt-text').innerText;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(promptText).then(() => {
            showNotification('✅ Gamma prompt copied to clipboard!', 'success');
            
            // Update button temporarily
            const copyBtn = document.getElementById('copy-gamma-btn');
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                Copied!
            `;
            copyBtn.style.background = '#10b981';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
            }, 2000);
        }).catch(() => {
            fallbackCopyTextToClipboard(promptText);
        });
    } else {
        fallbackCopyTextToClipboard(promptText);
    }
    
    trackEvent('gamma', 'prompt_copied', `article${currentGammaArticle}_card`);
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('✅ Gamma prompt copied to clipboard!', 'success');
    } catch (err) {
        showNotification('⚠️ Could not copy text. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
}

function openGammaApp() {
    // Open Gamma.app in a new tab
    window.open('https://gamma.app', '_blank');
    showNotification('🚀 Gamma.app opened in new tab. Paste the prompt to get started!', 'info');
    trackEvent('gamma', 'app_opened', 'from_landing');
}

function downloadGammaGuide() {
    const guideContent = generateGammaGuide();
    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Gamma-App-Article-5-Guide.txt';
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('📎 Gamma.app guide downloaded!', 'success');
    trackEvent('gamma', 'guide_downloaded', 'article5_tutorial');
}

function generateGammaGuide() {
    return `
GAMMA.APP ARTICLE 5 COMPLIANCE CARD GUIDE
=========================================

How to Create Professional EU AI Act Presentations in 2 Minutes

🚀 QUICK START GUIDE:

1. Open Gamma.app (https://gamma.app)
2. Click "Create new presentation"
3. Select "Use AI to generate"
4. Paste the Article 5 prompt (copied from our website)
5. Click "Generate"
6. Customize colors, fonts, and content as needed
7. Export or share your compliance card

🎯 CUSTOMIZATION TIPS:

• Brand Colors: Replace red/gray with your company colors
• Logo Integration: Add your company logo to the header
• Content Focus: Emphasize the articles most relevant to your use case
• Audience Adaptation: Highlight the section most relevant to your stakeholders

📋 USE CASES:

• Board presentations on AI compliance
• Investor deck appendix on regulatory readiness  
• Team training materials on EU AI Act
• Client presentations showing compliance expertise
• Regulatory submission supporting documents

⚡ PRO TIPS:

• Save multiple versions for different audiences
• Export as PDF for offline sharing
• Use presenter mode for live discussions
• Embed interactive elements for engagement

🔗 NEXT STEPS:

1. Create your first Article 5 card
2. Share with your compliance team for feedback
3. Adapt for other EU AI Act articles (50, 51, 55)
4. Consider professional red teaming assessment with Aram Algorithm

Contact: contact@aramalgorithm.ai
Website: https://aramalgorithm.ai

---
© 2024 Aram Algorithm. All rights reserved.
`;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openContact,
        downloadArticle5Card,
        trackEvent,
        showNotification,
        initializeArticleSelector,
        closeModal,
        handleContactSubmit,
        selectPlan,
        calculateROI,
        selectOption,
        nextQuestion,
        previousQuestion,
        showResults,
        downloadRiskReport,
        downloadResource,
        openCalculator,
        registerWebinar,
        subscribeNewsletter,
        handleNewsletterSubmit,
        copyGammaPrompt,
        openGammaApp,
        downloadGammaGuide,
        selectGammaArticle,
        loadGammaArticle
    };
}

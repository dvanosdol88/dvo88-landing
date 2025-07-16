// Project link mappings based on your GitHub repositories
// This file is auto-generated from GitHub data and can be updated
const projectMappings = {
    "Car Dodge Game": {
        github: "https://github.com/dvanosdol88/Car_dodge",
        live: "https://car-dodge.dvo88.com",
        render: null
    },
    "Personal Dashboard": {
        github: "https://github.com/dvanosdol88/ChatGPT-Google-Dashboard",
        live: "https://dashboard.davidcfacfp.com",
        render: null
    },
    "A2A System": {
        github: "https://github.com/dvanosdol88/a2a-system",
        live: "https://a2a-dashboard.onrender.com",
        render: "https://dashboard.render.com/web/srv-csqfkcpu0jms739nrkcg"
    },
    "Interactive Resume": {
        github: "https://github.com/dvanosdol88/interactive_resume",
        live: "https://davidcfacfp.com",
        render: null
    },
    "MG Dashboard": {
        github: "https://github.com/dvanosdol88/mg-dashboard-deploy",
        live: null,
        render: null
    },
    "Calendar Backend": {
        github: "https://github.com/dvanosdol88/calendar-backend",
        live: null,
        render: null
    }
};

// Function to populate links based on project title
function autoPopulateLinks() {
    const projects = document.querySelectorAll('.draggable-card');
    let updated = false;
    
    projects.forEach(card => {
        const titleElement = card.querySelector('.project-title');
        if (!titleElement) return;
        
        const title = titleElement.innerText.trim();
        const mapping = projectMappings[title];
        
        if (mapping) {
            const liveLink = card.querySelector('.live-link');
            const githubLink = card.querySelector('.github-link');
            const renderLink = card.querySelector('.render-link');
            
            // Only update if link is empty or default
            if (githubLink && (!githubLink.href || githubLink.href === '#' || githubLink.href === window.location.href + '#')) {
                if (mapping.github) {
                    githubLink.href = mapping.github;
                    githubLink.style.display = 'inline-flex';
                    updated = true;
                }
            }
            
            if (liveLink && (!liveLink.href || liveLink.href === '#' || liveLink.href === window.location.href + '#')) {
                if (mapping.live) {
                    liveLink.href = mapping.live;
                    liveLink.style.display = 'inline-flex';
                    updated = true;
                }
            }
            
            if (renderLink && (!renderLink.href || renderLink.href === '#' || renderLink.href === window.location.href + '#')) {
                if (mapping.render) {
                    renderLink.href = mapping.render;
                    renderLink.style.display = 'inline-flex';
                    updated = true;
                }
            }
        }
    });
    
    if (updated) {
        // Save to localStorage
        if (typeof saveData === 'function') {
            saveData();
            console.log('Links auto-populated and saved!');
        }
    }
}

// Run when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(autoPopulateLinks, 1000); // Wait for dashboard to initialize
    });
} else {
    setTimeout(autoPopulateLinks, 1000);
}

// Export for console use
window.autoPopulateLinks = autoPopulateLinks;
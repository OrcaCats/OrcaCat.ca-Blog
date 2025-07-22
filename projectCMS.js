class ProjectsCMS {
    constructor(jsonPath = 'projects.json') {
        this.jsonPath = jsonPath;
        this.projects = [];
        this.settings = {};
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        
        this.init();
    }

    async init() {
        try {
            await this.loadProjects();
            this.renderProjects();
            this.setupEventListeners();
            console.log('Projects CMS initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Projects CMS:', error);
            this.renderErrorState();
        }
    }

    async loadProjects() {
        try {
            const response = await fetch(this.jsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.projects = data.projects || [];
            this.settings = data.settings || {};
            
            // Sort featured projects first if setting is enabled
            if (this.settings.showFeaturedFirst) {
                this.projects.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            throw error;
        }
    }

    renderProjects() {
        const container = document.querySelector('.projects-grid');
        if (!container) {
            console.error('Projects grid container not found');
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Filter and sort projects
        let filteredProjects = this.filterProjects();
        filteredProjects = this.sortProjects(filteredProjects);

        // Render each project
        filteredProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            container.appendChild(projectCard);
        });

        // Update project count if counter exists
        this.updateProjectCount(filteredProjects.length);
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        if (project.featured) {
            card.classList.add('featured');
        }
        
        card.onclick = () => this.openProjectModal(project.id);

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image || this.settings.defaultImage}" 
                     alt="${project.title}"
                     onerror="this.src='${this.settings.defaultImage}'">
                ${project.featured ? '<div class="featured-badge">Featured</div>' : ''}
            </div>
            <div class="project-content">
                <div class="project-date">${project.date}</div>
                <h3>${project.title}</h3>
                <p>${project.shortDescription}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        return card;
    }

    filterProjects() {
        if (this.currentFilter === 'all') {
            return this.projects;
        }
        
        if (this.currentFilter === 'featured') {
            return this.projects.filter(p => p.featured);
        }
        
        // Filter by tag
        return this.projects.filter(p => 
            p.tags.some(tag => tag.toLowerCase().includes(this.currentFilter.toLowerCase()))
        );
    }

    sortProjects(projects) {
        const sorted = [...projects];
        
        switch (this.currentSort) {
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'title-asc':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'title-desc':
                return sorted.sort((a, b) => b.title.localeCompare(a.title));
            default:
                return sorted;
        }
    }

    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            console.error('Project not found:', projectId);
            return;
        }

        const modal = document.getElementById('projectModal');
        const modalContent = document.getElementById('modalContent');
        
        if (!modal || !modalContent) {
            console.error('Modal elements not found');
            return;
        }
        
        modalContent.innerHTML = `
            <img src="${project.modalImage || project.image || this.settings.defaultModalImage}" 
                 alt="${project.title}" 
                 style="width: 100%; border-radius: 8px; margin-bottom: 20px;"
                 onerror="this.src='${this.settings.defaultModalImage}'">
            <h2>${project.title}</h2>
            <div class="modal-date">${project.date}</div>
            ${project.featured ? '<div class="featured-indicator">⭐ Featured Project</div>' : ''}
            <p>${project.fullDescription}</p>
            <div class="modal-details">
                <div class="detail-item">
                    <strong>Technologies:</strong>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                <div class="detail-item">
                    <strong>Team Size:</strong> ${project.teamSize}
                </div>
                <div class="detail-item">
                    <strong>Duration:</strong> ${project.duration}
                </div>
                <div class="detail-item">
                    <strong>Tags:</strong>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeProjectModal() {
        const modal = document.getElementById('projectModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    setupEventListeners() {
        // Modal close functionality
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => this.closeProjectModal();
        }

        // Close modal when clicking outside
        window.onclick = (event) => {
            const modal = document.getElementById('projectModal');
            if (event.target === modal) {
                this.closeProjectModal();
            }
        };

        // Escape key to close modal
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeProjectModal();
            }
        });

        // Filter buttons (if they exist)
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
                this.updateActiveFilter(e.target);
            });
        });

        // Sort dropdown (if it exists)
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.setSort(e.target.value);
            });
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.renderProjects();
    }

    setSort(sort) {
        this.currentSort = sort;
        this.renderProjects();
    }

    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    updateProjectCount(count) {
        const counter = document.getElementById('projectCount');
        if (counter) {
            counter.textContent = `Showing ${count} project${count !== 1 ? 's' : ''}`;
        }
    }

    renderErrorState() {
        const container = document.querySelector('.projects-grid');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <h3>Unable to load projects</h3>
                    <p>Please check that the projects.json file exists and is properly formatted.</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }

    // Public methods for dynamic updates
    async addProject(project) {
        project.id = project.id || `project_${Date.now()}`;
        this.projects.push(project);
        this.renderProjects();
        return project.id;
    }

    removeProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        this.renderProjects();
    }

    updateProject(projectId, updates) {
        const index = this.projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
            this.projects[index] = { ...this.projects[index], ...updates };
            this.renderProjects();
            return true;
        }
        return false;
    }

    getProject(projectId) {
        return this.projects.find(p => p.id === projectId);
    }

    getAllProjects() {
        return [...this.projects];
    }

    exportData() {
        return {
            projects: this.projects,
            settings: this.settings
        };
    }

    async refresh() {
        await this.loadProjects();
        this.renderProjects();
    }
}

// Global functions for backward compatibility
window.openProjectModal = function(projectId) {
    if (window.projectsCMS) {
        window.projectsCMS.openProjectModal(projectId);
    }
};

window.closeProjectModal = function() {
    if (window.projectsCMS) {
        window.projectsCMS.closeProjectModal();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectsCMS = new ProjectsCMS();
});
// ========================================
// BLOG CMS - JAVASCRIPT WITH EXTERNAL JSON
// ========================================

class BlogCMS {
    constructor() {
        this.posts = [];
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        this.searchQuery = '';
        this.viewMode = 'grid';
        this.isAdmin = false;
        this.editingPostId = null;
        this.jsonFile = 'blog.json'; // External JSON file
        
        this.init();
    }
    
    async init() {
        await this.loadPostsFromJSON();
        this.bindEvents();
        this.renderPosts();
        this.updateStats();
    }
    
    // ========================================
    // DATA MANAGEMENT - EXTERNAL JSON
    // ========================================
    
    async loadPostsFromJSON() {
        try {
            // Show loading state
            this.showLoading();
            
            const response = await fetch(this.jsonFile);
            if (!response.ok) {
                throw new Error(`Failed to load posts: ${response.status}`);
            }
            
            const data = await response.json();
            this.posts = data.posts || [];
            
            // Sort posts by date (newest first) by default
            this.sortPosts();
            
            console.log(`Loaded ${this.posts.length} posts from ${this.jsonFile}`);
            
        } catch (error) {
            console.error('Error loading posts from JSON:', error);
            this.showError('Failed to load blog posts. Please try again later.');
            this.posts = [];
        }
    }
    
    async savePostsToJSON() {
        // In a real-world scenario, this would send data to a server endpoint
        // For demo purposes, we'll save to localStorage as backup and show a message
        try {
            const jsonData = {
                lastUpdated: new Date().toISOString(),
                totalPosts: this.posts.length,
                posts: this.posts
            };
            
            // Save to localStorage as backup
            localStorage.setItem('blog_posts_backup', JSON.stringify(jsonData));
            
            // In production, this would be:
            // const response = await fetch('/api/blog/save', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(jsonData)
            // });
            
            this.showNotification('Posts saved successfully!', 'success');
            this.updateStats();
            
            console.log('Posts saved to backup storage');
            
        } catch (error) {
            console.error('Error saving posts:', error);
            this.showNotification('Failed to save posts', 'error');
        }
    }
    
    // ========================================
    // POST OPERATIONS
    // ========================================
    
    createPost(postData) {
        const newPost = {
            id: this.generateId(),
            ...postData,
            date: new Date().toISOString().split('T')[0],
            author: "Admin",
            featured: false
        };
        
        this.posts.unshift(newPost); // Add to beginning
        this.savePostsToJSON();
        this.renderPosts();
        return newPost;
    }
    
    updatePost(id, postData) {
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
            this.posts[index] = { ...this.posts[index], ...postData };
            this.savePostsToJSON();
            this.renderPosts();
            return this.posts[index];
        }
        return null;
    }
    
    deletePost(id) {
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
            const deletedPost = this.posts.splice(index, 1)[0];
            this.savePostsToJSON();
            this.renderPosts();
            return deletedPost;
        }
        return null;
    }
    
    getPostById(id) {
        return this.posts.find(post => post.id === id);
    }
    
    generateId() {
        return Math.max(...this.posts.map(post => post.id), 0) + 1;
    }
    
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    
    // ========================================
    // FILTERING & SORTING
    // ========================================
    
    getFilteredPosts() {
        let filtered = [...this.posts];
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(post => post.category === this.currentFilter);
        }
        
        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(this.searchQuery) ||
                post.excerpt.toLowerCase().includes(this.searchQuery) ||
                post.content.toLowerCase().includes(this.searchQuery) ||
                post.tags.some(tag => tag.toLowerCase().includes(this.searchQuery))
            );
        }
        
        return filtered;
    }
    
    sortPosts(posts = null) {
        const postsToSort = posts || this.posts;
        
        postsToSort.sort((a, b) => {
            switch (this.currentSort) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'reading-time-asc':
                    return a.readingTime - b.readingTime;
                case 'reading-time-desc':
                    return b.readingTime - a.readingTime;
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });
        
        return postsToSort;
    }
    
    getPaginatedPosts() {
        const filtered = this.getFilteredPosts();
        const sorted = this.sortPosts([...filtered]);
        
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        
        return {
            posts: sorted.slice(startIndex, endIndex),
            totalPosts: sorted.length,
            totalPages: Math.ceil(sorted.length / this.postsPerPage)
        };
    }
    
    // ========================================
    // RENDERING
    // ========================================
    
    renderPosts() {
        const { posts, totalPosts, totalPages } = this.getPaginatedPosts();
        const blogGrid = document.getElementById('blogGrid');
        const noResults = document.getElementById('noResults');
        
        if (!blogGrid) return;
        
        // Handle empty results
        if (posts.length === 0) {
            blogGrid.innerHTML = '';
            noResults.style.display = 'flex';
            this.hidePagination();
            return;
        }
        
        noResults.style.display = 'none';
        
        // Render featured post if exists and on first page
        this.renderFeaturedPost();
        
        // Set grid/list view class
        blogGrid.className = `blog-grid ${this.viewMode === 'list' ? 'list-view' : ''}`;
        
        // Render posts
        blogGrid.innerHTML = posts.map(post => this.renderPostCard(post)).join('');
        
        // Add click handlers
        this.addPostClickHandlers();
        
        // Render pagination
        this.renderPagination(totalPages);
        
        // Update post count
        this.updatePostCount(totalPosts);
    }
    
    renderPostCard(post) {
        const imageHtml = post.image ? 
            `<img src="${post.image}" alt="${post.title}" onerror="this.parentElement.innerHTML='<div class=\\"post-image-placeholder\\">${post.title.charAt(0)}</div>'">` :
            `<div class="post-image-placeholder">${post.title.charAt(0)}</div>`;
        
        const listViewClass = this.viewMode === 'list' ? 'list-view' : '';
        
        return `
            <article class="blog-post ${listViewClass}" data-post-id="${post.id}">
                <div class="post-image">
                    ${imageHtml}
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-date">${this.formatDate(post.date)}</span>
                        <span class="post-category">${post.category}</span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-footer">
                        <div class="post-tags">
                            ${post.tags.slice(0, 3).map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                        </div>
                        <span class="post-reading-time">${post.readingTime} min read</span>
                    </div>
                    ${this.isAdmin ? `
                        <div class="post-admin-actions">
                            <button onclick="blogCMS.editPost(${post.id})" class="edit-post-btn">Edit</button>
                            <button onclick="blogCMS.confirmDeletePost(${post.id})" class="delete-post-btn">Delete</button>
                        </div>
                    ` : ''}
                </div>
            </article>
        `;
    }
    
    renderFeaturedPost() {
        const featuredPost = this.posts.find(post => post.featured);
        const featuredSection = document.getElementById('featuredSection');
        const featuredContainer = document.getElementById('featuredPost');
        
        if (!featuredPost || this.currentPage !== 1 || this.currentFilter !== 'all' || this.searchQuery) {
            featuredSection.style.display = 'none';
            return;
        }
        
        featuredSection.style.display = 'block';
        const imageHtml = featuredPost.image ? 
            `<img src="${featuredPost.image}" alt="${featuredPost.title}">` :
            `<div class="post-image-placeholder" style="height: 400px; font-size: 48px;">${featuredPost.title.charAt(0)}</div>`;
        
        featuredContainer.innerHTML = `
            <article class="featured-post" data-post-id="${featuredPost.id}">
                <div class="featured-badge">Featured</div>
                <div class="featured-post-image">
                    ${imageHtml}
                </div>
                <div class="featured-post-content">
                    <div class="featured-post-meta">
                        <span class="featured-post-date">${this.formatDate(featuredPost.date)}</span>
                        <span class="featured-post-category">${featuredPost.category}</span>
                    </div>
                    <h3>${featuredPost.title}</h3>
                    <p>${featuredPost.excerpt}</p>
                    <div class="featured-post-footer">
                        <span class="reading-time">${featuredPost.readingTime} min read</span>
                        ${this.isAdmin ? `
                            <div class="post-admin-actions">
                                <button onclick="blogCMS.editPost(${featuredPost.id})" class="edit-post-btn">Edit</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </article>
        `;
        
        // Add click handler for featured post
        featuredContainer.querySelector('.featured-post').addEventListener('click', (e) => {
            if (!e.target.closest('.post-admin-actions')) {
                this.openPostModal(featuredPost.id);
            }
        });
    }
    
    renderPagination(totalPages) {
        const pagination = document.getElementById('pagination');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const pageNumbers = document.getElementById('pageNumbers');
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        
        // Update prev/next buttons
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
        
        // Generate page numbers
        let pagesHtml = '';
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pagesHtml += `
                    <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                            onclick="blogCMS.goToPage(${i})">${i}</button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                pagesHtml += `<span class="page-ellipsis">...</span>`;
            }
        }
        
        pageNumbers.innerHTML = pagesHtml;
    }
    
    // ========================================
    // MODAL FUNCTIONALITY
    // ========================================
    
    openPostModal(postId) {
        const post = this.getPostById(postId);
        if (!post) return;
        
        const modal = document.getElementById('blogModal');
        const modalContent = document.getElementById('modalContent');
        
        const imageHtml = post.image ? 
            `<img src="${post.image}" alt="${post.title}" class="modal-image">` : '';
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <div class="modal-meta">
                    <span class="modal-date">${this.formatDate(post.date)}</span>
                    <span class="modal-category">${post.category}</span>
                    <span class="modal-reading-time">${post.readingTime} min read</span>
                </div>
                <h2>${post.title}</h2>
            </div>
            ${imageHtml}
            <div class="modal-content-text">
                ${this.parseContent(post.content)}
            </div>
            <div class="modal-tags">
                ${post.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        const modal = document.getElementById('blogModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    parseContent(content) {
        // Basic markdown-like parsing
        return content
            .replace(/\n\n/g, '</p><p>')
            .replace(/^/g, '<p>')
            .replace(/$/g, '</p>')
            .replace(/## (.*?)(?=\n)/g, '<h3>$1</h3>')
            .replace(/### (.*?)(?=\n)/g, '<h4>$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/- (.*?)(?=\n)/g, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    }
    
    // ========================================
    // CMS ADMIN FUNCTIONALITY
    // ========================================
    
    toggleAdmin() {
        this.isAdmin = !this.isAdmin;
        const adminToggle = document.getElementById('adminToggle');
        const addNewPost = document.getElementById('addNewPost');
        
        if (this.isAdmin) {
            adminToggle.textContent = 'Exit Admin';
            adminToggle.style.background = '#dc3545';
            addNewPost.style.display = 'block';
        } else {
            adminToggle.textContent = 'Admin';
            adminToggle.style.background = '';
            addNewPost.style.display = 'none';
            this.closeCMS();
        }
        
        this.renderPosts();
    }
    
    openCMS(postId = null) {
        const cmsPanel = document.getElementById('cmsPanel');
        this.editingPostId = postId;
        
        if (postId) {
            const post = this.getPostById(postId);
            if (post) {
                this.populateForm(post);
                document.getElementById('deletePost').style.display = 'block';
            }
        } else {
            this.clearForm();
            document.getElementById('deletePost').style.display = 'none';
        }
        
        cmsPanel.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    closeCMS() {
        const cmsPanel = document.getElementById('cmsPanel');
        cmsPanel.classList.remove('open');
        document.body.style.overflow = 'auto';
        this.clearForm();
        this.editingPostId = null;
    }
    
    populateForm(post) {
        document.getElementById('postId').value = post.id;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postSlug').value = post.slug;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postReadingTime').value = post.readingTime;
        document.getElementById('postImage').value = post.image || '';
        document.getElementById('postExcerpt').value = post.excerpt;
        document.getElementById('postTags').value = post.tags.join(', ');
        document.getElementById('postContent').value = post.content;
    }
    
    clearForm() {
        document.getElementById('postId').value = '';
        document.getElementById('postTitle').value = '';
        document.getElementById('postSlug').value = '';
        document.getElementById('postCategory').value = 'tutorial';
        document.getElementById('postReadingTime').value = '';
        document.getElementById('postImage').value = '';
        document.getElementById('postExcerpt').value = '';
        document.getElementById('postTags').value = '';
        document.getElementById('postContent').value = '';
    }
    
    savePost() {
        const formData = this.getFormData();
        
        // Validation
        if (!this.validateForm(formData)) {
            return;
        }
        
        if (this.editingPostId) {
            // Update existing post
            this.updatePost(this.editingPostId, formData);
            this.showNotification('Post updated successfully!', 'success');
        } else {
            // Create new post
            this.createPost(formData);
            this.showNotification('Post created successfully!', 'success');
        }
        
        this.closeCMS();
    }
    
    getFormData() {
        const title = document.getElementById('postTitle').value.trim();
        return {
            title,
            slug: document.getElementById('postSlug').value.trim() || this.generateSlug(title),
            category: document.getElementById('postCategory').value,
            readingTime: parseInt(document.getElementById('postReadingTime').value),
            image: document.getElementById('postImage').value.trim(),
            excerpt: document.getElementById('postExcerpt').value.trim(),
            tags: document.getElementById('postTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            content: document.getElementById('postContent').value.trim()
        };
    }
    
    validateForm(data) {
        const errors = [];
        
        if (!data.title) errors.push('Title is required');
        if (!data.slug) errors.push('Slug is required');
        if (!data.excerpt) errors.push('Excerpt is required');
        if (!data.content) errors.push('Content is required');
        if (!data.readingTime || data.readingTime < 1) errors.push('Valid reading time is required');
        
        if (errors.length > 0) {
            this.showNotification('Please fix the following errors:\n' + errors.join('\n'), 'error');
            return false;
        }
        
        return true;
    }
    
    editPost(postId) {
        this.openCMS(postId);
    }
    
    confirmDeletePost(postId) {
        const post = this.getPostById(postId);
        if (!post) return;
        
        if (confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
            this.deletePost(postId);
            this.showNotification('Post deleted successfully!', 'success');
            this.closeCMS();
        }
    }
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    updateStats() {
        const postCount = document.querySelector('.post-count');
        const lastUpdated = document.getElementById('lastUpdated');
        
        if (postCount) {
            const total = this.posts.length;
            const categories = [...new Set(this.posts.map(post => post.category))].length;
            postCount.textContent = `${total} posts across ${categories} categories`;
        }
        
        if (lastUpdated) {
            lastUpdated.textContent = new Date().toLocaleDateString();
        }
    }
    
    updatePostCount(count) {
        const postCount = document.querySelector('.post-count');
        if (postCount && (this.currentFilter !== 'all' || this.searchQuery)) {
            postCount.textContent = `Showing ${count} of ${this.posts.length} posts`;
        }
    }
    
    showLoading() {
        const blogGrid = document.getElementById('blogGrid');
        if (blogGrid) {
            blogGrid.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading blog posts...</p>
                </div>
            `;
        }
    }
    
    showError(message) {
        const blogGrid = document.getElementById('blogGrid');
        if (blogGrid) {
            blogGrid.innerHTML = `
                <div class="error-state">
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()">Try Again</button>
                </div>
            `;
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    hidePagination() {
        const pagination = document.getElementById('pagination');
        if (pagination) pagination.style.display = 'none';
    }
    
    // ========================================
    // NAVIGATION & INTERACTION
    // ========================================
    
    setFilter(category) {
        this.currentFilter = category;
        this.currentPage = 1;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.renderPosts();
    }
    
    setViewMode(mode) {
        this.viewMode = mode;
        
        // Update active view button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${mode}View`).classList.add('active');
        
        this.renderPosts();
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.renderPosts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    resetFilters() {
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.currentPage = 1;
        
        // Reset UI
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === 'all');
        });
        
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        if (searchInput) searchInput.value = '';
        if (clearSearch) clearSearch.style.display = 'none';
        
        this.renderPosts();
    }
    
    addPostClickHandlers() {
        document.querySelectorAll('.blog-post').forEach(post => {
            post.addEventListener('click', (e) => {
                if (!e.target.closest('.post-admin-actions')) {
                    const postId = parseInt(post.dataset.postId);
                    this.openPostModal(postId);
                }
            });
        });
    }
    
    // ========================================
    // EVENT BINDING
    // ========================================
    
    bindEvents() {
        // Sort control
        document.getElementById('sortSelect')?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderPosts();
        });
        
        // View toggle
        document.getElementById('gridView')?.addEventListener('click', () => {
            this.setViewMode('grid');
        });
        
        document.getElementById('listView')?.addEventListener('click', () => {
            this.setViewMode('list');
        });
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.category);
            });
        });
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        
        searchInput?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.currentPage = 1;
            clearSearch.style.display = this.searchQuery ? 'block' : 'none';
            this.renderPosts();
        });
        
        clearSearch?.addEventListener('click', () => {
            searchInput.value = '';
            this.searchQuery = '';
            clearSearch.style.display = 'none';
            this.renderPosts();
        });
        
        // Reset filters
        document.getElementById('resetFilters')?.addEventListener('click', () => {
            this.resetFilters();
        });
        
        // Pagination
        document.getElementById('prevPage')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.goToPage(this.currentPage - 1);
            }
        });
        
        document.getElementById('nextPage')?.addEventListener('click', () => {
            const { totalPages } = this.getPaginatedPosts();
            if (this.currentPage < totalPages) {
                this.goToPage(this.currentPage + 1);
            }
        });
        
        // Modal close
        document.querySelector('.modal .close')?.addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('blogModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'blogModal') {
                this.closeModal();
            }
        });
        
        // Admin functionality
        document.getElementById('adminToggle')?.addEventListener('click', () => {
            this.toggleAdmin();
        });
        
        document.getElementById('addNewPost')?.addEventListener('click', () => {
            this.openCMS();
        });
        
        // CMS form handlers
        document.getElementById('closeCMS')?.addEventListener('click', () => {
            this.closeCMS();
        });
        
        document.getElementById('savePost')?.addEventListener('click', () => {
            this.savePost();
        });
        
        document.getElementById('cancelEdit')?.addEventListener('click', () => {
            this.closeCMS();
        });
        
        document.getElementById('deletePost')?.addEventListener('click', () => {
            if (this.editingPostId) {
                this.confirmDeletePost(this.editingPostId);
            }
        });
        
        // Auto-generate slug from title
        document.getElementById('postTitle')?.addEventListener('input', (e) => {
            const slugField = document.getElementById('postSlug');
            if (!slugField.value) {
                slugField.value = this.generateSlug(e.target.value);
            }
        });
        
        // Escape key handlers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                if (this.isAdmin) {
                    this.closeCMS();
                }
            }
        });
    }
}

// Initialize the blog CMS when DOM is loaded
let blogCMS;

document.addEventListener('DOMContentLoaded', function() {
    blogCMS = new BlogCMS();
});

// Add notification styles to head
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    max-width: 400px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transform: translateX(420px);
    transition: transform 0.3s ease;
    z-index: 10001;
}

.notification.show {
    transform: translateX(0);
}

.notification-content {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.notification-message {
    font-size: 14px;
    color: var(--text-primary);
    white-space: pre-line;
}

.notification-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: var(--text-muted);
    margin-left: 15px;
    padding: 0;
    line-height: 1;
}

.notification-close:hover {
    color: var(--text-primary);
}

.notification-success {
    border-left: 4px solid var(--success-color);
}

.notification-error {
    border-left: 4px solid var(--danger-color);
}

.notification-info {
    border-left: 4px solid var(--primary-color);
}

.error-state {
    text-align: center;
    padding: 60px 20px;
    grid-column: 1 / -1;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--card-shadow);
}

.error-state h3 {
    color: var(--danger-color);
    margin-bottom: 15px;
}

.error-state p {
    color: var(--text-muted);
    margin-bottom: 25px;
    line-height: 1.6;
}

.error-state button {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: var(--border-radius-small);
    cursor: pointer;
    font-family: inherit;
    font-weight: 600;
    transition: var(--transition);
}

.error-state button:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}

.post-admin-actions {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 10px;
}

.edit-post-btn, .delete-post-btn {
    padding: 6px 12px;
    border: none;
    border-radius: var(--border-radius-small);
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: var(--transition);
}

.edit-post-btn {
    background: var(--primary-color);
    color: white;
}

.edit-post-btn:hover {
    background: var(--secondary-color);
}

.delete-post-btn {
    background: var(--danger-color);
    color: white;
}

.delete-post-btn:hover {
    background: #c82333;
}

.page-ellipsis {
    padding: 8px 4px;
    color: var(--text-muted);
    font-size: 14px;
}
</style>
`;

// Inject notification styles
document.head.insertAdjacentHTML('beforeend', notificationStyles);
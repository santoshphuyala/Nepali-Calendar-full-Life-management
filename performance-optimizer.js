/**
 * ========================================
 * PERFORMANCE OPTIMIZER
 * Memory Leak Prevention & Performance Boost
 * ========================================
 */

class PerformanceOptimizer {
    constructor() {
        this.eventListeners = new Map();
        this.timeouts = new Map();
        this.intervals = new Map();
        this.domCache = new Map();
        this.chartInstances = new Map();
        this.init();
    }

    init() {
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
        
        // Cleanup on view changes
        this.observeViewChanges();
        
        // Optimize rendering
        this.setupRenderOptimization();
    }

    /**
     * Track event listeners for cleanup
     */
    addTrackedListener(element, event, callback, options = {}) {
        if (!element) return;
        
        element.addEventListener(event, callback, options);
        
        const key = `${element.id || 'anonymous'}-${event}`;
        if (!this.eventListeners.has(key)) {
            this.eventListeners.set(key, []);
        }
        this.eventListeners.get(key).push({ element, event, callback, options });
    }

    /**
     * Track timeouts for cleanup
     */
    addTrackedTimeout(callback, delay, key = null) {
        const timeoutId = setTimeout(callback, delay);
        const timeoutKey = key || `timeout-${timeoutId}`;
        this.timeouts.set(timeoutKey, timeoutId);
        return timeoutId;
    }

    /**
     * Clear tracked timeout
     */
    clearTrackedTimeout(key) {
        const timeoutId = this.timeouts.get(key);
        if (timeoutId) {
            clearTimeout(timeoutId);
            this.timeouts.delete(key);
        }
    }

    /**
     * Get cached DOM element
     */
    getCachedElement(selector, forceRefresh = false) {
        if (forceRefresh || !this.domCache.has(selector)) {
            const element = document.querySelector(selector);
            this.domCache.set(selector, element);
        }
        return this.domCache.get(selector);
    }

    /**
     * Get cached DOM elements
     */
    getCachedElements(selector, forceRefresh = false) {
        if (forceRefresh || !this.domCache.has(selector + '-list')) {
            const elements = document.querySelectorAll(selector);
            this.domCache.set(selector + '-list', elements);
        }
        return this.domCache.get(selector + '-list');
    }

    /**
     * Track chart instances
     */
    addChartInstance(key, chart) {
        // Destroy existing chart if any
        const existing = this.chartInstances.get(key);
        if (existing && typeof existing.destroy === 'function') {
            existing.destroy();
        }
        this.chartInstances.set(key, chart);
    }

    /**
     * Destroy chart instance
     */
    destroyChart(key) {
        const chart = this.chartInstances.get(key);
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
            this.chartInstances.delete(key);
        }
    }

    /**
     * Observe view changes for cleanup
     */
    observeViewChanges() {
        // Track view switches
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class' &&
                    mutation.target.classList.contains('view')) {
                    
                    // Clear cache when views change
                    this.clearViewCache();
                }
            });
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class'],
            subtree: true
        });
    }

    /**
     * Clear view-specific cache
     */
    clearViewCache() {
        // Clear DOM cache for view-specific elements
        const viewSelectors = ['.nav-tab', '.view', '.calendar-view-container'];
        viewSelectors.forEach(selector => {
            this.domCache.delete(selector);
            this.domCache.delete(selector + '-list');
        });
    }

    /**
     * Setup render optimization
     */
    setupRenderOptimization() {
        // Debounce rapid renders
        this.renderQueue = [];
        this.isRendering = false;
        
        // Throttle expensive operations
        this.throttledOperations = new Map();
    }

    /**
     * Debounce function calls
     */
    debounce(func, delay = 100) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Throttle function calls
     */
    throttle(func, limit = 100) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Batch DOM updates
     */
    batchDOMUpdates(updates) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                updates.forEach(update => update());
                resolve();
            });
        });
    }

    /**
     * Optimize database operations
     */
    async batchDatabaseOperations(operations) {
        // Group similar operations
        const grouped = operations.reduce((groups, op) => {
            if (!groups[op.type]) groups[op.type] = [];
            groups[op.type].push(op);
            return groups;
        }, {});

        // Execute in parallel where possible
        const results = await Promise.all(
            Object.entries(grouped).map(([type, ops]) => 
                this.executeBatch(type, ops)
            )
        );

        return results.flat();
    }

    /**
     * Execute batched database operations
     */
    async executeBatch(type, operations) {
        // Implementation depends on your database layer
        // This is a placeholder for batch optimization
        const results = [];
        for (const op of operations) {
            try {
                const result = await op.execute();
                results.push(result);
            } catch (error) {
                console.error('Batch operation failed:', error);
                results.push(null);
            }
        }
        return results;
    }

    /**
     * Memory usage monitoring
     */
    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit,
                listeners: this.eventListeners.size,
                timeouts: this.timeouts.size,
                charts: this.chartInstances.size,
                cachedElements: this.domCache.size
            };
        }
        return null;
    }

    /**
     * Cleanup all resources
     */
    cleanup() {
        console.log('🧹 Performance cleanup started');
        
        // Clear event listeners
        this.eventListeners.forEach((listeners, key) => {
            listeners.forEach(({ element, event, callback, options }) => {
                element.removeEventListener(event, callback, options);
            });
        });
        this.eventListeners.clear();

        // Clear timeouts
        this.timeouts.forEach((timeoutId, key) => {
            clearTimeout(timeoutId);
        });
        this.timeouts.clear();

        // Clear intervals
        this.intervals.forEach((intervalId, key) => {
            clearInterval(intervalId);
        });
        this.intervals.clear();

        // Destroy charts
        this.chartInstances.forEach((chart, key) => {
            if (typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.chartInstances.clear();

        // Clear DOM cache
        this.domCache.clear();

        console.log('✅ Performance cleanup completed');
    }

    /**
     * Optimize app initialization
     */
    async optimizeAppInit() {
        console.log('🚀 Optimizing app initialization...');
        
        // Lazy load non-critical modules
        const criticalModules = ['conversion', 'db', 'utils'];
        const nonCriticalModules = ['charts', 'import-export', 'notification'];
        
        // Load critical modules first
        await this.loadModules(criticalModules);
        
        // Load non-critical modules after initial render
        setTimeout(() => this.loadModules(nonCriticalModules), 100);
        
        // Optimize initial render
        this.optimizeInitialRender();
    }

    /**
     * Load modules dynamically
     */
    async loadModules(moduleNames) {
        // Implementation depends on your module loading strategy
        console.log('📦 Loading modules:', moduleNames);
    }

    /**
     * Optimize initial render
     */
    optimizeInitialRender() {
        // Use requestIdleCallback for non-critical rendering
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                // Render non-critical UI elements
                this.renderNonCriticalElements();
            });
        }
    }

    /**
     * Render non-critical elements
     */
    renderNonCriticalElements() {
        // Implement non-critical rendering
        console.log('🎨 Rendering non-critical elements');
    }
}

// Global instance
window.performanceOptimizer = new PerformanceOptimizer();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}

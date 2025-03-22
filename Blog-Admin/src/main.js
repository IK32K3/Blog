// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import our custom CSS
import './assets/css/style.css';

// Import our custom JS
import './assets/js/script.js';

// Detect if we're on GitHub Pages and adjust paths accordingly
const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/Blog/' : '/';

// Component loader
document.addEventListener('DOMContentLoaded', () => {
  // Load components
  const components = document.querySelectorAll('[data-inject]');
  
  components.forEach(component => {
    let path = component.getAttribute('data-inject');
    
    // Adjust path for GitHub Pages if needed
    if (isGitHubPages) {
      // Remove leading slash if it exists
      if (path.startsWith('/')) {
        path = path.substring(1);
      }
      path = basePath + path;
    }
    
    fetch(path)
      .then(response => response.text())
      .then(html => {
        component.innerHTML = html;
        
        // Re-initialize scripts that might be in the loaded component
        const scripts = component.querySelectorAll('script');
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
          } else {
            newScript.textContent = script.textContent;
          }
          document.body.appendChild(newScript);
        });
      })
      .catch(error => {
        console.error('Error loading component:', path, error);
        component.innerHTML = `<div class="alert alert-danger">Failed to load component: ${path}</div>`;
      });
  });

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Export the basePath for use in other modules
export { basePath };
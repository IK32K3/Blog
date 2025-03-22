import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './assets/css/style.css';

import './assets/js/script.js';

const getBaseUrl = () => {
  const currentUrl = window.location.href;
  if (currentUrl.includes('github.io')) {
    return '/Blog/Blog-Admin/';
  }
  return '/';
};

document.addEventListener('DOMContentLoaded', () => {
  const baseUrl = getBaseUrl();
  
  const components = document.querySelectorAll('[data-inject]');
  
  components.forEach(component => {
    let path = component.getAttribute('data-inject');
    
    if (!path.startsWith('http') && !path.startsWith(baseUrl)) {
      if (path.startsWith('/')) {
        path = path.substring(1);
      }
      path = baseUrl + path;
    }
    
    fetch(path)
      .then(response => response.text())
      .then(html => {
        component.innerHTML = html;

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
      });
  });

  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const toggleSidebarBtn = document.querySelector('.toggle-sidebar-btn');
  const sidebar = document.querySelector('.sidebar');
  const body = document.querySelector('body');
  const footer = document.querySelector('.footer');
  
  // Create sidebar overlay for mobile
  const sidebarOverlay = document.createElement('div');
  sidebarOverlay.className = 'sidebar-overlay';
  document.body.appendChild(sidebarOverlay);
  
  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('toggled');
      
      // Toggle body padding
      if (sidebar.classList.contains('toggled') && window.innerWidth > 1199) {
        body.style.paddingLeft = 'var(--sidebar-width)';
        footer.style.paddingLeft = 'calc(var(--sidebar-width) + 30px)';
      } else if (!sidebar.classList.contains('toggled') && window.innerWidth > 1199) {
        body.style.paddingLeft = '0';
        footer.style.paddingLeft = '30px';
      }
      
      // Toggle overlay on mobile
      if (window.innerWidth <= 1199) {
        sidebarOverlay.classList.toggle('active');
      }
    });
  }
  
  // Close sidebar when clicking outside on mobile
  sidebarOverlay.addEventListener('click', () => {
    if (sidebar.classList.contains('toggled') && window.innerWidth <= 1199) {
      sidebar.classList.remove('toggled');
      sidebarOverlay.classList.remove('active');
    }
  });
  
  // Adjust layout on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1199) {
      body.style.paddingLeft = 'var(--sidebar-width)';
      footer.style.paddingLeft = 'calc(var(--sidebar-width) + 30px)';
      sidebarOverlay.classList.remove('active');
    } else {
      if (!sidebar.classList.contains('toggled')) {
        body.style.paddingLeft = '0';
        footer.style.paddingLeft = '30px';
      }
    }
  });
  
  // Highlight active navigation links
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  const currentUrl = window.location.href;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && currentUrl.includes(href)) {
      link.classList.add('active');
      
      // Handle nested navigation
      const parentLi = link.closest('.nav-content-item');
      if (parentLi) {
        const parentNavLink = parentLi.querySelector('.nav-link');
        if (parentNavLink) {
          parentNavLink.classList.add('active');
          parentNavLink.click(); // Expand the parent menu
        }
      }
      
      // Handle dropdown toggles
      const parentCollapseEl = link.closest('.nav-content');
      if (parentCollapseEl) {
        const parentToggleBtn = document.querySelector(`[data-bs-target="#${parentCollapseEl.id}"]`);
        if (parentToggleBtn) {
          parentToggleBtn.classList.remove('collapsed');
          const parentCollapseTarget = document.getElementById(parentCollapseEl.id);
          if (parentCollapseTarget) {
            parentCollapseTarget.classList.add('show');
          }
        }
      }
    }
  });
  
  // Initialize DataTables if available
  if (typeof $.fn !== 'undefined' && typeof $.fn.DataTable !== 'undefined') {
    $('.datatable').DataTable({
      responsive: true,
      lengthChange: false,
      autoWidth: false,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search..."
      }
    });
  }
  
  // Initialize Charts
  initializeCharts();
});

function initializeCharts() {
  if (typeof Chart === 'undefined') return;

  const postsChartCanvas = document.getElementById('postsChart');
  if (postsChartCanvas) {
    const postsChart = new Chart(postsChartCanvas, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Posts',
          data: [65, 59, 80, 81, 56, 55, 40, 47, 52, 58, 62, 68],
          fill: false,
          borderColor: '#4154f1',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  const categoryChartCanvas = document.getElementById('categoryChart');
  if (categoryChartCanvas) {
    const categoryChart = new Chart(categoryChartCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Technology', 'Travel', 'Food', 'Health', 'Others'],
        datasets: [{
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            '#4154f1',
            '#2eca6a',
            '#ff771d',
            '#ffbf00',
            '#999999'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

// Improved confirm delete with better styling
const confirmDelete = (event, message = 'Are you sure you want to delete this item?') => {
  event.preventDefault();
  
  // Create modal backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop fade show';
  document.body.appendChild(backdrop);
  
  // Create confirm modal
  const modal = document.createElement('div');
  modal.className = 'modal fade show';
  modal.style.display = 'block';
  modal.setAttribute('tabindex', '-1');
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirm Deletion</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>${message}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger btn-confirm">Delete</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Handle close button
  const closeBtn = modal.querySelector('.btn-close');
  closeBtn.addEventListener('click', () => {
    modal.remove();
    backdrop.remove();
  });
  
  // Handle cancel button
  const cancelBtn = modal.querySelector('.btn-secondary');
  cancelBtn.addEventListener('click', () => {
    modal.remove();
    backdrop.remove();
  });
  
  // Handle confirm button
  const confirmBtn = modal.querySelector('.btn-confirm');
  confirmBtn.addEventListener('click', () => {
    modal.remove();
    backdrop.remove();
    
    // Get the original delete link and follow it or submit form
    const targetEl = event.target.closest('a, button');
    if (targetEl.tagName === 'A' && targetEl.href) {
      window.location.href = targetEl.href;
    } else if (targetEl.form) {
      targetEl.form.submit();
    }
  });
  
  return false;
};

// Improved form validation
const validateForm = (formId) => {
  const form = document.getElementById(formId);
  if (!form) return false;

  const requiredInputs = form.querySelectorAll('[required]');
  let isValid = true;

  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('is-invalid');
      isValid = false;
      
      // Scroll to first error
      if (!isValid) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      input.classList.remove('is-invalid');
    }
  });

  if (!isValid) {
    // Show feedback toast
    showToast('Please fill in all required fields', 'error');
  }

  return isValid;
};

// Image preview function
const previewImage = (input, previewId) => {
  const preview = document.getElementById(previewId);
  if (!preview) return;

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
};

// Toast notification function
const showToast = (message, type = 'success') => {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Show toast
  const bsToast = new bootstrap.Toast(toast, {
    autohide: true,
    delay: 5000
  });
  
  bsToast.show();
  
  // Remove toast after hidden
  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  });
};
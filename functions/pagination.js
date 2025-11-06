let currentPage = 1;
let pageSize = 10;
let paginationData = [];

// Initialize pagination
export function initPagination(data, renderCallback) {
  paginationData = data;
  currentPage = 1;
  
  // Set up event listeners
  setupPaginationListeners(renderCallback);
  
  // Initial render
  renderCallback();
}

// Update data and re-render
export function updatePaginationData(data, renderCallback) {
  paginationData = data;
  currentPage = 1;
  renderCallback();
}

// Get current page data
export function getCurrentPageData() {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, paginationData.length);
  return {
    data: paginationData.slice(startIndex, endIndex),
    startIndex,
    endIndex
  };
}

// Get pagination info
export function getPaginationInfo() {
  return {
    currentPage,
    pageSize,
    totalItems: paginationData.length,
    totalPages: Math.ceil(paginationData.length / pageSize)
  };
}

// Update pagination info display
export function updatePaginationInfo() {
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, paginationData.length);

  document.getElementById("startEntry").textContent = startEntry;
  document.getElementById("endEntry").textContent = endEntry;
  document.getElementById("totalEntries").textContent = paginationData.length;
}

// Update pagination controls
export function updatePaginationControls() {
  const totalPages = Math.ceil(paginationData.length / pageSize);

  // Update button states
  document.getElementById("firstBtn").disabled = currentPage === 1;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
  document.getElementById("lastBtn").disabled = currentPage === totalPages;

  // Generate page numbers
  const pageNumbersDiv = document.getElementById("pageNumbers");
  pageNumbersDiv.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = "pagination-btn" + (i === currentPage ? " active" : "");
    pageBtn.textContent = i;
    pageBtn.setAttribute('data-page', i);
    pageNumbersDiv.appendChild(pageBtn);
  }
}

// Set up event listeners
function setupPaginationListeners(renderCallback) {
  const firstBtn = document.getElementById("firstBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const lastBtn = document.getElementById("lastBtn");
  const pageNumbers = document.getElementById("pageNumbers");

  // Check if elements exist
  if (!firstBtn || !prevBtn || !nextBtn || !lastBtn || !pageNumbers) {
    console.error("One or more pagination elements not found");
    return;
  }

  // Define handlers
  const firstHandler = () => {
    currentPage = 1;
    renderCallback();
  };

  const prevHandler = () => {
    if (currentPage > 1) {
      currentPage--;
      renderCallback();
    }
  };

  const nextHandler = () => {
    const totalPages = Math.ceil(paginationData.length / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      renderCallback();
    }
  };

  const lastHandler = () => {
    currentPage = Math.ceil(paginationData.length / pageSize);
    renderCallback();
  };

  const pageNumbersHandler = (e) => {
    if (e.target.classList.contains("pagination-btn")) {
      const page = parseInt(e.target.getAttribute('data-page'));
      if (page) {
        currentPage = page;
        renderCallback();
      }
    }
  };

  // Remove old listeners (if they exist)
  firstBtn.replaceWith(firstBtn.cloneNode(true));
  prevBtn.replaceWith(prevBtn.cloneNode(true));
  nextBtn.replaceWith(nextBtn.cloneNode(true));
  lastBtn.replaceWith(lastBtn.cloneNode(true));
  pageNumbers.replaceWith(pageNumbers.cloneNode(true));

  // Get fresh references after cloning
  const newFirstBtn = document.getElementById("firstBtn");
  const newPrevBtn = document.getElementById("prevBtn");
  const newNextBtn = document.getElementById("nextBtn");
  const newLastBtn = document.getElementById("lastBtn");
  const newPageNumbers = document.getElementById("pageNumbers");

  // Add new listeners
  newFirstBtn.addEventListener("click", firstHandler);
  newPrevBtn.addEventListener("click", prevHandler);
  newNextBtn.addEventListener("click", nextHandler);
  newLastBtn.addEventListener("click", lastHandler);
  newPageNumbers.addEventListener("click", pageNumbersHandler);
}

// Change page size
export function setPageSize(size, renderCallback) {
  pageSize = size;
  currentPage = 1;
  renderCallback();
}

// Go to specific page
export function goToPage(page, renderCallback) {
  const totalPages = Math.ceil(paginationData.length / pageSize);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderCallback();
  }
}

// In pagination.js, add this export:
export function setupPageSizeSelector(selectorId, renderCallback) {
  const selector = document.getElementById(selectorId);
  if (selector) {
    selector.addEventListener('change', (e) => {
      setPageSize(parseInt(e.target.value), renderCallback);
    });
  }
}


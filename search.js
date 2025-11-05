import { getTotalPlayers, getTotalEvents, getAvgPlayersPerEvent, getTotalPrize, updateStatCards } from './queries.js'

let allData = [];
let selectedEvent;
let continualId;
let currentPage = 1;
let pageSize = 10;

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               LOAD DATA
//
// --------------------------------------------------------------------------------------------------------------------------

async function getAllRecentEventsContinualList() {
    try {
        const url = `https://coderelic.greenriverdev.com/query.php?queryType=getAllRecentEventsContinualList`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

(async function onPageLoad() {
    // Load all events data
    let data = await getAllRecentEventsContinualList();
    allData = data;
    
    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    
    if (searchQuery) {
        // Display search query in header
        const searchQueryDisplay = document.getElementById('searchQueryDisplay');
        if (searchQueryDisplay) {
            searchQueryDisplay.textContent = searchQuery;
        }
        
        // Fill the search input with the current query
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = searchQuery;
        }
        
        // Perform search
        performSearch(searchQuery);
    } else {
        // No search query, redirect to index
        window.location.href = 'index.html';
    }
})();

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               SEARCH FUNCTIONALITY
//
// --------------------------------------------------------------------------------------------------------------------------

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

// Handle search form submission
if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            // Reload page with new search query
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    });
}

function performSearch(query) {
    if (!allData || allData.length === 0) {
        console.error('No data available to search');
        return;
    }
    
    // Filter the data based on the query
    const filteredData = allData.filter(event => 
        event.name.toLowerCase().includes(query.toLowerCase()) ||
        event.city.toLowerCase().includes(query.toLowerCase()) ||
        event.state.toLowerCase().includes(query.toLowerCase()) ||
        event.country.toLowerCase().includes(query.toLowerCase()) ||
        (event.tier && event.tier.toLowerCase().includes(query.toLowerCase()))
    );
    
    // Update total results display
    const totalResults = document.getElementById('totalResults');
    if (totalResults) {
        totalResults.textContent = filteredData.length;
    }
    
    // Use filtered data for the table
    allData = filteredData;
    currentPage = 1;
    renderTable();
    
    // Log results
    console.log(`Search results for "${query}": ${filteredData.length} events found`);
}

// Back to events button
const backToEvents = document.getElementById('backToEvents');
if (backToEvents) {
    backToEvents.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               RENDER TABLE
//
// --------------------------------------------------------------------------------------------------------------------------

function renderTable() {
    const tableBody = document.getElementById('resultsTableBody');
    
    if (!tableBody) {
        console.error('Table body not found');
        return;
    }
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, allData.length);

    // Clear existing rows
    tableBody.innerHTML = '';

    // Add rows for current page
    for (let i = startIndex; i < endIndex; i++) {
        const item = allData[i];

        // Convert tier codes
        switch (item.tier) {
            case 'M':
                item.tierCode = 'tier-m'
                item.tier = 'Major'
                break;
            case 'NT':
                item.tierCode = 'tier-es'
                item.tier = 'Elite'
                break;
            case 'A':
                item.tierCode = 'tier-a'
                item.tier = 'Tier-A'
                break;
            case 'B':
                item.tierCode = 'tier-b'
                item.tier = 'Tier-B'
                break;
            case 'C':
                item.tierCode = 'tier-c'
                item.tier = 'Tier-C'
                break;
            case 'XA':
                item.tierCode = 'tier-xa'
                item.tier = 'Tier-XA'
                break;
            case 'XB':
                item.tierCode = 'tier-xb'
                item.tier = 'Tier-XB'
                break;
            case 'XC':
                item.tierCode = 'tier-xc'
                item.tier = 'Tier-XC'
                break;
            case 'XM':
                item.tierCode = 'tier-xm'
                item.tier = 'Tier-XM'
                break;
            default:
                break;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.start_date}</td>
            <td><span class="tier-badge ${item.tierCode}">${item.tier}</span></td>
            <td>${item.city}</td>
            <td>${item.state}</td>
            <td>${item.country}</td>
        `;

        row.addEventListener('click', () => {
            selectedEvent = item;
            continualId = item.id;
            // You can add event detail functionality here if needed
        });

        tableBody.appendChild(row);
    }

    // Fill empty rows
    const rowsToFill = pageSize - (endIndex - startIndex);
    for (let i = 0; i < rowsToFill; i++) {
        const emptyRow = document.createElement('tr');
        emptyRow.className = 'empty-row';
        emptyRow.innerHTML = `
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        `;
        tableBody.appendChild(emptyRow);
    }

    updatePaginationInfo();
    updatePaginationControls();
}

// --------------------------------------------------------------------------------------------------------------------------
//
//                                               PAGINATION
//
// --------------------------------------------------------------------------------------------------------------------------

function updatePaginationInfo() {
    const startEntry = (currentPage - 1) * pageSize + 1;
    const endEntry = Math.min(currentPage * pageSize, allData.length);

    const startEntryEl = document.getElementById('startEntry');
    const endEntryEl = document.getElementById('endEntry');
    const totalEntriesEl = document.getElementById('totalEntries');
    
    if (startEntryEl) startEntryEl.textContent = allData.length > 0 ? startEntry : 0;
    if (endEntryEl) endEntryEl.textContent = endEntry;
    if (totalEntriesEl) totalEntriesEl.textContent = allData.length;
}

function updatePaginationControls() {
    const totalPages = Math.ceil(allData.length / pageSize);

    const firstBtn = document.getElementById('firstBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const lastBtn = document.getElementById('lastBtn');
    
    if (firstBtn) firstBtn.disabled = currentPage === 1;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    if (lastBtn) lastBtn.disabled = currentPage === totalPages;

    const pageNumbersDiv = document.getElementById('pageNumbers');
    if (pageNumbersDiv) {
        pageNumbersDiv.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');
            pageBtn.textContent = i;
            pageBtn.onclick = () => {
                currentPage = i;
                renderTable();
            };
            pageNumbersDiv.appendChild(pageBtn);
        }
    }
}

// Pagination event listeners
const firstBtn = document.getElementById('firstBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const lastBtn = document.getElementById('lastBtn');

if (firstBtn) {
    firstBtn.addEventListener('click', () => {
        currentPage = 1;
        renderTable();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(allData.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
}

if (lastBtn) {
    lastBtn.addEventListener('click', () => {
        currentPage = Math.ceil(allData.length / pageSize);
        renderTable();
    });
}
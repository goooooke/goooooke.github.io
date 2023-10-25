const search = document.getElementById('search');
const resultsContainer = document.getElementById('autocomplete-results');
let keywords = [];
let selectedIndex = -1;

window.addEventListener('DOMContentLoaded', fetchKeywords);

function fetchKeywords() {
    fetch('searchData.json')
    .then(response => response.json())
    .then(data => {
        keywords = data;
    })
    .catch(error => {
        console.error('데이터를 불러오는 데 실패했습니다:', error);
    });
}

search.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    let matchedKeywords = [];

    if (query) {
        matchedKeywords = keywords.filter(keyword => keyword.toLowerCase().startsWith(query));
    }

    displayResults(matchedKeywords);
    selectedIndex = -1;
});

search.addEventListener('keydown', function(e) {
    const items = resultsContainer.children;
    switch (e.key) {
        case 'ArrowDown':
            if (selectedIndex < items.length - 1) {
                if (selectedIndex !== -1) {
                    items[selectedIndex].classList.remove('highlight');
                }
                selectedIndex++;
                items[selectedIndex].classList.add('highlight');
            }
            break;
        case 'ArrowUp':
            if (selectedIndex > 0) {
                items[selectedIndex].classList.remove('highlight');
                selectedIndex--;
                items[selectedIndex].classList.add('highlight');
            }
            break;
        case 'Enter':
            if (selectedIndex !== -1) {
                search.value = items[selectedIndex].textContent;
                redirectToResultPage(search.value);
                e.preventDefault();
            }
            break;
    }
});

function displayResults(keywords) {
    if (keywords.length) {
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = keywords.map(keyword => `<div>${keyword}</div>`).join('');
    } else {
        resultsContainer.style.display = 'none';
    }
}

resultsContainer.addEventListener('click', function(e) {
    if (e.target.tagName === 'DIV') {
        search.value = e.target.textContent;
        redirectToResultPage(search.value);
    }
});

function redirectToResultPage(query) {
    window.location.href = `result.html?query=${encodeURIComponent(query)}`;
}

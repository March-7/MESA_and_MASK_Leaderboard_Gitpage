async function loadLeaderboard() {
    try {
        const response = await fetch('deception_results.csv');
        const text = await response.text();

        const lines = text.trim().split('\n');
        const headers = lines[0].split(',');

        // Parse data lines and sort by Deception Rate @1 (%)
        const dataLines = [];
        for (let i = 1; i < lines.length; i++) {
            const cells = lines[i].split(',');
            dataLines.push({
                line: lines[i],
                cells: cells,
                deceptionRate: parseFloat(cells[2]) // Deception Rate @1 (%) is now the third column (after URL)
            });
        }

        // Sort by Deception Rate @1 (%) in descending order
        dataLines.sort((a, b) => b.deceptionRate - a.deceptionRate);

        // Build table header
        const headerRow = document.getElementById('headerRow');

        // Add rank header first
        const rankTh = document.createElement('th');
        rankTh.textContent = 'Rank';
        headerRow.appendChild(rankTh);

        headers.forEach((header, index) => {
            if (index !== 1) { // Skip the URL column header
                const th = document.createElement('th');
                th.textContent = header.trim();
                headerRow.appendChild(th);
            }
        });

        // Build table body
        const tableBody = document.getElementById('tableBody');
        for (let i = 0; i < dataLines.length; i++) {
            const row = document.createElement('tr');
            const cells = dataLines[i].cells;

            // Add rank cell first
            const rankTd = document.createElement('td');
            rankTd.classList.add('rank');
            rankTd.textContent = (i + 1).toString();
            row.appendChild(rankTd);

            cells.forEach((cell, index) => {
                if (index === 1) {
                    // Skip URL column in display, but use it for model name link
                    return;
                }

                const td = document.createElement('td');
                if (index === 0) {
                    // Model name column with link
                    td.classList.add('model-name');
                    const link = document.createElement('a');
                    link.href = cells[1].trim(); // URL is in cells[1]
                    link.textContent = cell.trim();
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    td.appendChild(link);
                } else if (index === 2) {
                    // Deception Rate @1 column
                    td.classList.add('metric');
                    td.textContent = cell.trim();
                } else {
                    td.classList.add('metric');
                    td.textContent = cell.trim();
                }
                row.appendChild(td);
            });

            tableBody.appendChild(row);
        }

        // Hide loading and show table
        document.getElementById('loading').style.display = 'none';
        document.querySelector('.table-wrapper').style.display = 'block';

    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('loading').textContent = 'Error loading data';
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();

    // Q&A Modal functionality
    const modal = document.getElementById('qaModal');
    const btn = document.getElementById('qaButton');
    const span = document.getElementsByClassName('qa-close')[0];

    // Open modal when button is clicked
    btn.onclick = function() {
        modal.style.display = 'block';
    }

    // Close modal when X is clicked
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
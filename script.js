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
                deceptionRate: parseFloat(cells[1]) // Deception Rate @1 (%) is the second column
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

        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.trim();
            headerRow.appendChild(th);
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
                const td = document.createElement('td');
                if (index === 0) {
                    // Model name column
                    td.classList.add('model-name');
                } else if (index === 1) {
                    // Deception Rate @1 column - add highlighting
                    const value = parseFloat(cell);
                    td.classList.add('metric');
                    if (value < 30) {
                        td.classList.add('low');
                    } else if (value < 60) {
                        td.classList.add('medium');
                    } else {
                        td.classList.add('high');
                    }
                } else {
                    td.classList.add('metric');
                }
                td.textContent = cell.trim();
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
document.addEventListener('DOMContentLoaded', loadLeaderboard);
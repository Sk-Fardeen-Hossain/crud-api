document.addEventListener('DOMContentLoaded', function() {
    fetch('/items')
        .then(response => response.json())
        .then(items => {
            const container = document.getElementById('items-container');
            container.innerHTML = ''; // Clear the container before adding items

            items.forEach(item => {
                const card = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${item.itemname}</h5>
                            <p class="card-text">${item.details}</p>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            const container = document.getElementById('items-container');
            container.innerHTML = '<p class="text-danger">Unable to load items at this time.</p>';
        });
});

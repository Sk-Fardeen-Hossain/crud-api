// scripts/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('itemForm');
    const itemList = document.getElementById('itemList');
    const formMessage = document.getElementById('formMessage');

    async function loadItems() {
        try {
            const response = await fetch('/items');
            const items = await response.json();
            itemList.innerHTML = items.map(item => `
                <li>
                    <strong>${item.itemname}</strong>
                    <p>${item.details}</p>
                    <div class="item-actions">
                        <button data-id="${item._id}" class="edit-btn">Edit</button>
                        <button data-id="${item._id}" class="delete-btn">Delete</button>
                    </div>
                </li>
            `).join('');
        } catch (error) {
            console.error('Error loading items:', error);
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemname = document.getElementById('itemname').value;
        const details = document.getElementById('details').value;

        try {
            const response = await fetch('/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemname, details })
            });
            const result = await response.json();
            if (result.success) {
                formMessage.textContent = 'Item added successfully!';
                form.reset();
                loadItems();
            } else {
                formMessage.textContent = result.message;
            }
        } catch (error) {
            console.error('Error adding item:', error);
            formMessage.textContent = 'An error occurred while adding the item.';
        }
    });

    itemList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            try {
                await fetch(`/items/${id}`, { method: 'DELETE' });
                loadItems();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        } else if (e.target.classList.contains('edit-btn')) {
            // Handle edit functionality
        }
    });

    loadItems();
});

window.addEventListener('keydown', checkKey);

async function checkKey(event) {
    if (event.key == 'p') {
        const data = await window.electronAPI.printList();
    }
}
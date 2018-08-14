function add_drag_hanlder() {
    let img = document.querySelector('img');
    img.draggable = true;
    img.addEventListener('dragstart', function(event) {
        console.log('on dragstart');
        event.dataTransfer.setData('text', 'yo');
    });
}
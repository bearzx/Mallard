window.vis_count = 0;

$(document).ready(function() {

});

function add_new_vis() {
    let template = `
        <div id="vis-${window.vis_count}" class="vis-slot">
            <h3 class="vis-placeholder">#vis-${window.vis_count}</h3>
        </div>
    `;
    window.vis_count += 1;
    $('#wrap').append(template);
}

function rm_vis() {
    // todo
}
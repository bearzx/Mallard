window.plot_count = 0;

$(document).ready(function() {

});

function new_plot() {
    let template = `
        <div id="plot-${window.plot_count}" class="plot-slot">
            <h3 class="plot-placeholder">plots-${window.plot_count}</h3>
        </div>
    `;
    window.plot_count += 1;
    $('#wrap').append(template);
}

function set_canvas(plot_id) {

}

function set_html(plot_id, html) {
    $(plot_id).html(html);
}

function rm_plot() {
    // todo
}
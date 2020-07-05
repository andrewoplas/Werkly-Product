/* ================= FullWidthCellRenderer ================= */
function FullWidthCellRenderer() {}

FullWidthCellRenderer.prototype.init = function (params) {
    // trick to convert string of html into dom object
    var eTemp = document.createElement("div");
    eTemp.innerHTML = this.getTemplate(params);
    this.eGui = eTemp.firstElementChild;
};

FullWidthCellRenderer.prototype.getTemplate = function (params) {
    // the flower row shares the same data as the parent row
    const data = params.node.data;

    const template =
        '<div class="item">' +
        '    <div class="icon ' +
        data.color +
        '">' +
        '        <i class="' +
        data.icon +
        '"></i>' +
        "    </div>" +
        '    <div class="details">' +
        '        <a href="' +
        data.labelLink +
        '" class="Link">' +
        data.label +
        "</a>" +
        '        <p class="description">' +
        data.description +
        "</p>" +
        "    </div>" +
        '    <span class="time">' +
        data.time +
        "</span>" +
        "</div>";

    return template;
};

FullWidthCellRenderer.prototype.getGui = function () {
    return this.eGui;
};

function getData() {
    const colors = ["red", "green", "purple", "violet"];

    return {
        label: "Activity Label Goes Here",
        labelLink: "#",
        description: "Activity description or overview goes here in this space, it can be quite long.",
        time: "5 hours ago",
        icon: "fad fa-chart-line", // font awesome icon classes only
        color: colors[Math.floor(Math.random() * colors.length)], // enum: red, green, purple, violet
    };
}

/* ================= Listeners ================= */
function initializeGridTable(element) {
    const rowData = [];
    for (let i = 0; i < 6; i++) {
        rowData.push(getData());
    }

    new agGrid.Grid($(element)[0], {
        columnDefs: [{ field: "empty", cellRenderer: "cellRenderer" }],
        defaultColDef: {
            flex: 1,
            resizable: true,
        },
        headerHeight: 0,
        rowHeight: 60,
        domLayout: "autoHeight",
        components: { cellRenderer: FullWidthCellRenderer },
        rowData: rowData,
        suppressRowClickSelection: true,
        onGridReady(params) {
            $(".btn-show-filter").click(function () {
                $(".filter-configuration-panel").toggleClass("shown");
            });
        },
    });
}

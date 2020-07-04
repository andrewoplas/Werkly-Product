const rowCount = 100;

/* ================= LinkCellRenderer ================= */
function LinkCellRenderer() {}

LinkCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement("span");

    const data = params.value;
    const html = '<a href="' + data.link + '" class="Link">' + data.label + "</a> <button class='Button mini ml-2'>Mini-button</button>";

    this.eGui.innerHTML = html;
};

LinkCellRenderer.prototype.getGui = function () {
    return this.eGui;
};

/* ================= CheckboxCellRenderer ================= */
function CheckboxCellRenderer() {}

CheckboxCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement("span");

    const html =
        '<div class="Checkbox CellCheckbox">' + "<label>" + '<input type="checkbox" name="demo" />' + "<span></span>" + "</label>" + "</div>";

    this.eGui.innerHTML = html;
};

CheckboxCellRenderer.prototype.getGui = function () {
    return this.eGui;
};

/* ================= Initialize AG Grid ================= */
function initializeGridTable(element) {
    const data = {
        column1: {
            label: "A clickable label",
            link: "#",
        },
        column2: "Standard Label",
        column3: "Standard Label Standard Label Standard Label",
        column4: "Standard Label",
    };
    const rowData = new Array(rowCount).fill(data);

    new agGrid.Grid($(element)[0], {
        headerHeight: 45,
        columnDefs: [
            {
                headerName: "",
                field: "athlete",
                width: 45,
                minWidth: 45,
                maxWidth: 45,
                headerCheckboxSelection: true,
                checkboxSelection: true,
                sortable: false,
                cellClass: "col-checkbox",
                cellRenderer: "checkboxCellRenderer",
                headerComponentParams: {
                    template:
                        '<div class="ag-cell-label-container custom-header-checkbox" role="presentation">' +
                        '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                        '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                        '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                        '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                        '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                        '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                        '<div class="Checkbox HeaderCheckbox">' +
                        "<label>" +
                        '<input type="checkbox" name="demo" />' +
                        "<span class='m-0'></span>" +
                        "</label>" +
                        "</div>" +
                        '    <a href="https://ag-grid.com" target="_blank"> <span ref="eText" class="ag-header-cell-text" role="columnheader"></span></a>' +
                        '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                        "  </div>" +
                        "</div>",
                },
            },
            { headerName: "Column #1", field: "column1", minWidth: 300, cellRenderer: "linkCellRenderer" },
            { headerName: "Column #2", field: "column2", flex: 1, minWidth: 200 },
            { headerName: "Column #3", field: "column3", minWidth: 400 },
            { headerName: "Column #4", field: "column4", flex: 1, minWidth: 200 },
        ],
        defaultColDef: {
            sortable: true,
        },
        rowHeight: 45,
        domLayout: "autoHeight",
        rowClass: "custom-row",
        rowData: rowData,
        rowSelection: "multiple",
        pagination: true,
        paginationPageSize: 10,
        components: {
            linkCellRenderer: LinkCellRenderer,
            checkboxCellRenderer: CheckboxCellRenderer,
        },
        unSortIcon: true,
        icons: {
            sortAscending:
                '<div class="sorting-icons ml-2">' +
                '    <i class="fas fa-caret-up asc active"></i>' +
                '    <i class="fas fa-caret-down desc"></i>' +
                "</div>",
            sortDescending:
                '<div class="sorting-icons ml-2">' +
                '    <i class="fas fa-caret-up asc"></i>' +
                '    <i class="fas fa-caret-down desc active"></i>' +
                "</div>",
            sortUnSort:
                '<div class="sorting-icons ml-2">' +
                '    <i class="fas fa-caret-up asc"></i>' +
                '    <i class="fas fa-caret-down desc"></i>' +
                "</div>",
        },
        onGridReady(params) {
            $(".btn-show-filter").click(function () {
                $(".filter-configuration-panel").toggleClass("shown");
            });

            checkboxOnchange(element);
            onPageNunmberChange(params.api, rowData);
            onPaginate(params.api, 10, rowData);
        },
    });
}

/* ================= Listeners ================= */
const checkboxOnchange = function (tableName) {
    const table = $(tableName);

    table.find('.HeaderCheckbox [type="checkbox"]').on("change", function () {
        let isChecked = $(this).is(":checked");
        const name = $(this).attr("name");

        if ($(this).hasClass("minus")) {
            $(this).prop("checked", true);
            isChecked = true;
        }

        $(this).removeClass("minus");
        table.find('.CellCheckbox [name="' + name + '"]').prop("checked", isChecked);
        showHideCheckboxOptions(isChecked);
    });

    table.find('.CellCheckbox [type="checkbox"]').on("change", function () {
        const totalCheckboxes = table.find('.CellCheckbox [type="checkbox"]').length;
        const checkedCount = table.find('.CellCheckbox [type="checkbox"]:checked').length;
        showHideCheckboxOptions(checkedCount > 0);
        table.find('.HeaderCheckbox [type="checkbox"]').prop("checked", checkedCount > 0);
        if (totalCheckboxes === checkedCount) {
            table.find('.HeaderCheckbox [type="checkbox"]').removeClass("minus");
        } else {
            table.find('.HeaderCheckbox [type="checkbox"]').addClass("minus");
        }
    });

    const showHideCheckboxOptions = function (shouldShow) {
        if (shouldShow) {
            $(".AdvanceList2 .header").addClass("selected");
        } else {
            $(".AdvanceList2 .header").removeClass("selected");
        }
    };
};

const onPageNunmberChange = function (api, rowData) {
    $(".page-length").click(function () {
        const length = $(this).attr("value");
        api.paginationSetPageSize(Number(length));
        onPaginate(api, Number(length), rowData);

        $("#page-length-container .length-value").text(length);
    });
};

const onPaginate = function (api, pageSize, rowData) {
    const paginate = $(".Pagination");
    const paginateContent = $("#paginate .content");

    const reachedStart = function () {
        paginate.find(".last").removeClass("disabled");
        paginate.find(".first").addClass("disabled");
    };

    const reachedLast = function () {
        paginate.find(".first").removeClass("disabled");
        paginate.find(".last").addClass("disabled");
    };

    const reachedMiddle = function () {
        paginate.find(".first").removeClass("disabled");
        paginate.find(".last").removeClass("disabled");
    };

    paginate.find(".first").click(function () {
        paginateContent.pagination(1);
        reachedStart();
    });

    paginate.find(".last").click(function () {
        paginateContent.pagination(pageSize);
        reachedLast();
    });

    paginateContent.pagination({
        showPageNumbers: $(window).width() > 576,
        pageSize: pageSize,
        dataSource: rowData,
        prevText: "Previous",
        nextText: "Next",
        callback: function (data, pagination) {
            const pageNumber = pagination.pageNumber;
            api.paginationGoToPage(pageNumber);

            if (pageNumber == 1) {
                reachedStart();
            } else if (pageNumber == pageSize) {
                reachedLast();
            } else {
                reachedMiddle();
            }
        },
    });
};

// const onPaginate = function (api) {
//     paginate.find("li").click(function () {
//         const classClicked = $(this).data("goto");
//         switch (classClicked) {
//             case "first":
//                 api.paginationGoToFirstPage();
//                 break;
//             case "last":
//                 api.paginationGoToLastPage();
//                 break;
//             case "previous":
//                 api.paginationGoToPreviousPage();
//                 break;
//             case "next":
//                 api.paginationGoToNextPage();
//                 break;
//             default:
//                 break;
//         }

//         const currentPage = api.paginationGetCurrentPage() + 1;
//         if (currentPage === 1) {
//             reachedStart();
//         } else if (currentPage === api.paginationGetTotalPages()) {
//             reachedLast();
//         }

//         console.log("paginationGetCurrentPage", api.paginationGetCurrentPage());
//     });
// };

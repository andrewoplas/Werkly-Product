function initializeListFilterListeners() {
    mainListeners();
    selectFiltersOptionsListeners();
    selectFiltersValueListeners();

    // Initialize datepicker
    const datepicker = $('[data-toggle="datepicker"]')
        .datepicker({ autoHide: true })
        .on("pick.datepicker", function (e) {
            // Get date
            const day = e.date.getDate() + getOrdinalDate(e.date.getDate());
            const month = $(this).datepicker("getMonthName");
            const year = e.date.getFullYear();

            // Set date
            $(this).val(`${day} ${month}, ${year}`);
            e.preventDefault();
        });
    $('[data-toggle="datepicker"]').datepicker("pick");
}

function mainListeners() {
    const listFilter = $(".ListFilter");

    // Remove added filter
    $(document).on("click", ".ListFilter .filters-list .item .remove", function () {
        $(this)
            .parents(".item")
            .hide(100, function () {
                const filterItemsCount = listFilter.find(".main .filters-list .item:visible").length;
                actionButtonVisibility(filterItemsCount > 0); // 1 is for the cloneable row
            });
    });

    // Add filter (Display list of filters)
    listFilter.find(".btn-filter").click(function () {
        showScreen(".select-filters-container");
    });

    // Actions buttons listener - Save
    listFilter.find(".action-buttons .btn-save").click(function () {
        alert("Save clicked!");
    });
}

function selectFiltersOptionsListeners() {
    const listFilter = $(".ListFilter");

    // Select filter (Display conditions)
    listFilter.find(".select-filters-container .filters .item").click(function () {
        const filterName = $(this).text();
        const type = $(this).attr("type");

        if (type == "text") {
            listFilter.find(".select-filters-value .options .item").removeClass("d-none");
            listFilter.find(".select-filters-value .options .item .query-value.text").removeClass("d-none");

            listFilter.find(".select-filters-value .options .item.date").addClass("d-none");
            listFilter.find(".select-filters-value .options .item .query-value.date").addClass("d-none");
        } else if (type == "date") {
            listFilter.find(".select-filters-value .options .item").removeClass("d-none");
            listFilter.find(".select-filters-value .options .item .query-value.text").addClass("d-none");
            listFilter.find(".select-filters-value .options .item .query-value.date").removeClass("d-none");
        }

        // Display selected filter name
        listFilter.find(".select-filters-value .option-selected .title").text(filterName);

        // Reset fields
        listFilter.find(".select-filters-value .options .item .selector").addClass("d-none");
        listFilter.find(".select-filters-value .options .item [type='radio']").prop("checked", false);
        listFilter.find(".select-filters-value .options .item [type='text']").val("");
        listFilter.find(".select-filters-value .options .item select").prop("selectedIndex", 0);
        $(".ui.dropdown").dropdown("clear");

        showScreen(".select-filters-value");
    });

    // Go back
    listFilter.find(".select-filters-container .btn-back").click(function () {
        showScreen(".main");
    });
}

function selectFiltersValueListeners() {
    const listFilter = $(".ListFilter");

    // Select filter condition
    listFilter.find(".select-filters-value .options .item .choice").click(function () {
        $(this).parents(".options").find(".selector").addClass("d-none");
        $(this).parents(".item").find(".selector").removeClass("d-none");
        $(this).parents(".select-filters-value").find(".btn-apply-filter").show();
    });

    // Go back
    listFilter.find(".select-filters-value .btn-back").click(function () {
        showScreen(".select-filters-container");
    });

    // Apply
    listFilter.find(".btn-apply-filter").click(function () {
        const selected = listFilter.find(".select-filters-value .options .item .choice:checked");

        if (selected.length) {
            const queryValueElement = selected.parents(".item").find(".query-value:not(.d-none)");

            const filterName = listFilter.find(".select-filters-value .option-selected .title").text();
            const condition = selected.val();

            let value = "";
            if (queryValueElement.hasClass("Select")) {
                value = queryValueElement.dropdown("get value");
            } else {
                value = selected.parents(".item").find(".query-value:not(.d-none)").val();
            }

            if (value) {
                addFilter(filterName, condition, value);
                showScreen(".main");
                actionButtonVisibility(true);
            } else {
                alert("Please input a value first");
            }
        } else {
            alert("Please select an option first!");
        }
    });
}

// Helper functions
function showScreen(screen) {
    const listFilter = $(".ListFilter");

    listFilter.find(".screen").addClass("d-none");
    listFilter.find(screen).removeClass("d-none");
}

function addFilter(filterName, condition, value) {
    const listFilter = $(".ListFilter");

    const cloneableRow = listFilter.find(".main .filters-list .cloneable-row");
    const row = cloneableRow.clone();

    row.removeClass("cloneable-row");
    row.find(".filter-name").text(filterName);
    row.find(".condition").text(condition);
    row.find(".value").text(value);

    listFilter.find(".main .filters-list").append(row);
}

function getOrdinalDate(day) {
    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

function actionButtonVisibility(isVisible) {
    const listFilter = $(".ListFilter");

    if (isVisible) {
        listFilter.find(".main .action-buttons").addClass("d-flex");
    } else {
        listFilter.find(".main .action-buttons").removeClass("d-flex");
    }
}

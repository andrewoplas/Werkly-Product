function initializePage() {
    $(window).scroll(function () {
        const height = $(".Header .logo-container").outerHeight();
        const pageHeader = $(".Header .page-header");
        const pageHeaderInternal = $(".Header .menu");
        const pageHeaderExternal = $(".Header .page-header-external");
        const scroll = $(window).scrollTop();

        if (scroll >= height) {
            if (pageHeaderInternal.length) {
                pageHeaderInternal.addClass("fixed");
            }

            if (pageHeaderExternal.length) {
                pageHeaderExternal.prev().addClass("spacing");
                pageHeaderExternal.addClass("fixed");
            }

            if (pageHeader.length) {
                pageHeader.addClass("fixed");
            }
        } else {
            if (pageHeaderInternal.length) {
                pageHeaderInternal.removeClass("fixed");
            }

            if (pageHeaderExternal.length) {
                pageHeaderExternal.prev().removeClass("spacing");
                pageHeaderExternal.removeClass("fixed");
            }

            if (pageHeader.length) {
                pageHeader.removeClass("fixed");
            }
        }
    });

    $(".menu .nav-pages .nav-link").click(function () {
        $(".menu .nav-pages .nav-link").removeClass("active");
        const active = $(this).addClass("active");
    });

    // Opens sidebar
    const sidebar = $(".sidebar");
    sidebar.hover(
        function () {
            if (!sidebar.hasClass("pinned")) {
                sidebar.removeClass("collapsed");
            }
        },
        function () {
            if (!sidebar.hasClass("pinned")) {
                sidebar.addClass("collapsed");
                $(".sidebar .links").find(".active").removeClass("active");
                $(".sidebar .links").find("ul:not(.menu)").hide();
            }
        }
    );

    // Pin sidebar
    $("#btn-pin").click(function () {
        sidebar.addClass("pinned");
        $(".page-header").addClass("pinned");
        $(".image-container").addClass("pinned");
        $(".MainContent").addClass("pinned");
    });

    // Set scrollbar
    const ps = new PerfectScrollbar("#links-scrollbar");

    initializeSidebar();
}

function initializeSidebar() {
    // prevent page from jumping to top from  # href link
    $(".links-container li.menu-item-has-children > a").click(function (e) {
        e.preventDefault();
    });

    // remove link from menu items that have children
    $(".links-container li.menu-item-has-children > a").attr("href", "#");

    //  function to open / close menu items
    $(".links-container a").click(function () {
        var link = $(this);
        var closest_ul = link.closest("ul");
        var parallel_active_links = closest_ul.find(".active");
        var closest_li = link.closest("li");
        var link_status = closest_li.hasClass("active");
        var count = 0;

        closest_ul.find("ul").slideUp(function () {
            if (++count == closest_ul.find("ul").length) parallel_active_links.removeClass("active");
        });

        if (!link_status) {
            closest_li.children("ul").slideDown();
            closest_li.addClass("active");
        }
    });
}

function initializeDataTables() {
    // Clone rows in basic table 1
    for (let i = 0; i < 100; i++) {
        const row = $("#basictable-checkbox-1 .clone-for-demo").clone();
        row.removeClass("clone-for-demo");
        row.appendTo($("#basictable-checkbox-1 tbody"));
    }

    // Clone rows in basic table 2
    for (let i = 0; i < 100; i++) {
        const row = $("#basictable-checkbox-2 .clone-for-demo").clone();
        row.removeClass("clone-for-demo");
        row.appendTo($("#basictable-checkbox-2 tbody"));
    }

    $(".Datatable table").DataTable({
        ordering: false,
        pagingType: "full_numbers",
        language: { search: "" },
        columnDefs: [
            {
                orderable: false,
                className: "Checkbox",
                targets: 0,
            },
        ],
        select: {
            style: "os",
            selector: "td:first-child",
        },

        initComplete: function (element) {
            const wrapper = $(element.nTableWrapper);
            const input = wrapper.find(".dataTables_filter input").unbind();
            const self = this.api();

            const $searchButton = $('<button class="Button secondary icon ml-2">' + '<i class="fas fa-search"></i>' + "</button>").click(function () {
                self.search(input.val()).draw();
            });

            input.addClass("Input search");
            input.prop("placeholder", "Search ...");
            input.change(function () {
                if (input.val().length == 0) {
                    self.search("").draw();
                }
            });

            wrapper.find(".dataTables_filter").append($searchButton);
        },
    });

    const checkboxOnchange = function (tableName) {
        const table = $(tableName);
        table.find('th [type="checkbox"]').on("change", function () {
            const isChecked = $(this).is(":checked");
            const name = $(this).attr("name");
            table.find('tbody [name="' + name + '"]').prop("checked", isChecked);
        });
    };

    checkboxOnchange("#basictable-checkbox-1");
    checkboxOnchange("#basictable-checkbox-2");
    checkboxOnchange("#minitable-checkbox-1");
    checkboxOnchange("#minitable-checkbox-2");

    $("#btn-add-new-row").click(function () {
        const table = $("#minitable-checkbox-2");
        const tbody = table.find("tbody");
        const row = table.find("tr.cloneable-row").clone();

        row.find("input").val("").prop("checked", false);
        row.removeClass("cloneable-row");
        row.appendTo(tbody);
    });
}

function initializeLayout14() {
    const table = $("#datatable table");

    // initialize dropdown
    $(".ui.dropdown").dropdown();

    // Clone rows in basic table 1 (You can remove this one)
    for (let i = 0; i < 100; i++) {
        const row = $("#basictable-checkbox-1 .clone-for-demo").clone();
        row.removeClass("clone-for-demo");
        row.appendTo($("#basictable-checkbox-1 tbody"));
    }

    $(".btn-show-filter").click(function () {
        $(".filter-configuration-panel").toggleClass("shown");
    });

    const isMobile = $(window).width() <= 576;
    const pagingType = isMobile ? "simple" : "simple_numbers";
    const dataTable = $("#datatable table").DataTable({
        ordering: true,
        order: [1, 2, 3, 4],
        pageLength: 10,
        lengthChange: false,
        pagingType: pagingType,
        info: false,
        language: { search: "" },
        columnDefs: [
            {
                orderable: false,
                className: "Checkbox",
                targets: "no-sort",
            },
        ],
        select: {
            style: "os",
            selector: "td:first-child",
        },

        initComplete: function (element) {
            const wrapper = $(element.nTableWrapper);
            const table = $(element.nTable);
            const input = wrapper.find(".dataTables_filter input").unbind();
            const self = this.api();

            // Wrap with table responsive
            table.wrap('<div class="table-responsive"></div>');

            // Search button (right side)
            const searchButton = $('<button class="Button icon ml-2">' + '<i class="fas fa-ellipsis-v"></i>' + "</button>").click(function () {
                self.search(input.val()).draw();
            });

            input.addClass("Input search");
            input.prop("placeholder", "Search");
            input.change(function () {
                if (input.val().length == 0) self.search("").draw();
            });
            wrapper.find(".dataTables_filter").append(searchButton);
        },

        drawCallback: function (element) {
            const wrapper = $(element.nTableWrapper);
            const self = this.api();
            const currentPageLength = self.page.len();

            // Length (bottom)
            const pageLengthText = isMobile ? " / page" : " per page";
            const pageLengthSelection = $(
                '<div class="dropdown dropdown-container">' +
                    '<a type="button" class="btn dropdown-toggle" data-toggle="dropdown" id="dropdownMenuButton">' +
                    currentPageLength +
                    pageLengthText +
                    "</a>" +
                    '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
                    '   <button value="10" class="dropdown-item" type="button">10 ' +
                    pageLengthText +
                    "</button>" +
                    '   <button value="25" class="dropdown-item" type="button">25 ' +
                    pageLengthText +
                    "</button>" +
                    '   <button value="50" class="dropdown-item" type="button">50 ' +
                    pageLengthText +
                    "</button>" +
                    '   <button value="100" class="dropdown-item" type="button">100 ' +
                    pageLengthText +
                    "</button>" +
                    "</div>" +
                    "</div>"
            );
            pageLengthSelection.find(".dropdown-item").removeClass("active");
            pageLengthSelection.find('.dropdown-item[value="' + currentPageLength + '"]').addClass("active");
            pageLengthSelection.find(".dropdown-item").click(function () {
                self.page.len($(this).attr("value")).draw();
            });

            wrapper.find(".dataTables_paginate").append(pageLengthSelection);
        },
    });

    const checkboxOnchange = function (tableName) {
        const table = $(tableName);
        const checkboxOptions = $(
            '<th class="checkbox-options" colspan="4">' +
                '<button value="Delete" class="btn-delete"><i class="fas fa-trash"></i> Delete</button>' +
                '<button value="Archive" class="btn-archive"><i class="fas fa-archive"></i> Archive</button>' +
                "</th>"
        );
        $(document).on("click", ".checkbox-options .btn-delete, .checkbox-options .btn-archive", function () {
            alert($(this).attr("value") + " clicked");
        });

        table.find('th [type="checkbox"]').on("change", function () {
            let isChecked = $(this).is(":checked");
            const name = $(this).attr("name");

            if ($(this).hasClass("minus")) {
                $(this).prop("checked", true);
                isChecked = true;
            }

            $(this).removeClass("minus");
            table.find('tbody [name="' + name + '"]').prop("checked", isChecked);
            showHideCheckboxOptions(isChecked);
        });

        table.find('td [type="checkbox"]').on("change", function () {
            const totalCheckboxes = table.find('tbody [type="checkbox"]').length;
            const checkedCount = table.find('tbody [type="checkbox"]:checked').length;
            showHideCheckboxOptions(checkedCount > 0);
            table.find('th [type="checkbox"]').prop("checked", checkedCount > 0);

            if (totalCheckboxes === checkedCount) {
                table.find('th [type="checkbox"]').removeClass("minus");
            } else {
                table.find('th [type="checkbox"]').addClass("minus");
            }
        });

        const showHideCheckboxOptions = function (shouldShow) {
            if (shouldShow) {
                table.find(".normal-column").hide();
                table.find("thead tr").append(checkboxOptions);
            } else {
                table.find(".normal-column").show();
                table.find("thead tr th.checkbox-options").remove();
            }
        };
    };

    checkboxOnchange("#basictable-checkbox-1");

    // Table Filters
    if (initializeTableFilterListeners) {
        initializeTableFilterListeners();
    } else {
        console.error("Could not find initializeTableFilterListeners method");
    }
}

function initialize217() {
    // initialize dropdown
    $(".ui.dropdown").dropdown();

    $(".btn-show-filter").click(function () {
        $(".filter-configuration-panel").toggleClass("shown");
    });

    $(".btn-show-more").click(function () {
        alert("show more clicked");
    });

    // List Filters
    if (initializeListFilterListeners) {
        initializeListFilterListeners();
    } else {
        console.error("Could not find initializeTableFilterListeners method");
    }
}

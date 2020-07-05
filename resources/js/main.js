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

    // Initialize sidebar listeners
    initializeSidebar();

    // Hide opened dropdown if hovered out
    $(".DocumentHover").hover(null, function () {
        $(this).find(".dropdown-menu.show").removeClass("show");
    });

    // Initialize dropdown
    $(".ui.dropdown").dropdown();

    // Initialze button cluster
    $(".ButtonCluster .item").click(function () {
        $(this).parents(".ButtonCluster").find(".item").removeClass("selected");
        $(this).addClass("selected");
    });

    // Date time pickers
    if ($("#datetimepicker").length) {
        $("#datetimepicker").datetimepicker({
            format: "DD MMMM, YYYY hh:mm A",
        });
    }

    if ($("#datepicker").length) {
        $("#datepicker").datetimepicker({
            format: "DD MMMM, YYYY",
        });
    }

    if ($("#timepicker").length) {
        $("#timepicker").datetimepicker({
            format: "hh:mm A",
        });
    }
}

function initializeSidebar() {
    // Set scrollbar
    const ps = new PerfectScrollbar("#links-scrollbar");

    // prevent page from jumping to top from  # href link
    $(".links-container li.menu-item-has-children > a:not(:only-child)").click(function (e) {
        e.preventDefault();
    });

    // remove link from menu items that have children
    $(".links-container li.menu-item-has-children > a:not(:only-child)").attr("href", "#");

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

        ps.update();
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
                ps.update();
            }
        }
    );

    // Pin sidebar
    $("#btn-pin").click(function () {
        sidebar.addClass("pinned");
        $(".page-header").addClass("pinned");
        $(".image-container").addClass("pinned");
        $(".MainContent").addClass("pinned");
        ps.update();
    });
}

function initializeListFilter(elementSelector) {
    // initialize dropdown
    $(".ui.dropdown").dropdown();

    $(".btn-show-more").click(function () {
        alert("show more clicked");
    });

    // List Filters
    if (initializeListFilterListeners) {
        initializeListFilterListeners();
        initializeGridTable(elementSelector);
    } else {
        console.error("Could not find initializeListFilterListeners method");
    }
}

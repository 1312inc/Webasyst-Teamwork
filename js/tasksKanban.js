const Kanban = (($) => {

    let filterParams = {};

    class Column {
        constructor(el) {
            this.$list = $(el);
            this.$listFooter = this.$list.find(".t-kanban__list__body__footer");
            this.$loader = this.$listFooter.find("span");
            this.statusId = this.$list.data("kanban-list-status-id");
            this.listLength = this.$list.find("[data-task-id]").length;

            // pagination
            this.total = this.$list.data("kanban-list-total");
            this.limit = 30;
            this.offset = this.limit;
        }

        observe () {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                if (entries[0].intersectionRatio <= 0) return;
                if (this.listLength < this.total) {
                    this.fetch();
                }
            });
            this.intersectionObserver.observe(this.$listFooter.get(0));
        }

        fetch () {
            // with_backlog param always 1 if Closed column
            let withBacklog = this.statusId === -1 ? 1 : (filterParams.with_backlog || 0);
            
            this.$loader.show();
            $.get(
                `?module=kanban&action=statusTasks&with_backlog=${withBacklog
                }&status_id=${this.statusId}&offset=${this.offset}&project_id=${filterParams.project_id || ""
                }&milestone_id=${filterParams.milestone_id || ""}&contact_id=${filterParams.contact_id || ""
                }`
            )
                .done((response) => {
                    this.$listFooter.before(response);
                    this.offset += this.limit;
                    this.listLength = this.$list.find("[data-task-id]").length;
                })
                .always(() => {
                    this.$loader.hide();
                });
        }
    }

    const addLazyLoad = (cols) => {
        cols.each((i, list) => new Column(list).observe());
    };

    const addSortable = (cols) => {
        cols.each((i, list) => {
            new Sortable(list, {
                group: "statuses",
                animation: 150,
                sort: false,
                delay: 1500,
                delayOnTouchOnly: true,
                onEnd: (/**Event*/ evt) => {
                    const taskId = $(evt.item).data("task-id"),
                        fromId = $(evt.from).data("kanban-list-status-id"),
                        toId = $(evt.to).data("kanban-list-status-id"),
                        $fromCount = $(evt.from).parent().find(".t-kanban__list__count"),
                        $toCount = $(evt.to).parent().find(".t-kanban__list__count");

                    // if the column hasn't changed
                    if (fromId === toId) return false;

                    // change position
                    const detached = $(evt.to)
                        .find(`[data-task-id="${taskId}"]`)
                        .detach();
                    $(evt.to).prepend(detached);

                    $.post("?module=tasksLog", {
                        id: taskId,
                        status_id: toId,
                        prev_status_id: fromId,
                    }).done((response) => {
                        if (response.status === "ok") {
                            $fromCount.text(+$fromCount.text() - 1);
                            $toCount.text(+$toCount.text() + 1);
                        }
                    });
                },
            });
        });
    };

    const defineSortable = () => {
        const dfd = $.Deferred();

        if (typeof Sortable === "undefined") {
            const $script = $("#wa-header-js"),
                path = $script.attr('src').replace(/wa-content\/js\/jquery-wa\/wa.header.js.*$/, '');

            const urls = [
                "wa-content/js/sortable/sortable.min.js",
                "wa-content/js/sortable/jquery-sortable.min.js",
            ];

            const sortableDeferred = urls.reduce((dfd, url) => {
                return dfd.then(() => {
                    return $.ajax({
                        cache: true,
                        dataType: "script",
                        url: path + url
                    });
                });
            }, $.Deferred().resolve());

            sortableDeferred.done(() => {
                dfd.resolve();
            });

        } else {
            dfd.resolve();
        }

        return dfd.promise();
    };

    const setFilterParams = () => {

        const urlParams = window.location.hash.split("/")[2] || "";

        // Object with filter params
        filterParams = urlParams.split("&").reduce((acc, p) => {
            const t = p.split("=");
            if (t.length === 2) {
                acc[t[0]] = t[1];
            }
            return acc;
        }, {});

    };

    const init = () => {

        setFilterParams();

        $.when(defineSortable()).then(() => {
            const $kanbanCols = $("[data-kanban-list-status-id]");
            addSortable($kanbanCols);
            addLazyLoad($kanbanCols);
        });
    };

    return { init };
})(jQuery);

window.Kanban = Kanban;

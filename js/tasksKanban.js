const Kanban = (($) => {
    const urlParams = window.location.hash.split("/")[2] || '';

    // Object with filter params
    const filterParams = urlParams.split("&").reduce((acc, p) => {
        const t = p.split("=");
        if (t.length === 2) {
            acc[t[0]] = t[1];
        }
        return acc;
    }, {});
    class Column {
        constructor(el) {
            this.$list = $(el);
            this.$listFooter = this.$list.parent().find(".t-kanban-list__footer")[0];
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
            this.intersectionObserver.observe(this.$listFooter);
        }

        fetch () {
            $.get(
                `?module=kanban&action=statusTasks&with_backlog=${filterParams.with_backlog || 0
                }&status_id=${this.statusId}&offset=${this.offset}&project_id=${filterParams.project_id || ""
                }&milestone_id=${filterParams.milestone_id || ""}&contact_id=${filterParams.contact_id || ""
                }`
            ).done((response) => {
                if (response.status === "ok") {
                    $(this.$list).append(response);
                    this.offset += this.limit;
                    this.listLength = this.$list.find("[data-task-id]").length;
                }
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
                onEnd: (/**Event*/ evt) => {
                    const taskId = $(evt.item).data("task-id");
                    const fromId = $(evt.from).data("kanban-list-status-id");
                    const toId = $(evt.to).data("kanban-list-status-id");
                    const $fromCount = $(evt.from).parent().find(".t-kanban-list__count");
                    const $toCount = $(evt.to).parent().find(".t-kanban-list__count");
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

    const init = () => {
        const $kanbanCols = $("[data-kanban-list-status-id]");
        addSortable($kanbanCols);
        addLazyLoad($kanbanCols);
    };

    return { init };
})(jQuery);

window.Kanban = Kanban;

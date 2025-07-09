class GanttChart {
    constructor(options) {
        this.data = options.data,
            this.leftCol = document.getElementById(options.leftColId);
        this.timeline = document.getElementById(options.timelineId);
        this.rightWrapper = document.getElementById(options.rightWrapperId);
        this.selFrom = document.getElementById(options.rangeFromId);
        this.selTo = document.getElementById(options.rangeToId);
        this.zoomSlider = document.getElementById(options.zoomSliderId);
        this.rowsCount = options.rows || 50;
        this.dayWidthBase = options.dayWidthBase || 40;
        this.zoomWidth = parseInt(this.zoomSlider.value, 10);
        this.todayButton = document.getElementById(options.todayButton);
        this.timelineHeader = document.getElementById(options.timelineHeaderId);
        this.totalDays = 0;

        this.handleQueryParams();
        this.initEvents();
        this.render();
    }

    initEvents () {
        // Controls event
        [this.selFrom, this.selTo].forEach(el => {
            el.addEventListener('input', () => {
                this.setQueryParams();
            });
        });

        // Zoom event
        this.zoomSlider.addEventListener('input', () => {
            this.zoomWidth = parseInt(this.zoomSlider.value, 10);
            this.updateCellWidths();
            this.renderBars(this.data);
        });

        // Scroll sync
        this.leftCol.addEventListener('scroll', () => {
            this.rightWrapper.scrollTop = this.leftCol.scrollTop;
        });

        this.rightWrapper.addEventListener('scroll', () => {
            this.leftCol.scrollTop = this.rightWrapper.scrollTop;
            this.timelineHeader.scrollLeft = this.rightWrapper.scrollLeft;
        });

        this.todayButton.addEventListener('click', () => {
            this.scrollToToday();
        });
    }

    render () {
        const monthsBefore = Math.abs(parseInt(this.selFrom.value, 10));
        const monthsAfter = parseInt(this.selTo.value, 10);
        this.totalDays = (monthsBefore + monthsAfter) * 30;

        const startDate = this.getStartDate(monthsBefore);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayIndex = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

        // Reset
        this.leftCol.innerHTML = '';
        this.timeline.innerHTML = '';
        this.timelineHeader.innerHTML = '';

        this.updateCellWidths();

        for (let d = 0; d < this.totalDays; d++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + d);

            const cell = document.createElement('div');
            cell.className = 'gantt-header-cell';
            cell.textContent = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });

            this.timelineHeader.appendChild(cell);
        }

        // Render rows
        for (let i = 0; i < this.rowsCount; i++) {
            const row = document.createElement('div');
            row.className = 'gantt-row';
            this.leftCol.appendChild(row);
        }

        // Render cells
        for (let r = 0; r < this.rowsCount; r++) {
            for (let d = 0; d < this.totalDays; d++) {
                const cell = document.createElement('div');
                cell.className = 'gantt-cell';

                if (d === todayIndex) {
                    cell.classList.add('today-cell');
                }

                this.timeline.appendChild(cell);
            }
        }

        this.renderBars(this.data);

        setTimeout(() => {
            this.scrollToToday();
        });
    }

    getStartDate (monthsBefore) {
        const today = new Date();
        today.setMonth(today.getMonth() - monthsBefore);
        today.setHours(0, 0, 0, 0);
        return today;
    }

    getEndDate (monthsBefore) {
        const start = this.getStartDate(monthsBefore);
        const end = new Date(start);
        end.setDate(end.getDate() + this.totalDays - 1);
        return end;
    }

    updateCellWidths () {
        this.timeline.style.gridTemplateColumns = `repeat(${this.totalDays}, ${this.dayWidthBase + this.zoomWidth}px)`;
        this.timelineHeader.style.gridTemplateColumns = `repeat(${this.totalDays}, ${this.dayWidthBase + this.zoomWidth}px)`;
    }

    scrollToToday () {
        const container = this.rightWrapper;
        const todayCell = this.timeline.querySelector('.today-cell');
        const cellLeft = todayCell.offsetLeft;
        const cellWidth = todayCell.offsetWidth;
        const containerWidth = container.clientWidth;

        const scrollTarget = cellLeft - (containerWidth / 2) + (cellWidth / 2);

        container.scrollTo({
            left: scrollTarget
        });
    }

    renderBars (projects) {
        const monthsBefore = Math.abs(parseInt(this.selFrom.value, 10));
        const timelineStart = this.getStartDate(monthsBefore);
        const dayMs = 1000 * 60 * 60 * 24;
        const rows = this.leftCol.querySelectorAll('.gantt-row');

        this.timeline.querySelectorAll('.gantt-bar').forEach(element => {
            element.remove();
        });

        projects.forEach((project, index) => {
            const row = rows[index];
            if (!row) return;

            row.innerHTML = project.name;

            const start = new Date(project.start_date);
            const end = new Date(project.end_date || project.due_date || this.getEndDate(monthsBefore));
            const isShowDue = project.end_date && project.due_date;

            const offsetDays = Math.max(0, Math.floor((start - timelineStart) / dayMs));
            const durationDays = Math.max(1, Math.ceil((end - start) / dayMs) + 1);

            const left = offsetDays * (this.dayWidthBase + this.zoomWidth);
            const width = durationDays * (this.dayWidthBase + this.zoomWidth);

            const bar = document.createElement('div');
            bar.className = 'gantt-bar';
            bar.style.top = `${40 * index + 6}px`;
            bar.style.left = `${left}px`;
            bar.style.width = `${width}px`;
            bar.style.backgroundColor = project.color || '#3b82f6';
            bar.textContent = project.name;

            if (isShowDue) {
                const offsetDays = Math.max(0, Math.floor((new Date(project.due_date) - start) / dayMs));
                const left = offsetDays * (this.dayWidthBase + this.zoomWidth) + (this.dayWidthBase + this.zoomWidth) / 2;
                const pointer = document.createElement('div');
                pointer.className = 'gantt-bar-pointer';
                pointer.style.left = `${left}px`;
                bar.appendChild(pointer);
            }

            this.timeline.appendChild(bar);
        });
    }

    handleQueryParams () {
        const hash = window.location.hash.split('/')[2];
        const query = hash.split('?')[1];
        if (!query) return;
        const queryParams = new URLSearchParams(query);
        const from = queryParams.get('from');
        const to = queryParams.get('to');
        if (['-1', '-3', '-12'].includes(from)) {
            this.selFrom.value = from;
        }
        if (['3', '6', '12', '36'].includes(to)) {
            this.selTo.value = to;
        }
    }

    setQueryParams () {
        const [path, query] = window.location.hash.split('?');
        const params = new URLSearchParams(query || '');
        params.set('from', this.selFrom.value);
        params.set('to', this.selTo.value);
        window.location.hash = path + '?' + params.toString();
    }
}

window.GanttChart = GanttChart;
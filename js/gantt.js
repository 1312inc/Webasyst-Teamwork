const projects = [
    {
        id: 'p1',
        name: 'Проект А',
        start: '2025-06-01',
        end: '2025-07-15',
        color: '#4ade80' // зелёный
    },
    {
        id: 'p2',
        name: 'Проект Б',
        start: '2025-06-20',
        end: '2025-09-01',
        color: '#f59e0b' // жёлтый
    }
];

class GanttChart {
    constructor(options) {
        this.leftCol = document.getElementById(options.leftColId);
        this.timeline = document.getElementById(options.timelineId);
        this.rightWrapper = document.getElementById(options.rightWrapperId);
        this.selFrom = document.getElementById(options.rangeFromId);
        this.selTo = document.getElementById(options.rangeToId);
        this.zoomSlider = document.getElementById(options.zoomSliderId);
        this.rowsCount = options.rows || 50;
        this.dayWidthBase = options.dayWidthBase || 40;
        this.zoomWidth = parseInt(this.zoomSlider.value, 10);
        this.timelineHeader = document.getElementById(options.timelineHeaderId);
        this.totalDays = 0;

        this.initEvents();
        this.render();
    }

    initEvents () {
        // Controls event
        [this.selFrom, this.selTo].forEach(el => {
            el.addEventListener('input', () => this.render());
        });

        // Zoom event
        this.zoomSlider.addEventListener('input', () => {
            this.zoomWidth = parseInt(this.zoomSlider.value, 10);
            this.updateCellWidths();
        });

        // Scroll sync
        this.leftCol.addEventListener('scroll', () => {
            this.rightWrapper.scrollTop = this.leftCol.scrollTop;
        });

        this.rightWrapper.addEventListener('scroll', () => {
            this.leftCol.scrollTop = this.rightWrapper.scrollTop;
            this.timelineHeader.scrollLeft = this.rightWrapper.scrollLeft;
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
            row.textContent = `Проект ${i + 1}`;
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

        this.renderBars(projects);

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


        projects.forEach((project, index) => {
            const row = rows[index];
            if (!row) return;
            const start = new Date(project.start);
            const end = new Date(project.end);

            const offsetDays = Math.max(0, Math.floor((start - timelineStart) / dayMs));
            const durationDays = Math.max(1, Math.ceil((end - start) / dayMs));

            const left = offsetDays * (this.dayWidthBase + this.zoomWidth);
            const width = durationDays * (this.dayWidthBase + this.zoomWidth);

            const bar = document.createElement('div');
            bar.className = 'gantt-bar';
            bar.style.top = `${40 * index + 6}px`;
            bar.style.left = `${left}px`;
            bar.style.width = `${width}px`;
            bar.style.backgroundColor = project.color || '#3b82f6';
            bar.textContent = project.name;

            this.timeline.appendChild(bar);
        });
    }
}


new GanttChart({
    leftColId: 'left-col',
    timelineId: 'timeline',
    rightWrapperId: 'right-wrapper',
    timelineHeaderId: 'timeline-header',
    rangeFromId: 'range-from',
    rangeToId: 'range-to',
    zoomSliderId: 'zoom-slider',
    rows: 26,
    dayWidthBase: 30
});


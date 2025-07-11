class GanttChart {
    constructor(options) {
        this.initOptions(options);
        this.handleQueryParams();
        this.initEvents();
        setTimeout(() => this.render());
    }

    initOptions(options) {
        this.originalData = options.data;
        this.data = options.data;
        this.leftCol = document.getElementById(options.leftColId);
        this.timeline = document.getElementById(options.timelineId);
        this.rightWrapper = document.getElementById(options.rightWrapperId);
        this.selFrom = -1;
        this.selTo = 12;
        this.zoomSlider = document.getElementById(options.zoomSliderId);
        this.rowsCount = options.rows || 50;
        this.dayWidthBase = 0;
        this.zoomWidth = parseInt(this.zoomSlider.value, 10);
        this.timelineHeader = document.getElementById(options.timelineHeaderId);
        this.totalDays = 0;
    }

    initEvents() {
        this.addControlEvents();
        this.addScrollEvents();
        this.addResizeEvent();
        this.addBarEvents();
    }

    addControlEvents() {
        this.zoomSlider.addEventListener('input', () => {
            this.zoomWidth = parseInt(this.zoomSlider.value, 10);
            this.updateCellWidths();
            this.renderBars();
            this.scrollToToday();
        });
    }

    addScrollEvents() {
        this.leftCol.addEventListener('scroll', () => {
            this.rightWrapper.scrollTop = this.leftCol.scrollTop;
        });
        this.rightWrapper.addEventListener('scroll', () => {
            this.leftCol.scrollTop = this.rightWrapper.scrollTop;
            this.timelineHeader.scrollLeft = this.rightWrapper.scrollLeft;
        });
    }

    addResizeEvent() {
        window.addEventListener('resize', () => {
            this.changeDayWidthBase();
            this.updateCellWidths();
            this.renderBars();
        });
    }

    addBarEvents() {
        this.timeline.addEventListener('mousedown', (e) => {
            const handle = e.target.closest('.resize-handle');
            if (!handle) return;
            const bar = handle.closest('.gantt-bar');
            const isLeft = handle.classList.contains('left');
            const startX = e.clientX;
            const origLeft = bar.offsetLeft;
            const origWidth = bar.offsetWidth;
            const dayPx = this.dayWidthBase + this.zoomWidth;
            const onMouseMove = (e) => {
                const dx = e.clientX - startX;
                const deltaDays = Math.round(dx / dayPx);
                const snapDx = deltaDays * dayPx;
                if (isLeft) {
                    const newLeft = origLeft + snapDx;
                    const newWidth = origWidth - snapDx;
                    if (newWidth >= dayPx) {
                        bar.style.left = `${newLeft}px`;
                        bar.style.width = `${newWidth}px`;
                    }
                } else {
                    const newWidth = origWidth + snapDx;
                    if (newWidth >= dayPx) {
                        bar.style.width = `${newWidth}px`;
                    }
                }
                this.updateBarTooltips(bar);
            };
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                this.updateMilestoneDates(bar, dayPx);

            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        this.timeline.addEventListener('mousedown', (e) => {
            const bar = e.target.closest('.gantt-bar');
            if (!bar || e.target.closest('.resize-handle')) return;
            const startX = e.clientX;
            const origLeft = bar.offsetLeft;
            const dayPx = this.dayWidthBase + this.zoomWidth;
            const onMouseMove = (e) => {
                const dx = e.clientX - startX;
                const deltaDays = Math.round(dx / dayPx);
                const snapDx = deltaDays * dayPx;
                const newLeft = origLeft + snapDx;
                bar.style.left = `${newLeft}px`;
                this.updateBarTooltips(bar);
            };
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                this.updateMilestoneDates(bar, dayPx);
                
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    updateMilestoneDates (bar, dayPx) {
        const monthsBefore = Math.abs(parseInt(this.selFrom, 10));
        const timelineStart = this.getStartDate(monthsBefore);

        const projectId = bar.dataset.projectId;
        const milestoneId = bar.dataset.milestoneId;
        const milestone = this.data.find(m => m.id === milestoneId);
        console.log('Resizing project:', milestone.name);

        const newLeft = bar.offsetLeft;
        const newWidth = bar.offsetWidth;
        const offsetDays = Math.round(newLeft / dayPx);
        const durationDays = Math.round(newWidth / dayPx);

        const newStart = new Date(timelineStart);
        newStart.setDate(newStart.getDate() + offsetDays + 1);

        const newEnd = new Date(newStart);
        newEnd.setDate(newEnd.getDate() + durationDays);

        milestone.start_date = newStart.toISOString().slice(0, 10);
        milestone.end_date = newEnd.toISOString().slice(0, 10);

        console.log('Resized project:', projectId, newStart.toISOString().slice(0, 10), newEnd.toISOString().slice(0, 10));
    }

    updateBarTooltips(bar) {
        if (bar._startTip && bar._endTip) {
            const monthsBefore = Math.abs(parseInt(this.selFrom, 10));
            const timelineStart = this.getStartDate(monthsBefore);
            const offsetDays = Math.round(bar.offsetLeft / (this.dayWidthBase + this.zoomWidth));
            const durationDays = Math.round(bar.offsetWidth / (this.dayWidthBase + this.zoomWidth));
            const newStart = new Date(timelineStart);
            newStart.setDate(newStart.getDate() + offsetDays);
            const newEnd = new Date(newStart);
            newEnd.setDate(newEnd.getDate() + durationDays - 1);
            bar._startTip.setContent(`Начало: ${newStart.toLocaleDateString()}`);
            bar._endTip.setContent(`Конец: ${newEnd.toLocaleDateString()}`);
        }
    }

    render () {
        const monthsBefore = Math.abs(parseInt(this.selFrom, 10));
        const monthsAfter = parseInt(this.selTo, 10);
        this.totalDays = (monthsBefore + monthsAfter) * 30;

        const startDate = this.getStartDate(monthsBefore);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayIndex = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

        this.changeDayWidthBase();
        this.updateCellWidths();

        // Reset
        this.leftCol.innerHTML = '';
        this.timeline.innerHTML = '';
        this.timelineHeader.innerHTML = '';

        // Render timeline
        for (let d = 0; d < this.totalDays; d++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + d);

            const cell = document.createElement('div');
            cell.className = 'gantt-header-cell';
            if (d === todayIndex) {
                cell.classList.add('today-cell');
            }
            // cell.textContent = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
            this.timelineHeader.appendChild(cell);
        }

        // Render left rows
        for (let i = 0; i < this.rowsCount; i++) {
            const row = document.createElement('div');
            row.className = 'gantt-row';
            this.leftCol.appendChild(row);
        }

        // Render cells
        this.renderTimelineRowsAsync(todayIndex);

        // Render milestones bars
        this.renderBars();

        setTimeout(() => {
            this.scrollToToday();
        });

    }

    changeDayWidthBase () {
        this.dayWidthBase = this.rightWrapper.offsetWidth / this.totalDays;
    }

    renderTimelineRowsAsync (todayIndex) {
        let rowIndex = 0;

        const renderRow = () => {
            if (rowIndex >= this.rowsCount) return;

            const rowDiv = document.createElement('div');
            rowDiv.className = 'gantt-timeline-row';

            for (let d = 0; d < this.totalDays; d++) {
                const cell = document.createElement('div');
                cell.className = 'gantt-cell';
                if (d === todayIndex) {
                    cell.classList.add('today-cell');
                }
                rowDiv.appendChild(cell);
            }

            this.timeline.appendChild(rowDiv);
            rowIndex++;

            requestAnimationFrame(renderRow);
        };

        renderRow();
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
        document.documentElement.style.setProperty('--cell-width', `${this.dayWidthBase + this.zoomWidth}px`);
        document.documentElement.style.setProperty('--days-count', this.totalDays);
    }

    scrollToToday () {
        const container = this.rightWrapper;
        const todayCell = this.timelineHeader.querySelector('.today-cell');
        const cellLeft = todayCell.offsetLeft;
        const cellWidth = todayCell.offsetWidth;
        const containerWidth = container.clientWidth;

        const scrollTarget = cellLeft - (containerWidth / 2) + (cellWidth / 2);

        container.scrollTo({
            left: scrollTarget
        });
    }

    renderBars (projects = this.data) {
        const monthsBefore = Math.abs(parseInt(this.selFrom, 10));
        const timelineStart = this.getStartDate(monthsBefore);
        const dayMs = 1000 * 60 * 60 * 24;
        const rows = this.leftCol.querySelectorAll('.gantt-row');

        this.timeline.querySelectorAll('.gantt-bar').forEach(element => {
            element.remove();
        });

        rows.forEach(element => {
            element.innerHTML = '';
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
            bar.className = `gantt-bar ${project.project.color}`;
            bar.style.top = `${40 * index + 5}px`;
            bar.style.left = `${left}px`;
            bar.style.width = `${width}px`;
            bar.dataset.milestoneId = project.id;
            bar.dataset.projectId = project.project_id;
            bar.innerHTML = `
                <div class="resize-handle left"></div>
                <div class="resize-handle right"></div>
            `;

            this.waitForTippy().then(() => {
                const startTip = tippy(bar, {
                    content: `Начало: ${start.toLocaleDateString()}`,
                    placement: 'top-start',
                    trigger: 'manual',
                    hideOnClick: false, 
                    interactive: true
                });
                const endTip = tippy(bar, {
                    content: `Конец: ${end.toLocaleDateString()}`,
                    placement: 'top-end',
                    trigger: 'manual',
                    hideOnClick: false, 
                    interactive: true
                });
                bar.addEventListener('mouseenter', () => {
                    startTip.show();
                    endTip.show();
                });

                bar.addEventListener('mouseleave', () => {
                    startTip.hide();
                    endTip.hide();
                });

                bar._startTip = startTip;
                bar._endTip = endTip;
            })
            

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
        const hash = decodeURIComponent(window.location.hash).split('/')[2];
        const query = hash.split('?')[1];
        if (!query) return;
        const queryParams = new URLSearchParams(query);
        const from = queryParams.get('from');
        const to = queryParams.get('to');
        const project = queryParams.get('project');
        if (['-1', '-3', '-12'].includes(from)) {
            this.selFrom = from;
        }
        if (['3', '6', '12', '36'].includes(to)) {
            this.selTo = to;
        }
        const validProjectIds = this.originalData.map(m => m.project_id);
        if (validProjectIds.includes(project)) {
            this.data = this.originalData.filter(m => m.project_id === project);
        }
    }

     waitForTippy() {
        return new Promise((resolve, reject) => {
            
            if (window.tippy) {
                return resolve();
            }

            const intervalId = setInterval(() => {
                if (window.tippy) {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 100);

            setTimeout(() => {
                clearInterval(intervalId);
                reject(new Error('Tippy.js не загрузилась'));
            }, 5000);
        });
    }
}

window.GanttChart = GanttChart;
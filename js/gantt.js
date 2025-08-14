const locales = {
  en: {
    start: "Start",
    end: "End",
    actions: "Actions",
    completed: "Completed"
  },
  ru: {
    start: "Начало",
    end: "Конец",
    actions: "Количество действий",
    completed: "Готовность"
  }
};
class GanttChart {
    constructor(options) {
        this.initOptions(options);
        this.handleQueryParams();
        this.initEvents();
        this.render();
        this.hideLoading();
    }

    initOptions (options) {
        this.originalData = options.data;
        this.data = options.data;
        this.leftCol = document.getElementById(options.leftColId);
        this.timeline = document.getElementById(options.timelineId);
        this.rightWrapper = document.getElementById(options.rightWrapperId);
        this.selFrom = -1;
        this.selTo = 12;
        this.zoomSlider = document.getElementById(options.zoomSliderId);
        this.rowsCount = 0;
        this.dayWidthBase = 0;
        this.zoomWidth = 0;
        this.timelineHeader = document.getElementById(options.timelineHeaderId);
        this.totalDays = 0;
        this.hash = '';
        this.locale = options.locale?.replace('_', '-') || 'en-US';
        this.localeShort = this.locale.split('-')[0];
        this.locales = locales[this.localeShort];
    }

    initEvents () {
        this.addControlEvents();
        this.addScrollEvents();
        this.addResizeEvent();
        this.addBarEvents();
        // this.addTimelineToolbar();
    }

    addControlEvents () {
        this.initZoomControl();
        this.initSelectsControl();
    }

    addTimelineToolbar () {
        this.waitForTippy().then(() => {
            const header = document.querySelector('.gantt-header');
            const tip = tippy(header, {
                content: ``,
                placement: 'top-start',
                trigger: 'manual',
                hideOnClick: false,
                interactive: true,
                followCursor: true
            });

            header.addEventListener('mouseenter', () => {
                tip.show();
            });

            header.addEventListener('mouseleave', () => {
                tip.hide();
            });

            header.addEventListener('mousemove', (e) => {
                const date = e.target.querySelector('.gantt-header-date .gantt-header-date__withYear')?.innerText;
                if (!date) return;
                tip.setContent(date);
            });
        });
    }

    initSelectsControl () {
        const query = this.hash.split('/')[2];
        const queryParams = new URLSearchParams(query || '');

        const zoomSlider = document.getElementById('zoom-slider');
        if (zoomSlider) {
            zoomSlider.value = queryParams.get('zoom') || 0;
        }

        const hideClosedLink = document.getElementById('dropdown-hide-closed');
        if (hideClosedLink) {
            const currentState = queryParams.get('hide_closed');
            hideClosedLink.textContent = currentState ? hideClosedLink.dataset.labelHide : hideClosedLink.dataset.labelShow;
            hideClosedLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.setQueryParams('hide_closed', queryParams.get('hide_closed') ? null : '1');
            });
        }

        // Initialize dropdowns for project, from, and to filters. It uses jQuery or $ if available. (waDropdown)
        if (!window.$) return;

        ["dropdown-project", "dropdown-from", "dropdown-to"].forEach((id) => {
            const defaultValue = $("#" + id + " .dropdown-toggle").text().trim();

            $("#" + id).waDropdown({
                items: ".menu > li > a",
                change: (event, target) => {
                    const value = $(target).data("value");
                    this.setQueryParams(id.replace('dropdown-', ''), value);
                }
            });

            $("#" + id + " .dropdown-toggle").html(
                $("#" + id + " .menu > li > a[data-value='" + queryParams.get(id.replace('dropdown-', '')) + "']").html() ||
                defaultValue
            );
        });

    }

    initZoomControl () {
        let rafId = null;
        this.zoomSlider.addEventListener('input', () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(() => {
                this.zoomWidth = parseInt(this.zoomSlider.value, 10);
                this.updateTimelineContainer();
                this.updateCellWidths();
                this.renderGridSVG();
                this.renderBars();
                this.scrollToToday();
                this.updateTimeline();
                rafId = null;

                this.setQueryParams('zoom', this.zoomWidth);
            });
        });
    }

    addScrollEvents () {
        this.leftCol.addEventListener('scroll', () => {
            this.rightWrapper.scrollTop = this.leftCol.scrollTop;
        });
        this.rightWrapper.addEventListener('scroll', () => {
            this.leftCol.scrollTop = this.rightWrapper.scrollTop;
            this.timelineHeader.scrollLeft = this.rightWrapper.scrollLeft;
        });
    }

    addResizeEvent () {
        let rafId;
        window.addEventListener('resize', () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(() => {
                this.changeDayWidthBase();
                this.updateCellWidths();
                this.renderGridSVG();
                this.renderBars();
                rafId;
            });
        });
    }

    updateTimeline () {
        const header = document.querySelector('.gantt-header');
        const width = this.dayWidthBase + this.zoomWidth;

        if (width > 50) {
            header.classList.add('day');
            header.classList.remove('week', 'month', 'year');
        } else if (width > 10) {
            header.classList.add('week');
            header.classList.remove('day', 'month', 'year');
        } else if (width > 1.5) {
            header.classList.add('month');
            header.classList.remove('day', 'week', 'year');
        } else {
            header.classList.add('year');
            header.classList.remove('day', 'week', 'month');
        }
    }

    addBarEvents () {
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
            const pointer = e.target.closest('.gantt-bar-pointer');
            if (!pointer) return;
            const bar = pointer.closest('.gantt-bar');
            if (!bar || bar.classList.contains('closed')) return;

            const startX = e.clientX;
            const origLeft = pointer.offsetLeft;
            const dayPx = this.dayWidthBase + this.zoomWidth;
            const onMouseMove = (e) => {
                const dx = e.clientX - startX;
                const deltaDays = Math.round(dx / dayPx);
                const snapDx = deltaDays * dayPx;
                const newLeft = origLeft + snapDx;
                // if (newLeft < 0 || newLeft > bar.offsetWidth) return;
                pointer.style.left = `${newLeft}px`;
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
            if (!bar || e.target.closest('.resize-handle') || e.target.closest('.gantt-bar-pointer')) return;
            if (bar.classList.contains('closed')) return;
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

        this.timeline.addEventListener('mousemove', (e) => {
            const bounds = this.timeline.getBoundingClientRect();
            const x = e.clientX - bounds.left + this.timeline.scrollLeft;

            const cellWidth = this.dayWidthBase + this.zoomWidth;
            const dateIndex = Math.floor(x / cellWidth);

            const date = new Date(this.getStartDate(Math.abs(parseInt(this.selFrom, 10))));
            date.setDate(date.getDate() + dateIndex);
            const dateStr = date.toLocaleDateString(this.locale);

            const cursorLine = this.timeline.querySelector('#cursor-line');
            const dateText = this.timeline.querySelector('#cursor-date');

            const xPos = dateIndex * cellWidth + cellWidth / 2;
            cursorLine.setAttribute('x1', xPos);
            cursorLine.setAttribute('x2', xPos);
            cursorLine.style.display = 'block';

            dateText.setAttribute('x', xPos + 4);
            dateText.setAttribute('y', 20 + this.timeline.scrollTop);
            dateText.textContent = dateStr;
            dateText.style.display = 'block';
        });

        this.timeline.addEventListener('mouseleave', () => {
            const cursorLine = this.timeline.querySelector('#cursor-line');
            const dateText = this.timeline.querySelector('#cursor-date');
            cursorLine.style.display = 'none';
            dateText.style.display = 'none';
        });
    }

    updateMilestoneDates (bar, dayPx) {
        const monthsBefore = Math.abs(parseInt(this.selFrom, 10));
        const timelineStart = this.getStartDate(monthsBefore);

        const milestoneId = bar.dataset.milestoneId;
        const milestone = this.data.find(m => m.id === milestoneId);

        const newLeft = bar.offsetLeft;
        const newWidth = bar.offsetWidth;
        const offsetDays = Math.round(newLeft / dayPx);
        const durationDays = Math.round(newWidth / dayPx);

        const newStart = new Date(timelineStart);
        newStart.setDate(newStart.getDate() + offsetDays + 1);
        const newStartDate = newStart.toISOString().slice(0, 10);

        const newEnd = new Date(newStart);
        newEnd.setDate(newEnd.getDate() + durationDays - 1);
        const newEndDate = newEnd.toISOString().slice(0, 10);

        const pointer = bar.querySelector('.gantt-bar-pointer');
        let newDueDate = null
        if (pointer) {
            const newDue = new Date(newStart);
            const pointerLeft = pointer.offsetLeft;
            const pointerOffsetDays = Math.floor(pointerLeft / dayPx);
            newDue.setDate(newDue.getDate() + pointerOffsetDays);
            newDueDate = newDue.toISOString().slice(0, 10);
        }

        if (milestone.start_date === newStartDate && milestone.end_date === newEndDate && milestone.due_date === newDueDate) {
            return;
        }
        
        milestone.start_date = newStartDate;
        milestone.end_date = newEndDate;
        milestone.due_date = newDueDate;

        this.fetchUpdate(milestone.id, milestone.start_date, milestone.end_date, milestone.due_date);
    }

    updateBarTooltips (bar) {
        if (bar._startTip && bar._endTip) {
            const monthsBefore = Math.abs(parseInt(this.selFrom, 10));
            const timelineStart = this.getStartDate(monthsBefore);
            const offsetDays = Math.round(bar.offsetLeft / (this.dayWidthBase + this.zoomWidth));
            const durationDays = Math.round(bar.offsetWidth / (this.dayWidthBase + this.zoomWidth));
            const newStart = new Date(timelineStart);
            newStart.setDate(newStart.getDate() + offsetDays);
            const newEnd = new Date(newStart);
            newEnd.setDate(newEnd.getDate() + durationDays - 1);
            bar._startTip.setContent(`${this.locales.start}: ${newStart.toLocaleDateString(this.locale)}`);
            bar._endTip.setContent(`${this.locales.end}: ${newEnd.toLocaleDateString(this.locale)}`);
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
        this.updateTimeline();

        // Reset
        this.leftCol.innerHTML = '';
        this.timeline.innerHTML = '';
        this.timelineHeader.innerHTML = '';

        // Render timeline
        for (let d = 0; d < this.totalDays; d++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + d);

            const cell = document.createElement('div');

            cell.innerHTML = `
                <div class="gantt-header-date">
                    <div class="gantt-header-date__withYear">${date.toLocaleDateString(this.locale)}</div>
                    <div class="gantt-header-date__withoutYear">${date.toLocaleDateString(this.locale, { day: '2-digit', month: '2-digit' })}</div>
                </div>
                `;
            cell.className = 'gantt-header-cell';
            if (d === todayIndex) {
                cell.classList.add('today-cell');
            }
            this.timelineHeader.appendChild(cell);
        }

        // Render left rows
        for (let i = 0; i < this.rowsCount; i++) {
            const row = document.createElement('div');
            row.className = 'gantt-row';
            this.leftCol.appendChild(row);
        }

        // Render cells
        this.updateTimelineContainer();

        this.renderGridSVG();

        // Render milestones bars
        this.renderBars();

        setTimeout(() => {
            this.scrollToToday();
        });

    }

    changeDayWidthBase () {
        this.dayWidthBase = this.rightWrapper.offsetWidth / this.totalDays;
    }

    updateTimelineContainer () {
        const cellWidth = this.dayWidthBase + this.zoomWidth;
        const rowHeight = 40;

        this.timeline.style.width = `${this.totalDays * cellWidth}px`;
        this.timeline.style.height = `${this.rowsCount * rowHeight}px`;
    }

    renderGridSVG () {
        const old = document.getElementById('gantt-grid-svg');
        if (old) old.remove();

        const cellWidth = this.dayWidthBase + this.zoomWidth;
        const rowHeight = 40;

        const width = this.totalDays * cellWidth;
        const height = this.rowsCount * rowHeight;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id', 'gantt-grid-svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.style.position = 'absolute';
        svg.style.top = 0;
        svg.style.left = 0;
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = 0;

        for (let i = 0; i <= this.rowsCount; i++) {
            const y = i * rowHeight;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '0');
            line.setAttribute('y1', y);
            line.setAttribute('x2', width);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', 'var(--border-color-soft)');
            svg.appendChild(line);
        }

        for (let d = 1; d <= this.totalDays; d++) {
            const x = d * cellWidth;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', '0');
            line.setAttribute('x2', x);
            line.setAttribute('y2', height);
            line.setAttribute('stroke', d % 7 === 0 ? 'var(--border-color-hard)' : 'var(--border-color-soft)');
            svg.appendChild(line);
        }

        const timelineStart = this.getStartDate(Math.abs(parseInt(this.selFrom, 10)));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayIndex = Math.floor((today - timelineStart) / (1000 * 60 * 60 * 24));
        const todayX = todayIndex * cellWidth + cellWidth / 2;

        const todayLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        todayLine.setAttribute('x1', todayX);
        todayLine.setAttribute('y1', '0');
        todayLine.setAttribute('x2', todayX);
        todayLine.setAttribute('y2', height);
        todayLine.setAttribute('stroke', 'red');
        todayLine.setAttribute('stroke-width', '1.5');
        todayLine.setAttribute('stroke-dasharray', '4,2');
        svg.appendChild(todayLine);

        const cursorLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        cursorLine.setAttribute('id', 'cursor-line');
        cursorLine.setAttribute('x1', 0);
        cursorLine.setAttribute('x2', 0);
        cursorLine.setAttribute('y1', 0);
        cursorLine.setAttribute('y2', height);
        cursorLine.setAttribute('stroke', 'var(--gray)');
        cursorLine.setAttribute('stroke-width', '1');
        cursorLine.style.display = 'none';
        svg.appendChild(cursorLine);

        const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        dateText.setAttribute('id', 'cursor-date');
        dateText.setAttribute('y', 20);
        dateText.setAttribute('fill', 'var(--gray)');
        dateText.setAttribute('font-size', '12px');
        dateText.style.pointerEvents = 'none';
        dateText.style.display = 'none';
        svg.appendChild(dateText);

        this.timeline.appendChild(svg);
    }

    // renderTimelineRowsAsync (todayIndex) {
    //     let rowIndex = 0;

    //     const renderRow = () => {
    //         if (rowIndex >= this.rowsCount) return;

    //         const rowDiv = document.createElement('div');
    //         rowDiv.className = 'gantt-timeline-row';

    //         for (let d = 0; d < this.totalDays; d++) {
    //             const cell = document.createElement('div');
    //             cell.className = 'gantt-cell';
    //             if (d === todayIndex) {
    //                 cell.classList.add('today-cell');
    //             }
    //             rowDiv.appendChild(cell);
    //         }

    //         this.timeline.appendChild(rowDiv);
    //         rowIndex++;

    //         requestAnimationFrame(renderRow);
    //     };

    //     renderRow();
    // }

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

        // Remove all bars and tasks
        this.timeline.querySelectorAll('.gantt-bar, .gantt-task-pointer').forEach(element => {
            element.remove();
        });

        // Clear all left rows
        rows.forEach(element => {
            element.innerHTML = '';
        });

        let rowIndex = 0;
        projects.forEach((project) => {
            const row = rows[rowIndex];
            row.appendChild(this.renderMilestoneRow(project));

            if (!project.start_date && !project.due_date && !project.end_date) {
                return;
            }

            let start = project.start_date ? new Date(project.start_date) : null;
            if (!start) {
                start = project.end_date ? new Date(project.end_date) : project.due_date ? new Date(project.due_date) : null;
            } else {
                if (project.end_date && new Date(project.start_date) > new Date(project.end_date)) {
                    start = new Date(project.end_date)
                } else if (project.due_date && new Date(project.start_date) > new Date(project.due_date)) {
                    start = new Date(project.due_date)
                }
            }

            const end = project.end_date ? new Date(project.end_date) : project.due_date ? new Date(project.due_date) : this.getEndDate(monthsBefore);

            const offsetDays = Math.floor((start - timelineStart) / dayMs);
            const offsetDaysFromTheTimeline = Math.max(0, Math.floor((start - timelineStart) / dayMs));
            const durationDays = Math.max(1, Math.ceil((end - start) / dayMs) + 1);

            const left = offsetDays * (this.dayWidthBase + this.zoomWidth);
            const leftFromTheTimeline = offsetDaysFromTheTimeline * (this.dayWidthBase + this.zoomWidth);
            
            const width = durationDays * (this.dayWidthBase + this.zoomWidth);
            const hiddenOffset = leftFromTheTimeline - left;
            const progressbarWidth = (width - hiddenOffset) * project.closed_percent / 100;

            const bar = document.createElement('div');
            bar.className = `gantt-bar ${project.project.color} ${project.closed === '1' ? 'closed' : ''}`;
            bar.style.opacity = project.closed !== '1' ? '1' : '0.25';
            bar.style.top = `${40 * rowIndex + 5}px`;
            bar.style.left = `${left}px`;
            bar.style.width = `${width}px`;
            bar.dataset.milestoneId = project.id;
            bar.dataset.projectId = project.project_id;
            
            bar.innerHTML = `
                <div class="gantt-bar__progressbar" ${project.closed_percent ? `title="${this.locales.completed}: ${project.closed_percent}%"` : ''} style="left: ${hiddenOffset}px; width: ${progressbarWidth}px;"></div>
                <div class="resize-handle left"></div>
                <div class="resize-handle right"></div>
            `;

            this.waitForTippy().then(() => {
                const startTip = tippy(bar, {
                    content: `${this.locales.start}: ${start.toLocaleDateString(this.locale)}`,
                    placement: 'top-start',
                    trigger: 'manual',
                    hideOnClick: false,
                    interactive: true,
                    popperOptions: {
                        modifiers: [
                            {
                                name: 'preventOverlap',
                                enabled: true
                            },
                            {
                                name: 'flip',
                                options: {
                                    fallbackPlacements: ['left', 'top', 'right', 'bottom']
                                }
                            }
                        ]
                    },
                });
                const endTip = tippy(bar, {
                    content: `${this.locales.end}: ${end.toLocaleDateString(this.locale)}`,
                    placement: 'bottom-end',
                    trigger: 'manual',
                    hideOnClick: false,
                    interactive: true,
                    popperOptions: {
                        modifiers: [
                            {
                                name: 'preventOverlap',
                                enabled: true
                            },
                            {
                                name: 'flip',
                                options: {
                                    fallbackPlacements: ['right', 'top', 'left', 'bottom']
                                }
                            }
                        ]
                    },
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
            });


            if (project.due_date) {
                const offsetDays = Math.floor((new Date(project.due_date) - start) / dayMs);
                const left = offsetDays * (this.dayWidthBase + this.zoomWidth) + (this.dayWidthBase + this.zoomWidth) / 2;
                const pointer = document.createElement('div');
                pointer.className = 'gantt-bar-pointer';
                pointer.style.width = `${this.dayWidthBase + this.zoomWidth}px`;
                pointer.style.left = `${left}px`;
                bar.appendChild(pointer);
            }

            this.timeline.appendChild(bar);

            rowIndex++;
        });
    }

    setQueryParams (name, value) {
        let [path, query] = this.hash.split('?');
        if (query?.at(-1) === '/') {
            query = query.slice(1);
        }
        const params = new URLSearchParams(query || '');

        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }

        const allowed = ['from', 'to', 'project', 'zoom', 'error', 'hide_closed'];
        const newParams = new URLSearchParams();
        allowed.forEach(key => {
            if (params.has(key)) {
                newParams.set(key, params.get(key));
            }
        });

        const paramsWithoutZoom = new URLSearchParams(newParams);
        paramsWithoutZoom.delete('zoom');

        const hash = path + (newParams.toString() ? '?' + newParams.toString() : '');
        const hashWithoutZoom = path + (paramsWithoutZoom.toString() ? '?' + paramsWithoutZoom.toString() : '');
        localStorage.setItem('tasks/gantt-hash', hash);
        if (name === 'zoom') return;
        window.location.hash = hashWithoutZoom;

        // Show loading if query changed
        if (hash.split('?')[1] !== query) {
            this.showLoading();
        }
    }

    handleQueryParams () {
        const storedHash = localStorage.getItem('tasks/gantt-hash');
        this.hash = storedHash || window.location.hash;

        const query = this.hash.split('/')[2];
        const queryParams = new URLSearchParams(query || '');

        const from = queryParams.get('from');
        const to = queryParams.get('to');
        const project = queryParams.get('project');
        const zoom = queryParams.get('zoom');
        const hideClosed =  queryParams.get('hide_closed');

        if (['-1', '-3', '-12'].includes(from)) {
            this.selFrom = from;
        }
        if (['3', '6', '12', '36'].includes(to)) {
            this.selTo = to;
        }
        if (zoom) {
            this.zoomWidth = parseInt(zoom, 10);
        }


        const fromOffset = parseInt(this.selFrom, 10);
        const toOffset = parseInt(this.selTo, 10);

        const startDate = this.selFrom
            ? new Date(new Date().setMonth(new Date().getMonth() + fromOffset))
            : null;

        const endDate = this.selTo
            ? new Date(new Date().setMonth(new Date().getMonth() + toOffset))
            : null;

        if (!startDate && !endDate) {
            return this.originalData;
        }

        let filtered = this.originalData.filter(item => {
            const rawStart = item.start_date || item.due_date;
            const itemStart = rawStart ? new Date(rawStart) : null;
            const rawEnd = item.end_date || item.due_date;
            const itemEnd = rawEnd ? new Date(rawEnd) : null;

            if (!(itemStart instanceof Date) || isNaN(itemStart)) {
                return false;
            }

            const effectiveItemEnd = itemEnd && !isNaN(itemEnd)
                ? itemEnd
                : new Date(8640000000000000); // max date в JS

            const effectiveFilterStart = startDate || new Date(-8640000000000000); // min date
            const effectiveFilterEnd = endDate || new Date(8640000000000000);     // max date

            return itemStart <= effectiveFilterEnd && effectiveItemEnd >= effectiveFilterStart;
        });

        if (project) {
            filtered = filtered.filter(m => m.project_id === project);
        }

        if (hideClosed) {
            filtered = filtered.filter(m => m.closed !== '1');
        }

        this.data = filtered;
        this.rowsCount += this.data.length;
    }

    fetchUpdate (milestoneId, newStart, newEnd, newDue) {
        const data = new FormData();
        data.append('milestone_id', milestoneId);
        data.append('start_date', newStart);
        data.append('end_date', newEnd);
        if (newDue) {
            data.append('due_date', newDue);
        }

        fetch('?module=milestones&action=save', {
            method: 'POST',
            body: data
        })
            .then(response => response.json())
            .then(data => {
                if (data?.data?.success) {
                    console.log('Milestones updated successfully');
                    this.setQueryParams('error', '');
                } else {
                    throw new Error('Failed to update milestones');
                }
            })
            .catch(error => {
                console.error('Error updating milestones:', error);
                this.setQueryParams('error', Date.now());
            });
    }

    renderMilestoneRow (project) {
        const template = document.getElementById('milestone-row');
        const clone = template.content.cloneNode(true);

        clone.firstElementChild.dataset.milestoneId = project.id;
        clone.querySelector('.gantt-row__name').innerHTML = `
            ${project.project.icon_url ? `<span class="icon"><i class="size-20" style="background-image: url('${project.project.icon_url}');" title="${project.project.name}"></i></span>` : ''}
            <a href="#/tasks/scope/${project.id}/" class="${project.closed !== '1' ? '' : 'text-gray'}">
                ${project.name}
            </a>
            ${project.closed !== '1' ? '' : '<span class="hint"><i class="fas fa-check fa-xs"></i></span>'}
        `;

        let usersTpl = '';
        const overflow = project.users.length > 5 ? project.users.length - 5 : 0;
        const users = overflow > 0 ? project.users.slice(0, 5) : project.users;

        users.forEach(user => {
            usersTpl += `
                <a class="userpic userpic-20" data-tooltip="${this.locales.actions}: ${user.action_count}" href="#/tasks/assigned/${user.id}/" style="background-image: url('${user.photo_url}');"></a>
            `; 
        })
        if (overflow > 0) {
             usersTpl += `
                <span class="userpic userpic-20 smaller flexbox align-center">+${overflow}</span>
            `;
        }

        clone.querySelector('.gantt-row__users').innerHTML = usersTpl;

        this.waitForTippy().then(() => {
            tippy(document.querySelectorAll(`[data-milestone-id="${project.id}"] .userpic[data-tooltip]`), {
                content: (element) => element.getAttribute('data-tooltip')
            });
        });


        return clone;
    }

    waitForTippy () {
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

    showLoading () {
        if (window.ganttLoading) {
            window.ganttLoading.show(); 
            window.ganttLoading.set(100);
            return;
        }
        if ($.waLoading) {
            window.ganttLoading = $.waLoading();
            this.showLoading();
        }
    }

    hideLoading () {
        if (window.ganttLoading) {
            window.ganttLoading.abort(); 
            window.ganttLoading.hide(); 
        }
    }
}

window.GanttChart = GanttChart;

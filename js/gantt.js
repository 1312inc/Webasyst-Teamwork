class GanttChart {
    constructor(options) {
        this.initOptions(options);
        this.handleQueryParams();
        this.initEvents();
        this.setActiveMilestone().then(() => {
            this.render();
        })
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
        this.selectedMilestone = 0;
        this.selectedMilestoneTasks = [];
        this.rowsCount = 0;
        this.dayWidthBase = 0;
        this.zoomWidth = 0;
        this.timelineHeader = document.getElementById(options.timelineHeaderId);
        this.totalDays = 0;
        this.hash = '';
    }

    initEvents () {
        this.addControlEvents();
        this.addScrollEvents();
        this.addResizeEvent();
        this.addBarEvents();
        this.addTimelineToolbar();
    }

    addControlEvents () {
        this.initZoomControl();
        this.initSelectsControl();
    }

    async setActiveMilestone () {
        if (!this.selectedMilestone) return;

        const data = await fetch(`?module=milestones&action=milestoneInfo&milestone_id=${this.selectedMilestone}`)
            .then(response => response.json())
            .then(data => data.data)
            .catch((e) => {});
    
        if (!Array.isArray(data)) return;

        this.selectedMilestoneTasks = data;
        this.rowsCount += this.selectedMilestoneTasks.length;
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
                this.updateCellWidths();
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
            this.setQueryParams('milestone', milestoneId === this.selectedMilestone ? null : milestoneId);
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
            bar._startTip.setContent(`Начало: ${newStart.toLocaleDateString('ru-RU')}`);
            bar._endTip.setContent(`Конец: ${newEnd.toLocaleDateString('ru-RU')}`);
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
                    <div class="gantt-header-date__withYear">${date.toLocaleDateString('ru-RU')}</div>
                    <div class="gantt-header-date__withoutYear">${date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}</div>
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

            const offsetDays = Math.max(0, Math.floor((start - timelineStart) / dayMs));
            const durationDays = Math.max(1, Math.ceil((end - start) / dayMs) + 1);

            const left = offsetDays * (this.dayWidthBase + this.zoomWidth);
            const width = durationDays * (this.dayWidthBase + this.zoomWidth);

            const bar = document.createElement('div');
            bar.className = `gantt-bar ${project.project.color} ${project.closed === '1' ? 'closed' : ''}`;
            bar.style.opacity = project.closed !== '1' ? '1' : '0.5';
            bar.style.top = `${40 * rowIndex + 5}px`;
            bar.style.left = `${left}px`;
            bar.style.width = `${width}px`;
            bar.dataset.milestoneId = project.id;
            bar.dataset.projectId = project.project_id;
            
            const due = project.due_date ? new Date(project.due_date) : new Date();
            const progressbarColor = project.closed_percent === 100 ? 'green' : (project.closed_percent < 100) ? (due < new Date()) ? 'red' : 'blue' : 'blue';

            bar.innerHTML = `
                <div class="gantt-bar__progressbar" style="width: ${project.closed_percent || 0}%; background: var(--${progressbarColor});"></div>
                <div class="resize-handle left"></div>
                <div class="resize-handle right"></div>
                ${project.closed !== '1' ? '' : `
                    <div class="gantt-bar__icon">
                        <i class="fas fa-check"></i>
                    </div>
                    `
                }
            `;

            this.waitForTippy().then(() => {
                const startTip = tippy(bar, {
                    content: `Начало: ${start.toLocaleDateString('ru-RU')}`,
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
                    content: `Конец: ${end.toLocaleDateString('ru-RU')}`,
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
                const offsetDays = Math.max(0, Math.floor((new Date(project.due_date) - start) / dayMs));
                const left = offsetDays * (this.dayWidthBase + this.zoomWidth) + (this.dayWidthBase + this.zoomWidth) / 2;
                const pointer = document.createElement('div');
                pointer.className = 'gantt-bar-pointer';
                pointer.style.width = `${this.dayWidthBase + this.zoomWidth}px`;
                pointer.style.left = `${left}px`;
                bar.appendChild(pointer);
            }

            this.timeline.appendChild(bar);

            if (project.id === this.selectedMilestone) {
                this.selectedMilestoneTasks.forEach(task => {
                    rowIndex++;

                    rows[rowIndex].innerHTML = `<a href="#/task/${task.project_id}.${task.number}/" class="hint">${task.project_id}.${task.number} ${task.name}</a>`;

                    const dates = new Set();

                    task.log.forEach(log => {
                        let pointerDate = null;
                        let actionName = '';
                        let iconClass = '';
                        if (log.action === 'add') {
                            pointerDate = new Date(log.create_datetime);
                            actionName = 'Add';
                            iconClass = 'fas fa-plus';
                        } else if (log.after_status_id === '-1') {
                            pointerDate = new Date(log.create_datetime);
                            actionName = 'Close';
                            iconClass = 'fas fa-check';
                        } else if (log.action === 'return') {
                            pointerDate = new Date(log.create_datetime);
                            actionName = 'Return';
                            iconClass = 'fas fa-arrow-left';
                        } else if (log.action === 'forward') {
                            pointerDate = new Date(log.create_datetime);
                            actionName = 'Forward';
                            iconClass = 'fas fa-arrow-right';
                        } else if (log.action === 'edit') {
                            pointerDate = new Date(log.create_datetime);
                            actionName = 'Edit';
                            iconClass = 'fas fa-pen';
                        } else if (log.action === 'comment') {
                            pointerDate = new Date(log.create_datetime);
                            actionName = 'Comment';
                            iconClass = 'fas fa-comment';
                        } else if (log.action === 'commit') {
                            pointerDate = new Date(log.create_datetime);
                            actionName = 'Commit';
                            iconClass = 'fab fa-github';
                        } 

                        if (!pointerDate || pointerDate < timelineStart) return;
                        
                        if (dates.has(pointerDate.toISOString().split('T')[0])) return;
                        dates.add(pointerDate.toISOString().split('T')[0]);

                        const offsetDays = Math.max(0, Math.floor((pointerDate - timelineStart) / dayMs));
                        const left = offsetDays * (this.dayWidthBase + this.zoomWidth) + (this.dayWidthBase + this.zoomWidth) / 2;
                        const pointer = document.createElement('div');
                        pointer.className = 'gantt-task-pointer text-gray';
                        pointer.style.top = `${40 * rowIndex + 5}px`;
                        pointer.style.width = `${this.dayWidthBase + this.zoomWidth}px`;
                        pointer.style.left = `${left}px`;
                        pointer.innerHTML = `<i class="icon size-12 ${iconClass}"></i>`;
                        this.timeline.appendChild(pointer);
                        
                        this.waitForTippy().then(() => {
                            tippy(pointer, {
                                content: `${actionName}: ${pointerDate.toLocaleDateString('ru-RU')}`,
                                placement: 'top-start'
                            });
                        });
                    });
                })
            }

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

        const allowed = ['from', 'to', 'project', 'zoom', 'error', 'milestone'];
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
        const milestone = queryParams.get('milestone');

        if (['-1', '-3', '-12'].includes(from)) {
            this.selFrom = from;
        }
        if (['3', '6', '12', '36'].includes(to)) {
            this.selTo = to;
        }
        if (zoom) {
            this.zoomWidth = parseInt(zoom, 10);
        }
        if (milestone) {
            this.selectedMilestone = milestone;
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
        clone.querySelector('.gantt-row__name').textContent = project.name;

        let usersTpl = '';
        const overflow = project.users.length > 5 ? project.users.length - 5 : 0;
        const users = overflow > 0 ? project.users.slice(0, 5) : project.users;

        users.forEach(user => {
            usersTpl += `
                <a class="userpic userpic-20" data-tooltip="${user.action_count}" href="#/tasks/assigned/${user.id}/" style="background-image: url('${user.photo_url}');"></a>
            `; 
        })
        if (overflow > 0) {
             usersTpl += `
                <span class="userpic userpic-20 smaller flexbox align-center">+${overflow}</span>
            `; 
        }

        clone.querySelector('.gantt-row__users').innerHTML = usersTpl;

        this.waitForTippy().then(() => {
            tippy(document.querySelectorAll('.userpic[data-tooltip]'), {
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
}

window.GanttChart = GanttChart;
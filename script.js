document.addEventListener('DOMContentLoaded', function() {
    let currentDate = new Date();

    const dayCalendar = document.getElementById('day-calendar');
    const monthCalendar = document.getElementById('month-calendar');

    window.updateTodaySection = function(day) {
        currentDate.setDate(day);
        renderDayCalendar(currentDate);
    };

    window.goToPreviousMonth = function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendars();
    };

    window.goToNextMonth = function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendars();
    };

    window.goToPreviousYear = function() {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        renderCalendars();
    };

    window.goToNextYear = function() {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        renderCalendars();
    };

    function renderDayCalendar(date) {
        const isToday = date.toDateString() === new Date().toDateString();
        const heading = isToday ? `<h2>Today</h2>` : '';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = date.toLocaleDateString('en-US', options);
        dayCalendar.innerHTML = `${heading}<p>${dateString}</p>`;
    }

    function renderMonthCalendar(date) {
        const currentYear = date.getFullYear();
        const currentMonthIndex = date.getMonth();
        const currentMonthName = date.toLocaleDateString('en-US', { month: 'long' });
        const monthAndYear = `<div class="month-section">
                            <button onclick="window.goToPreviousMonth()">&lt;</button>
                            <span>${currentMonthName}</span>
                            <button onclick="window.goToNextMonth()">&gt;</button>
                            <br>
                            <button onclick="window.goToPreviousYear()">&lt;&lt;</button>
                            <span>${currentYear}</span>
                            <button onclick="window.goToNextYear()">&gt;&gt;</button>
                          </div>`;
        const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0);
        const firstDayOfWeek = firstDayOfMonth.getDay() || 7;
        const weeks = [];
        let week = [];
        for (let i = 1; i < firstDayOfWeek; i++) {
            week.push('');
        }
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            week.push(day);
            if (week.length === 7 || day === lastDayOfMonth.getDate()) {
                weeks.push([...week]);
                week = [];
            }
        }
        if (week.length > 0) {
            weeks.push([...week]);
        }
        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date();
        const isCurrentMonthAndYear = today.getFullYear() === currentYear && today.getMonth() === currentMonthIndex;
        const monthDays = `<div class="week"><table class="month-table">
                        <tr>${weekdays.map(day => `<th>${day}</th>`).join('')}</tr>` +
            weeks.map(week => {
                return `<tr>${week.map(day => {
                    const isToday = isCurrentMonthAndYear && day === today.getDate();
                    return `<td class="day ${isToday ? 'current-day' : ''}">${day ? `<a href="#" onclick="window.updateTodaySection(${day}); return false;">${day}</a>` : ''}</td>`;
                }).join('')}</tr>`;
            }).join('') +
            `</table></div>`;
        monthCalendar.innerHTML = monthAndYear + monthDays;
    }


    function renderCalendars() {
        renderDayCalendar(currentDate);
        renderMonthCalendar(currentDate);
    }

    renderCalendars();
});

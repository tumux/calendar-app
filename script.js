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

    function findHoliday(dateString) {
        for (const division in bankHolidays) {
            if (bankHolidays.hasOwnProperty(division)) {
                const events = bankHolidays[division].events;
                const holiday = events.find(event => event.date === dateString);
                if (holiday) {
                    return holiday; // Return as soon as a matching holiday is found
                }
            }
        }
        return null; // Return null if no matching holiday is found in any division
    }

    function renderDayCalendar(date) {
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const holiday = findHoliday(dateString);

        const isToday = date.toDateString() === new Date().toDateString();
        const heading = isToday ? `<h2>Today</h2>` : '';
        const holidayTitle = holiday ? `<h3>${holiday.title}</h3>` : '';

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dayString = date.toLocaleDateString('en-US', options);
        dayCalendar.innerHTML = `${heading}${holidayTitle}<p>${dayString}</p>`;
    }


    function renderMonthCalendar(date) {
        const currentYear = date.getFullYear();
        const currentMonthIndex = date.getMonth();
        const currentMonthName = date.toLocaleDateString('en-US', { month: 'long' });
        const monthAndYear = `<div class="month-section">
                            <div class="year-navigation">
                                <button onclick="window.goToPreviousYear()">&lt;&lt;</button>
                                <span>${currentYear}</span>
                                <button onclick="window.goToNextYear()">&gt;&gt;</button>
                            </div>
                            <br>
                            <div class="month-navigation">
                                <button onclick="window.goToPreviousMonth()">&lt;</button>
                                <span>${currentMonthName}</span>
                                <button onclick="window.goToNextMonth()">&gt;</button>
                            </div>
                          </div>`;
        const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0);
        const firstDayOfWeek = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
        const weeks = [];
        let week = [];

        // Adjust for Monday as the first day of the week
        for (let i = 0; i < (firstDayOfWeek - 1); i++) {
            week.push('');
        }

        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            week.push(day);
            if (week.length === 7 || day === lastDayOfMonth.getDate()) {
                weeks.push([...week]);
                week = [];
            }
        }

        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date();
        const isCurrentMonthAndYear = today.getFullYear() === currentYear && today.getMonth() === currentMonthIndex;
        const monthDays = `<div class="week"><table class="month-table">
                        <tr>${weekdays.map(day => `<th>${day}</th>`).join('')}</tr>` +
            weeks.map(week => {
                return `<tr>${week.map(day => {
                    const fullDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isHoliday = findHoliday(fullDate) !== null;
                    const isToday = isCurrentMonthAndYear && day === today.getDate();
                    return `<td class="day ${isToday ? 'current-day' : ''} ${isHoliday ? 'holiday' : ''}">${day ? `<a href="#" onclick="window.updateTodaySection(${day}); return false;">${day}</a>` : ''}</td>`;
                }).join('')}</tr>`;
            }).join('') +
            `</table></div>`;

        monthCalendar.innerHTML = monthAndYear + monthDays;
    }



    let bankHolidays = {};

function fetchBankHolidays() {
    return fetch('bank-holidays.json')
        .then(response => response.json())
        .then(data => {
            bankHolidays = data;
        });
}

            function renderCalendars() {
                renderDayCalendar(currentDate);
                renderMonthCalendar(currentDate);
            }

    fetchBankHolidays().then(() => {
        renderCalendars();
    });
        });
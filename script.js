document.addEventListener('DOMContentLoaded', function() {
    const dayCalendar = document.getElementById('day-calendar');
    const monthCalendar = document.getElementById('month-calendar');

    // Make updateTodaySection globally accessible
    window.updateTodaySection = function(day) {
        const selectedDate = new Date();
        const currentYear = selectedDate.getFullYear();
        const currentMonth = selectedDate.getMonth(); // Get the current month index (0-11)
        const newDate = new Date(currentYear, currentMonth, day);

        const isToday = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
        const heading = isToday ? `<h2>Today</h2>` : '';

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = newDate.toLocaleDateString('en-US', options);

        dayCalendar.innerHTML = `${heading}<p>${dateString}</p>`;
    };


    // Function to get current date
    function getCurrentDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return now.toLocaleDateString('en-US', options);
    }

    // Function to get current month's calendar
    function getCurrentMonth() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayIndex = new Date(year, month, 1).getDay();
        const lastDayIndex = new Date(year, month, daysInMonth).getDay();
        const monthArray = [];

        for (let i = 1; i <= daysInMonth; i++) {
            monthArray.push(i);
        }

        const blankDaysBefore = [];
        const blankDaysAfter = [];

        for (let i = 0; i < firstDayIndex; i++) {
            blankDaysBefore.push('');
        }

        for (let i = 0; i < 6 - lastDayIndex; i++) {
            blankDaysAfter.push('');
        }

        return [...blankDaysBefore, ...monthArray, ...blankDaysAfter];
    }

    // Function to render day calendar
    function renderDayCalendar() {
        const currentDate = getCurrentDate();
        dayCalendar.innerHTML = `<h2>Today</h2><p>${currentDate}</p>`;
    }

    // Function to render month calendar
    function renderMonthCalendar() {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonthIndex = today.getMonth(); // Get the current month index
        const currentMonthName = today.toLocaleDateString('en-US', { month: 'long' });

        const monthAndYear = `<div class="month-section"><h2>${currentMonthName}<br>${currentYear}</h2></div>`;

        // Get the first and last day of the current month
        const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0);

        // Calculate the day of the week the first and last day are on
        const firstDayOfWeek = firstDayOfMonth.getDay() || 7; // Adjust so Monday = 1, Sunday = 7
        const lastDayOfWeek = lastDayOfMonth.getDay() || 7;

        const weeks = [];
        let week = [];

        // Pad the first week with empty cells if needed
        for (let i = 1; i < firstDayOfWeek; i++) {
            week.push(''); // Empty cell for days of the previous month
        }

        // Fill in the days of the month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            week.push(day);
            if (week.length === 7 || day === lastDayOfMonth.getDate()) {
                weeks.push([...week]); // Push the completed week
                week = []; // Start a new week
            }
        }

        // Pad the last week with empty cells if needed, and only add the week if it's not entirely empty
        if (week.length > 0) {
            if (lastDayOfWeek !== 7) {
                for (let i = lastDayOfWeek + 1; i <= 7; i++) {
                    week.push(''); // Empty cell for days of the next month
                }
            }
            weeks.push([...week]);
        }

        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Building the calendar HTML
        const monthDays = `<div class="week"><table class="month-table">
                            <tr>${weekdays.map(day => `<th>${day}</th>`).join('')}</tr>` + // Weekday labels
                            weeks.map(week => {
                                return `<tr>${week.map(day => {
                                    const isToday = day === today.getDate() && new Date().getMonth() === currentMonthIndex;
                                    if (day) {
                                        // Wrap the day number in an <a> tag with an onclick event
                                        return `<td class="day ${isToday ? 'current-day' : ''}"><a href="#" onclick="window.updateTodaySection(${day}); return false;">${day}</a></td>`;
                                    } else {
                                        return `<td class="day"></td>`; // Empty cell for padding
                                    }
                                }).join('')}</tr>`;
                            }).join('') +
                        `</table></div>`;

        monthCalendar.innerHTML = monthAndYear + monthDays;
    }

    // Initial rendering
    renderDayCalendar();
    renderMonthCalendar();
});

import CalendarCell from './CalendarCell';
import styles from './CalendarGrid.module.css';

const CalendarGrid = ({
  currentDate,
  tasks = [],
  view = 'month',
  users = [],
}) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (view === 'week') {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());

    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      weekDates.push(d);
    }

    return (
      <div className={styles.grid}>
        {days.map((d) => (
          <div key={d} className={styles.weekday}>
            {d}
          </div>
        ))}

        {weekDates.map((date, i) => (
          <CalendarCell key={i} date={date} tasks={tasks} users={users} />
        ))}
      </div>
    );
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  // PREVIOUS MONTH
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push(new Date(year, month, -i));
  }

  // CURRENT MONTH
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }

  // NEXT MONTH
  while (cells.length < 42) {
    cells.push(
      new Date(year, month + 1, cells.length - daysInMonth - firstDay + 1),
    );
  }

  // for (let day = 1; day <= daysInMonth; day++) {
  //   cells.push(new Date(year, month, day));
  // }

  // while (cells.length % 7 !== 0) {
  //   cells.push(null);
  // }

  // console.log(cells.length);
  return (
    <div
      key={`${currentDate.getFullYear()}-${currentDate.getMonth()}`}
      className={`${styles.grid} ${styles.fade}`}
    >
      {days.map((d) => (
        <div key={d} className={styles.weekday}>
          {d}
        </div>
      ))}

      {cells.map((date, i) => (
        <CalendarCell
          key={i}
          date={date}
          tasks={tasks}
          users={users}
          currentDate={currentDate}
        />
      ))}
    </div>
  );
};

export default CalendarGrid;

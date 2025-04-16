// src/pages/Timetable/Timetable.tsx
import React, { useState } from "react";
import { format, isEqual } from "date-fns";
import { ja } from "date-fns/locale";
import { useEvents, Event } from "../../hooks/useEvents";
import TimelineEvent from "../../components/features/TimelineEvent/TimelineEvent";
import styles from "./Timetable.module.css";

const Timetable: React.FC = () => {
  const { events, loading } = useEvents();
  const [selectedDay, setSelectedDay] = useState(0); // 0 = day 1, 1 = day 2

  // イベント日付を取得（ユニークな日付の配列）
  const eventDates = [
    ...new Set(events.map((event: Event) => event.date)),
  ].sort();

  // 選択された日付のイベントをフィルタリング
  const dayEvents = events.filter((event: Event) =>
    isEqual(new Date(event.date), new Date(eventDates[selectedDay] || ""))
  );

  // 時間帯ごとにイベントをグループ化
  const groupedEvents = dayEvents.reduce<Record<string, Event[]>>(
    (acc: Record<string, Event[]>, event: Event) => {
      const hour = event.time.split(":")[0];
      if (!acc[hour]) {
        acc[hour] = [];
      }
      acc[hour].push(event);
      return acc;
    },
    {} as Record<string, Event[]>
  );

  // 時間帯を昇順でソート
  const sortedHours = Object.keys(groupedEvents).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return (
    <div className={styles.timetablePage}>
      <h1 className={styles.pageTitle}>タイムスケジュール</h1>

      <div className={styles.daySelector}>
        {eventDates.map((date, index) => (
          <button
            key={date}
            className={`${styles.dayButton} ${
              selectedDay === index ? styles.active : ""
            }`}
            onClick={() => setSelectedDay(index)}
          >
            {format(new Date(date), "MM月dd日(EEE)", { locale: ja })}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>読み込み中...</div>
      ) : (
        <div className={styles.timelineContainer}>
          {sortedHours.map((hour) => (
            <div key={hour} className={styles.timeBlock}>
              <div className={styles.timeLabel}>
                <span>{hour}:00</span>
              </div>

              <div className={styles.eventsContainer}>
                {groupedEvents[hour].map((event: Event) => (
                  <TimelineEvent
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    time={event.time}
                    endTime={event.endTime}
                    location={event.location}
                    category={event.category}
                    image={event.image}
                    type={event.type}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timetable;

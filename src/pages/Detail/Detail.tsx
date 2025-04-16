// src/pages/Detail/Detail.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useEvents, Event } from "../../hooks/useEvents";
import { useLocations, Location } from "../../hooks/useLocations";
import EventCard from "../../components/features/EventCard/EventCard";
import CampusMap from "../../components/features/CampusMap/CampusMap";
import styles from "./Detail.module.css";

type DetailParams = {
  type: string;
  id: string;
};

const Detail: React.FC = () => {
  const { type, id } = useParams<DetailParams>();
  const { events, loading: eventsLoading } = useEvents();
  const { locations, loading: locationsLoading } = useLocations();

  const [item, setItem] = useState<Event | Location | null>(null);
  const [relatedItems, setRelatedItems] = useState<Event[]>([]);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const findItem = () => {
      setLoading(true);
      setError(null);

      try {
        let foundItem;

        // 種類によって検索対象を変える
        if (type === "event" || type === "exhibit") {
          foundItem = events.find(
            (event) => event.id.toString() === id && event.type === type
          );
        } else if (type === "location") {
          foundItem = locations.find((location) => location.id === id);
        }

        if (foundItem) {
          setItem(foundItem);

          // 関連アイテムを設定
          let related: Event[] = [];
          if (type === "event" || type === "exhibit") {
            // 同じカテゴリーの他のイベント/展示を取得
            related = events
              .filter(
                (event) =>
                  event.id.toString() !== id &&
                  event.category === (foundItem as Event).category &&
                  event.type === (foundItem as Event).type
              )
              .slice(0, 3);
          } else if (type === "location") {
            // この会場で行われる他のイベントを取得
            const locationEvents = (foundItem as Location).events
              .map((eventRef) => {
                return events.find(
                  (event) => event.id.toString() === eventRef.id.toString()
                );
              })
              .filter((event): event is Event => !!event);
            related = locationEvents;
          }

          setRelatedItems(related);
        } else {
          setError("指定された項目が見つかりませんでした。");
        }
      } catch (err) {
        setError("データの読み込み中にエラーが発生しました。");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // イベントとロケーションの両方が読み込まれたら実行
    if (!eventsLoading && !locationsLoading) {
      findItem();
    }
  }, [id, type, events, locations, eventsLoading, locationsLoading]);

  const handleLocationHover = (locationId: string | null) => {
    setActiveLocation(locationId);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>ページが見つかりません</h1>
        <p className={styles.errorMessage}>{error}</p>
        <Link to="/" className={styles.homeLink}>
          ホームに戻る
        </Link>
      </div>
    );
  }

  // Event型とLocation型に共通のプロパティを取得するヘルパー関数
  const getTitle = () => ("title" in item ? item.title : item.name);
  const getDescription = () => item.description;
  const getImage = () => item.image;
  const getCategory = () => ("category" in item ? item.category : item.type);

  return (
    <div className={styles.detailPage}>
      <div className={styles.breadcrumbs}>
        <Link to="/">ホーム</Link>
        <span className={styles.separator}>/</span>
        <Link
          to={`/${
            type === "event"
              ? "events"
              : type === "exhibit"
              ? "exhibits"
              : "map"
          }`}
        >
          {type === "event"
            ? "イベント"
            : type === "exhibit"
            ? "展示／露店"
            : "会場"}
        </Link>
        <span className={styles.separator}>/</span>
        <span className={styles.currentPage}>{getTitle()}</span>
      </div>

      <div className={styles.itemHeader}>
        <h1 className={styles.title}>{getTitle()}</h1>

        <div className={styles.badges}>
          <span
            className={`${styles.badge} ${styles.category} ${
              styles[getCategory()]
            }`}
          >
            {getCategory()}
          </span>

          {"tags" in item &&
            item.tags &&
            item.tags.map((tag: string) => (
              <span key={tag} className={styles.badge}>
                {tag}
              </span>
            ))}
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.detailsContainer}>
          <div className={styles.imageContainer}>
            <img src={getImage()} alt={getTitle()} className={styles.image} />
          </div>

          <div className={styles.infoContainer}>
            {(type === "event" || type === "exhibit") && "date" in item && (
              <>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>
                    <svg className={styles.infoIcon} viewBox="0 0 24 24">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                    </svg>
                    日付
                  </div>
                  <div className={styles.infoValue}>
                    {format(new Date(item.date), "yyyy年MM月dd日(EEE)", {
                      locale: ja,
                    })}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>
                    <svg className={styles.infoIcon} viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                      <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                    時間
                  </div>
                  <div className={styles.infoValue}>
                    {item.time} {item.endTime && `- ${item.endTime}`}
                  </div>
                </div>
              </>
            )}

            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>
                <svg className={styles.infoIcon} viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                会場
              </div>
              <div className={styles.infoValue}>
                {type === "location" ? (
                  "name" in item ? (
                    item.name
                  ) : (
                    ""
                  )
                ) : "location" in item ? (
                  <Link
                    to={`/detail/location/${item.locationId}`}
                    className={styles.locationLink}
                  >
                    {item.location}
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>

            {"organizer" in item && item.organizer && (
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>
                  <svg className={styles.infoIcon} viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                  主催
                </div>
                <div className={styles.infoValue}>{item.organizer}</div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.descriptionContainer}>
          <h2 className={styles.sectionTitle}>説明</h2>
          <p className={styles.description}>{getDescription()}</p>
        </div>

        <div className={styles.locationMapContainer}>
          <h2 className={styles.sectionTitle}>会場マップ</h2>
          <div className={styles.locationMapWrapper}>
            <CampusMap
              locations={locations}
              activeLocation={
                activeLocation ||
                (type === "location"
                  ? "id" in item
                    ? (item.id as string)
                    : ""
                  : "locationId" in item
                  ? (item.locationId as string)
                  : "")
              }
              onLocationHover={handleLocationHover}
            />
          </div>
        </div>

        {relatedItems.length > 0 && (
          <div className={styles.relatedContainer}>
            <h2 className={styles.sectionTitle}>
              関連
              {type === "event"
                ? "イベント"
                : type === "exhibit"
                ? "展示／露店"
                : "イベント・展示"}
            </h2>
            <div className={styles.relatedGrid}>
              {relatedItems.map((related) => (
                <EventCard
                  key={related.id}
                  id={related.id}
                  title={related.title}
                  image={related.image}
                  date={related.date}
                  time={related.time}
                  location={related.location}
                  category={related.category}
                  type={related.type}
                  compact
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;

import { useLanguage } from "../context/LanguageContext";

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="home-page">
      <h2>{t("home.title")}</h2>
      <p>{t("home.subtitle")}</p>

      <section>
        <h3>{t("home.featuredEvents")}</h3>
        {/* Event cards will go here */}
      </section>

      <section>
        <h3>{t("home.featuredExhibits")}</h3>
        {/* Exhibit cards will go here */}
      </section>
    </div>
  );
};

export default Home;

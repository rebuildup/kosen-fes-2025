import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { getBuildingCoordinates } from "../../data/buildings";
import SimpleMap from "../map/UnifiedMap";

interface DetailMapProps {
  location: string;
}

const DetailMap = ({ location }: DetailMapProps) => {
  const { t } = useLanguage();

  // Get coordinates using the building data
  const coords = getBuildingCoordinates(location) || { x: 1071, y: 1150 };

  return (
    <div className="detail-map">
      <div className="detail-map-container">
        <SimpleMap
          mode="detail"
          highlightCoordinate={coords}
          height="400px"
          className="detail-map-svg rounded-lg"
          initialZoom={2}
          maxZoom={8}
          minZoom={0.3}
        />
      </div>

      <div className="detail-map-footer">
        <Link to="/map" className="view-full-map-button">
          {t("map.viewFullMap")} →
        </Link>
      </div>
    </div>
  );
};

export default DetailMap;

import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { getBuildingCoordinates } from "../../data/buildings";
import VectorMap from "../map/VectorMap";

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
        <VectorMap
          mode="detail"
          highlightPoint={coords}
          height="400px"
          className="detail-map-svg rounded-lg"
          maxZoom={8}
          minZoom={0.3}
          showControls={true}
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

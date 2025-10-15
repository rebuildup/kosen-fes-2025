import { useLanguage } from "../../context/LanguageContext";

interface StallProductsListProps {
  products: string[];
  compact?: boolean;
}

const StallProductsList = ({
  compact = false,
  products,
}: StallProductsListProps) => {
  const { t } = useLanguage();

  if (!products || products.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="stall-products-compact">
        <span className="stall-products-label">{t("detail.products")}: </span>
        <span className="stall-products-text">
          {products.slice(0, 2).join(", ")}
        </span>
        {products.length > 2 && (
          <span className="stall-products-more">+{products.length - 2}</span>
        )}
      </div>
    );
  }

  return (
    <div className="stall-products">
      <span className="stall-products-label">{t("detail.products")}: </span>
      <div className="stall-products-list">
        {products.map((product, index) => (
          <span key={index} className="stall-product-item">
            {product}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StallProductsList;

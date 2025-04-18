import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import useTagFilter from "../hooks/useTagFilter";
import { exhibitions } from "../data/exhibitions";
import { foodStalls } from "../data/foodStalls";
import CardList from "../components/common/CardList";
import TagFilter from "../components/features/tag/TagFilter";
import CardGrid from "../components/common/CardGrid";
import ExhibitionHeader from "../components/pages/exhibitions/ExhibitionHeader";
import TypeFilter from "../components/pages/exhibitions/TypeFilter";

// Exhibition types
type ExhibitionType = "all" | "exhibition" | "foodStall";

const ExhibitionsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get type from URL params or default to 'all'
  const typeParam = (searchParams.get("type") as ExhibitionType) || "all";
  const [activeType, setActiveType] = useState<ExhibitionType>(typeParam);

  // Convert exhibitions and food stalls data to SearchResult format
  const exhibitionItems = exhibitions.map((exhibition) => ({
    ...exhibition,
    type: "exhibition" as const,
  }));

  const foodStallItems = foodStalls.map((foodStall) => ({
    ...foodStall,
    type: "foodStall" as const,
  }));

  // Filter items by type
  const items =
    activeType === "all"
      ? [...exhibitionItems, ...foodStallItems]
      : activeType === "exhibition"
      ? exhibitionItems
      : foodStallItems;

  // Use tag filtering hook
  const { filteredItems, activeTag, setActiveTag, allTags } =
    useTagFilter(items);

  // Handle tag click from filter
  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
  };

  // Handle type filter change
  const handleTypeChange = (type: ExhibitionType) => {
    setActiveType(type);

    // Update URL params
    if (type === "all") {
      searchParams.delete("type");
    } else {
      searchParams.set("type", type);
    }

    setSearchParams(searchParams);

    // Clear tag filter when changing type
    if (activeTag) {
      setActiveTag("");
    }
  };

  // Get link path for details
  const getLinkPath = (item: (typeof filteredItems)[0]) => {
    if (item.type === "exhibition") {
      return `/exhibitions/${item.id}`;
    } else {
      return `/food-stalls/${item.id}`;
    }
  };

  // Handle card click (alternative to link navigation)
  const handleCardClick = (item: (typeof filteredItems)[0]) => {
    navigate(getLinkPath(item));
  };

  // Get title based on active type and tag
  const getTitle = () => {
    if (activeTag) {
      return `${t("exhibitions.filteredBy")}: ${activeTag}`;
    }

    if (activeType === "all") {
      return t("exhibitions.allExhibitionsAndFoodStalls");
    } else if (activeType === "exhibition") {
      return t("exhibitions.allExhibitions");
    } else {
      return t("exhibitions.allFoodStalls");
    }
  };

  return (
    <div className="exhibitions-page pb-8">
      {/* Exhibitions Header */}
      <ExhibitionHeader />

      <div className="container mx-auto px-4">
        {/* Type Filter */}
        <div className="mb-6">
          <TypeFilter activeType={activeType} onChange={handleTypeChange} />
        </div>

        {/* Tag Filter */}
        <div className="mb-6">
          <TagFilter
            tags={allTags}
            activeTag={activeTag}
            onTagClick={handleTagClick}
            filterPath="/exhibitions"
          />
        </div>

        {/* Exhibitions/Food Stalls List */}
        <CardGrid title={getTitle()}>
          <CardList
            items={filteredItems}
            isLoading={false}
            emptyMessage={t("exhibitions.noItems")}
            getLinkPath={getLinkPath}
            showBookmarkButton
            onCardClick={handleCardClick}
          />
        </CardGrid>
      </div>
    </div>
  );
};

export default ExhibitionsPage;

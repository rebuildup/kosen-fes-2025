import { useEffect, useState } from "react";

import ItemTypeIcon from "../components/common/ItemTypeIcon";
import PillButton from "../components/common/PillButton";
import Tag from "../components/common/Tag";
import ThemeToggleIcon from "../components/common/ThemeToggleIcon";
import {
  InfoIcon,
  LocationIcon,
  SettingsIcon,
  XIcon,
} from "../components/icons";
import VectorMap from "../components/map/VectorMap";
import TimelineDay from "../components/schedule/TimelineDay";
import { useData } from "../context/DataContext";
import UnifiedCard from "../shared/components/ui/UnifiedCard";
import type { Event, Exhibit, Item, Sponsor, Stall } from "../types/common";

type ContentType = "event" | "exhibit" | "stall" | "sponsor";
type PreviewMode = "card" | "detail" | "schedule" | "map";

interface FormData {
  type: ContentType;
  title: string;
  description: string;
  imageFile: File | null;
  imagePreviewUrl: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  coordinates: { x: number; y: number } | null;
  tags: string[];
  organizer?: string;
  creator?: string;
  products?: string[];
  duration?: number;
  website?: string;
}

// 予め定義された実用的なタグシステム
const PREDEFINED_TAGS = {
  // 機能・カテゴリータグ
  categories: [
    "セレモニー",
    "コンテスト",
    "ゲーム",
    "技術",
    "創作",
    "アート",
    "プログラミング",
    "SNS",
    "参加型",
    "健康",
    "社会貢献",
    "抽選",
  ],

  // コンテンツタイプタグ
  contentTypes: ["イベント", "展示", "露店", "スポンサー"],

  // 学科タグ
  departments: ["機械科", "電気科", "制御科", "物質科", "経営科", "専攻科"],

  // 食べ物・飲み物タグ
  food: [
    "食べ物",
    "飲み物",
    "和食",
    "洋食",
    "中華",
    "韓国料理",
    "アメリカン",
    "カレー",
    "スイーツ",
    "清涼飲料",
  ],
};

// 時間入力フォーマット関数（外出し）
const formatTimeInput = (value: string): string => {
  // 数値とコロンのみ許可
  const cleaned = value.replaceAll(/[^\d:]/g, "");

  // HH:MM形式に自動フォーマット
  if (cleaned.length === 2 && !cleaned.includes(":")) {
    return cleaned + ":";
  }

  // 最大5文字（HH:MM）
  if (cleaned.length > 5) {
    return cleaned.slice(0, 5);
  }

  // コロンが複数ある場合は最初のもののみ残す
  const parts = cleaned.split(":");
  if (parts.length > 2) {
    return parts[0] + ":" + parts[1];
  }

  return cleaned;
};

// コンテンツタイプ別のプレースホルダーとガイド（外出し）
const getContentGuide = (type: ContentType) => {
  switch (type) {
    case "event": {
      return {
        description:
          "例: 高専祭の幕開けを飾る盛大なセレモニーです。吹奏楽部の演奏、学生会による挨拶、そして今年のテーマ発表を行います。",
        duration: 90,
        endTime: "11:30",
        location: "例: 第一体育館",
        organizer: "例: 学生会",
        startTime: "10:00",
        title: "例: 高専祭オープニングセレモニー",
      };
    }
    case "exhibit": {
      return {
        creator: "例: 機械工学科3年A組",
        description:
          "例: 機械工学科の学生が製作した最新ロボットを展示します。AI搭載の自律移動ロボットや、産業用ロボットアームのデモンストレーションを行います。",
        endTime: "17:00",
        location: "例: 機電棟1階",
        startTime: "10:00",
        title: "例: ロボット技術展示",
      };
    }
    case "stall": {
      return {
        description:
          "例: 関西風の本格たこ焼きを提供します。外はカリッと中はトロトロの絶品たこ焼きをお楽しみください。ソース、マヨネーズ、青のりでお仕上げします。",
        endTime: "16:00",
        location: "例: 学生会館前",
        organizer: "例: 女子バレーボール部",
        products: ["たこ焼き(8個)", "たこ焼き(12個)", "飲み物"],
        startTime: "11:00",
        title: "例: たこ焼き露店",
      };
    }
    case "sponsor": {
      return {
        description:
          "例: 最新のIT技術とエンジニアリングソリューションを提供する企業です。学生の皆様の技術力向上と就職活動を応援しています。",
        endTime: "",
        location: "例: エントランスホール",
        startTime: "",
        title: "例: テックコーポレーション株式会社",
        website: "https://example-tech.com",
      };
    }
    default: {
      return {};
    }
  }
};

const ContentPreview = () => {
  const { getAllTags } = useData();

  const [formData, setFormData] = useState<FormData>({
    coordinates: null,
    date: "2025-11-08",
    description: "",
    duration: 60,
    endTime: "11:00",
    imageFile: null,
    imagePreviewUrl: "",
    location: "",
    startTime: "10:00",
    tags: [],
    title: "",
    type: "event",
  });

  const [previewMode, setPreviewMode] = useState<PreviewMode>("card");

  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [activeTagCategory, setActiveTagCategory] =
    useState<string>("contentTypes");

  // 上のgetContentGuideを使用

  // Load available tags - 既存タグと定義済みタグをマージ
  useEffect(() => {
    const existingTags = getAllTags();
    const allPredefinedTags = [
      ...PREDEFINED_TAGS.departments,
      ...PREDEFINED_TAGS.contentTypes,
      ...PREDEFINED_TAGS.categories,
      ...PREDEFINED_TAGS.food,
    ];

    // 重複を除去してマージ
    const uniqueTags = [...new Set([...allPredefinedTags, ...existingTags])];
    setAvailableTags(uniqueTags);
  }, [getAllTags]);

  // コンテンツタイプが変更された時の自動タグ設定と時間・日付のデフォルト設定
  useEffect(() => {
    const typeTag = PREDEFINED_TAGS.contentTypes.find((tag) => {
      return (
        (formData.type === "event" && tag === "イベント") ||
        (formData.type === "exhibit" && tag === "展示") ||
        (formData.type === "stall" && tag === "露店") ||
        (formData.type === "sponsor" && tag === "スポンサー")
      );
    });

    if (typeTag && !formData.tags.includes(typeTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [
          typeTag,
          ...prev.tags.filter(
            (tag) => !PREDEFINED_TAGS.contentTypes.includes(tag),
          ),
        ],
      }));
    }

    // コンテンツタイプ別のデフォルト時間・日付設定
    setFormData((prev) => {
      const updates: Partial<FormData> = {};

      switch (formData.type) {
        case "event": {
          // イベントは個別時間設定
          if (prev.type !== "event") {
            updates.startTime = "10:00";
            updates.endTime = "11:00";
            updates.date = "2025-11-08";
            updates.organizer = "学生会";
            updates.creator = undefined;
            updates.products = undefined;
            updates.website = undefined;
          }
          break;
        }
        case "exhibit": {
          // 展示は基本的に2日とも全日
          if (prev.type !== "exhibit") {
            updates.startTime = "10:00";
            updates.endTime = "18:00";
            updates.date = "2025-11-08,2025-11-09";
            updates.creator = "機械工学科3年A組";
            updates.organizer = undefined;
            updates.products = undefined;
            updates.website = undefined;
          }
          break;
        }
        case "stall": {
          // 露店は基本的に2日とも営業時間
          if (prev.type !== "stall") {
            updates.startTime = "11:00";
            updates.endTime = "17:00";
            updates.date = "2025-11-08,2025-11-09";
            updates.organizer = "女子バレーボール部";
            updates.products = ["たこ焼き(8個)", "たこ焼き(12個)", "飲み物"];
            updates.creator = undefined;
            updates.website = undefined;
          }
          break;
        }
        case "sponsor": {
          // スポンサーは日付・時間は使わない
          if (prev.type !== "sponsor") {
            updates.startTime = "";
            updates.endTime = "";
            updates.date = "";
            updates.website = "https://example-tech.com";
            updates.organizer = undefined;
            updates.creator = undefined;
            updates.products = undefined;
          }
          break;
        }
      }

      return { ...prev, ...updates };
    });
  }, [formData.type, formData.tags]);

  // Handle form changes
  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle image file selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreviewUrl: URL.createObjectURL(file),
      }));
    }
  };

  // Handle coordinate selection
  const handleCoordinateSelect = (coordinate: { x: number; y: number }) => {
    // 座標を小数点第1位で四捨五入して精度を向上
    const roundedCoordinate = {
      x: Math.round(coordinate.x * 10) / 10,
      y: Math.round(coordinate.y * 10) / 10,
    };

    setFormData((prev) => ({
      ...prev,
      coordinates: roundedCoordinate,
    }));
  };

  // Add/remove tags
  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  // Add new tag
  const addNewTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      setAvailableTags((prev) => [...prev, newTag.trim()]);
      toggleTag(newTag.trim());
      setNewTag("");
    }
  };

  // Get tags for current category
  const getCurrentCategoryTags = () => {
    switch (activeTagCategory) {
      case "departments": {
        return PREDEFINED_TAGS.departments;
      }
      case "contentTypes": {
        return PREDEFINED_TAGS.contentTypes;
      }
      case "categories": {
        return PREDEFINED_TAGS.categories;
      }
      case "food": {
        return PREDEFINED_TAGS.food;
      }
      default: {
        return availableTags;
      }
    }
  };

  // Generate preview item
  const generatePreviewItem = (): Item => {
    const baseItem = {
      date: formData.date,
      description: formData.description || "プレビューの説明文です。",
      id: `preview-${Date.now()}`,
      imageUrl: formData.imagePreviewUrl || "./images/events/event-1.jpg",
      location: formData.location || "未設定",
      tags: formData.tags.length > 0 ? formData.tags : ["プレビュー"],
      time:
        formData.type === "sponsor"
          ? "常時"
          : `${formData.startTime} - ${formData.endTime}`,
      title: formData.title || "プレビュータイトル",
    };

    switch (formData.type) {
      case "event": {
        return {
          ...baseItem,
          dayAvailability:
            formData.date === "2025-11-08"
              ? "day1"
              : formData.date === "2025-11-09"
                ? "day2"
                : "both",
          duration: formData.duration || 60,
          organizer: formData.organizer || "主催者未設定",
          showOnMap: true,
          showOnSchedule: true,
          type: "event",
        } as Event;
      }
      case "exhibit": {
        return {
          ...baseItem,
          creator: formData.creator || "制作者未設定",
          type: "exhibit",
        } as Exhibit;
      }
      case "stall": {
        return {
          ...baseItem,
          organizer: formData.organizer || "運営者未設定",
          products: formData.products || ["商品1", "商品2"],
          type: "stall",
        } as Stall;
      }
      case "sponsor": {
        return {
          ...baseItem,
          contactEmail: "",
          tier: "bronze",
          type: "sponsor",
          website: formData.website || "https://example.com",
        } as Sponsor;
      }
      default: {
        return baseItem as Item;
      }
    }
  };

  // 3つの同じアイテムを生成してカードとスケジュールで複数表示
  const generatePreviewItems = (): Item[] => {
    const baseItem = generatePreviewItem();

    // 3つのバリエーションを作成
    return [
      baseItem,
      {
        ...baseItem,
        id: baseItem.id + "_2",
        title: baseItem.title,
      },
      {
        ...baseItem,
        id: baseItem.id + "_3",
        title: baseItem.title,
      },
    ];
  };

  const previewItem = generatePreviewItem();
  const guide = getContentGuide(formData.type);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12 lg:mb-16">
          <div className="mb-8 flex items-center justify-center gap-4">
            <div
              className="glass-effect rounded-full p-3"
              style={{ color: "var(--text-primary)" }}
            >
              <SettingsIcon size={32} />
            </div>
            <h1
              className="text-2xl font-bold sm:text-3xl lg:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              コンテンツプレビュー
            </h1>
            <ThemeToggleIcon />
          </div>
          <p
            className="text-base sm:text-lg lg:text-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            掲載内容とプレビューを確認し、Formsに回答してください
          </p>
        </div>

        {/* Main Content - Vertical Layout */}
        <div className="space-y-8 sm:space-y-12">
          {/* Basic Information Section */}
          <div className="glass-card rounded-xl p-4 sm:p-6 lg:p-8">
            <h2
              className="mb-8 flex items-center gap-3 text-xl font-bold sm:mb-12 sm:text-2xl"
              style={{ color: "var(--text-primary)" }}
            >
              <InfoIcon size={28} />
              基本情報
            </h2>

            <div className="space-y-8 sm:space-y-12">
              {/* Content Type Selection */}
              <div>
                <label
                  className="mb-4 block text-base font-semibold sm:mb-6 sm:text-lg"
                  style={{ color: "var(--text-primary)" }}
                >
                  コンテンツタイプ
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "イベント", value: "event" },
                    { label: "展示", value: "exhibit" },
                    { label: "露店", value: "stall" },
                    { label: "スポンサー", value: "sponsor" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() =>
                        handleInputChange("type", type.value as ContentType)
                      }
                      className={`group relative flex items-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm ${
                        formData.type === type.value
                          ? "text-[var(--primary-color)]"
                          : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary-color)]"
                      }`}
                    >
                      <span>{type.label}</span>

                      {/* Animated underline */}
                      <div
                        className={`absolute right-2 bottom-0 left-2 h-0.5 rounded-full transition-all duration-300 ${
                          formData.type === type.value
                            ? "scale-x-100 opacity-100"
                            : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                        } `}
                        style={{
                          background: "var(--instagram-gradient)",
                        }}
                      />

                      {/* Subtle background gradient for active state */}
                      {formData.type === type.value && (
                        <div
                          className="absolute inset-0 -z-10 rounded-lg opacity-10"
                          style={{ background: "var(--instagram-gradient)" }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label
                  className="mb-3 block text-base font-semibold sm:mb-4 sm:text-lg"
                  style={{ color: "var(--text-primary)" }}
                >
                  タイトル
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={guide.title || "タイトルを入力してください"}
                  className={`glass-effect w-full rounded-xl border-2 px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg ${
                    errors.title ? "border-red-500" : "border-transparent"
                  }`}
                  style={{
                    color: "var(--text-primary)",
                  }}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  className="mb-3 block text-base font-semibold sm:mb-4 sm:text-lg"
                  style={{ color: "var(--text-primary)" }}
                >
                  説明
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder={
                    guide.description || "詳細な説明を入力してください"
                  }
                  rows={6}
                  className={`glass-effect w-full resize-none rounded-xl border-2 px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg ${
                    errors.description ? "border-red-500" : "border-transparent"
                  }`}
                  style={{
                    color: "var(--text-primary)",
                  }}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Date and Time Section */}
              <div className="space-y-8">
                <div>
                  <label
                    className="mb-3 block text-base font-semibold sm:mb-4 sm:text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    開催日
                  </label>
                  {formData.type === "sponsor" ? (
                    <input
                      type="text"
                      value="常時開催"
                      disabled
                      className="glass-effect w-full rounded-xl border-2 border-transparent px-3 py-2 text-base opacity-60 sm:px-4 sm:py-3 sm:text-lg"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-secondary)",
                      }}
                    />
                  ) : (
                    <select
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className="glass-effect w-full rounded-xl border-2 border-transparent px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      <option value="2025-11-08">
                        1日目（2025年11月8日・土）
                      </option>
                      <option value="2025-11-09">
                        2日目（2025年11月9日・日）
                      </option>
                      <option value="2025-11-08,2025-11-09">
                        両日（11月8日・9日）
                      </option>
                    </select>
                  )}
                </div>

                {formData.type !== "sponsor" && (
                  <div>
                    <label
                      className="mb-3 block text-base font-semibold sm:mb-4 sm:text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      時間
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                      <div>
                        <label
                          className="mb-2 block text-sm font-medium"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          開始時間
                        </label>
                        <input
                          type="text"
                          value={formData.startTime}
                          onChange={(e) => {
                            const value = e.target.value;
                            const formatted = formatTimeInput(value);
                            handleInputChange("startTime", formatted);
                          }}
                          placeholder="10:00"
                          pattern="^([01]?\d|2[0-3]):([0-5]\d)$"
                          maxLength={5}
                          className={`glass-effect w-full rounded-xl border-2 px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg ${
                            errors.startTime
                              ? "border-red-500"
                              : "border-transparent"
                          }`}
                          style={{
                            color: "var(--text-primary)",
                          }}
                        />
                        {errors.startTime && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.startTime}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className="mb-2 block text-sm font-medium"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          終了時間
                        </label>
                        <input
                          type="text"
                          value={formData.endTime}
                          onChange={(e) => {
                            const value = e.target.value;
                            const formatted = formatTimeInput(value);
                            handleInputChange("endTime", formatted);
                          }}
                          placeholder="17:00"
                          pattern="^([01]?\d|2[0-3]):([0-5]\d)$"
                          maxLength={5}
                          className={`glass-effect w-full rounded-xl border-2 px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg ${
                            errors.endTime
                              ? "border-red-500"
                              : "border-transparent"
                          }`}
                          style={{
                            color: "var(--text-primary)",
                          }}
                        />
                        {errors.endTime && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.endTime}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              {formData.type !== "sponsor" && (
                <div>
                  <label
                    className="mb-3 block text-base font-semibold sm:mb-4 sm:text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    場所
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder={guide.location || "場所を入力してください"}
                    className={`glass-effect w-full rounded-xl border-2 px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg ${
                      errors.location ? "border-red-500" : "border-transparent"
                    }`}
                    style={{
                      color: "var(--text-primary)",
                    }}
                  />
                  {errors.location && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.location}
                    </p>
                  )}
                </div>
              )}

              {/* Type-specific fields */}
              {formData.type === "event" && (
                <div className="space-y-8">
                  <div>
                    <label
                      className="mb-3 block text-base font-semibold sm:mb-4 sm:text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      主催者
                    </label>
                    <input
                      type="text"
                      value={formData.organizer || ""}
                      onChange={(e) =>
                        handleInputChange("organizer", e.target.value)
                      }
                      placeholder={guide.organizer || "主催者名"}
                      className="glass-effect w-full rounded-xl border-2 border-transparent px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-3 block text-base font-semibold sm:mb-4 sm:text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      開催時間（分）
                    </label>
                    <input
                      type="number"
                      value={formData.duration || 60}
                      onChange={(e) =>
                        handleInputChange(
                          "duration",
                          Number.parseInt(e.target.value),
                        )
                      }
                      placeholder="60"
                      className="glass-effect w-full rounded-xl border-2 border-transparent px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>
              )}

              {formData.type === "exhibit" && (
                <div>
                  <label
                    className="mb-3 block text-base font-semibold sm:mb-4 sm:text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    制作者
                  </label>
                  <input
                    type="text"
                    value={formData.creator || ""}
                    onChange={(e) =>
                      handleInputChange("creator", e.target.value)
                    }
                    placeholder={guide.creator || "制作者名"}
                    className="glass-effect w-full rounded-xl border-2 border-transparent px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              )}

              {formData.type === "stall" && (
                <div className="space-y-8">
                  <div>
                    <label
                      className="mb-3 block text-base font-semibold sm:mb-4 sm:text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      運営者
                    </label>
                    <input
                      type="text"
                      value={formData.organizer || ""}
                      onChange={(e) =>
                        handleInputChange("organizer", e.target.value)
                      }
                      placeholder={guide.organizer || "運営者名"}
                      className="glass-effect w-full rounded-xl border-2 border-transparent px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-3 block text-base font-semibold sm:mb-4 sm:text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      商品・メニュー
                    </label>
                    <input
                      type="text"
                      value={formData.products?.join(", ") || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "products",
                          e.target.value
                            .split(", ")
                            .filter((item) => item.trim()),
                        )
                      }
                      placeholder={
                        guide.products?.join(", ") || "商品1, 商品2, 商品3"
                      }
                      className="glass-effect w-full rounded-xl border-2 border-transparent px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    />
                    <p
                      className="mt-2 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      商品はカンマ区切りで入力してください
                    </p>
                  </div>
                </div>
              )}

              {formData.type === "sponsor" && (
                <div>
                  <label
                    className="mb-3 block text-base font-semibold sm:mb-4 sm:text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ウェブサイト
                  </label>
                  <input
                    type="url"
                    value={formData.website || ""}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder={guide.website || "https://example.com"}
                    className="glass-effect w-full rounded-xl border-2 border-transparent px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label
                  className="mb-3 block text-base font-semibold sm:mb-4 sm:text-lg"
                  style={{ color: "var(--text-primary)" }}
                >
                  画像ファイル
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`glass-effect w-full rounded-xl border-2 px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg ${
                    errors.image ? "border-red-500" : "border-transparent"
                  }`}
                  style={{
                    color: "var(--text-primary)",
                  }}
                />
                {errors.image && (
                  <p className="mt-2 text-sm text-red-500">{errors.image}</p>
                )}
                {formData.imagePreviewUrl && (
                  <div className="mt-4">
                    <img
                      src={formData.imagePreviewUrl}
                      alt="プレビュー"
                      className="glass-effect h-40 w-40 rounded-xl border-2 border-[var(--border-color)] object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label
                  className="mb-4 block text-base font-semibold sm:mb-6 sm:text-lg"
                  style={{ color: "var(--text-primary)" }}
                >
                  タグ選択
                </label>

                {/* Tag category selector */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {[
                    { key: "contentTypes", label: "コンテンツ" },
                    { key: "departments", label: "学科" },
                    { key: "categories", label: "機能" },
                    { key: "food", label: "食べ物" },
                  ].map((category) => (
                    <button
                      key={category.key}
                      onClick={() => setActiveTagCategory(category.key)}
                      className={`group relative flex items-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm ${
                        activeTagCategory === category.key
                          ? "text-[var(--primary-color)]"
                          : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary-color)]"
                      }`}
                    >
                      <span>{category.label}</span>

                      {/* Animated underline */}
                      <div
                        className={`absolute right-2 bottom-0 left-2 h-0.5 rounded-full transition-all duration-300 ${
                          activeTagCategory === category.key
                            ? "scale-x-100 opacity-100"
                            : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                        } `}
                        style={{
                          background: "var(--instagram-gradient)",
                        }}
                      />

                      {/* Subtle background gradient for active state */}
                      {activeTagCategory === category.key && (
                        <div
                          className="absolute inset-0 -z-10 rounded-lg opacity-10"
                          style={{ background: "var(--instagram-gradient)" }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tag selection */}
                <div className="mb-6 flex flex-wrap gap-3">
                  {getCurrentCategoryTags().map((tag) => (
                    <PillButton
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      variant={
                        formData.tags.includes(tag) ? "primary" : "secondary"
                      }
                      size="sm"
                      className="transition-all duration-300"
                    >
                      {tag}
                    </PillButton>
                  ))}
                </div>

                {/* Selected tags display */}
                {formData.tags.length > 0 && (
                  <div className="mb-6">
                    <p
                      className="mb-3 text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      選択中のタグ ({formData.tags.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="glass-effect inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
                          style={{
                            backgroundColor: "var(--primary-color)",
                            borderColor: "var(--primary-color)",
                            color: "white",
                          }}
                        >
                          {tag}
                          <button
                            onClick={() => toggleTag(tag)}
                            className="rounded-full p-1 transition-colors hover:bg-white/20"
                            style={{ color: "inherit" }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* New tag input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="カスタムタグを追加"
                    className="glass-effect flex-1 rounded-xl border-2 border-transparent px-3 py-2 text-base transition-all focus:ring-2 focus:ring-[var(--primary-color)] sm:px-4 sm:py-3 sm:text-lg"
                    style={{
                      color: "var(--text-primary)",
                    }}
                    onKeyPress={(e) => e.key === "Enter" && addNewTag()}
                  />
                  <PillButton
                    onClick={addNewTag}
                    variant="primary"
                    size="md"
                    className="px-6"
                  >
                    追加
                  </PillButton>
                </div>
              </div>

              {/* Map Coordinate Selection */}
              <div>
                <label
                  className="mb-3 flex items-center gap-3 text-base font-semibold sm:mb-4 sm:text-lg"
                  style={{ color: "var(--text-primary)" }}
                >
                  <LocationIcon size={24} />
                  マップ上の位置選択
                </label>

                {errors.coordinates && (
                  <p className="mb-4 text-sm text-red-500">
                    {errors.coordinates}
                  </p>
                )}

                {/* Coordinate display */}
                <div className="mb-6">
                  {formData.coordinates ? (
                    <div className="glass-effect flex items-center justify-between rounded-xl border-2 border-[var(--border-color)] p-4">
                      <div>
                        <p
                          className="flex items-center gap-2 text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          <LocationIcon size={16} />
                          選択済み座標
                        </p>
                        <p
                          className="glass-subtle mt-1 inline-block rounded-xl px-3 py-1.5 font-mono text-base"
                          style={{ color: "var(--text-primary)" }}
                        >
                          X: {formData.coordinates.x.toFixed(1)}, Y:{" "}
                          {formData.coordinates.y.toFixed(1)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCoordinateSelect({ x: 0, y: 0 })}
                        className="rounded-lg p-2 transition-all hover:bg-[var(--bg-secondary)]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <XIcon size={20} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="glass-effect flex items-center gap-3 rounded-xl border-2 border-[var(--border-color)] p-4"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <LocationIcon size={20} />
                      <span className="font-medium">
                        マップをクリックして位置を選択してください
                      </span>
                    </div>
                  )}
                </div>

                {/* Interactive Map for coordinate selection */}
                <div className="glass-effect overflow-hidden rounded-xl border-2 border-[var(--border-color)]">
                  <VectorMap
                    key="interactive-map"
                    mode="interactive"
                    onMapClick={handleCoordinateSelect}
                    highlightPoint={formData.coordinates || undefined}
                    points={
                      formData.coordinates
                        ? [
                            {
                              coordinates: formData.coordinates,
                              id: "selected-coordinate",
                              onClick: () => {},
                              onHover: () => {},
                              title: "選択された位置",
                              type: "event" as const,
                            },
                          ]
                        : []
                    }
                    height="320px"
                    className="h-80"
                    maxZoom={8}
                    minZoom={0.3}
                    showControls={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="glass-card rounded-xl p-4 sm:p-6 lg:p-8">
            <div className="mb-12 flex items-center justify-between">
              <h2
                className="flex items-center gap-3 text-xl font-bold sm:text-2xl"
                style={{ color: "var(--text-primary)" }}
              >
                <InfoIcon size={28} />
                プレビュー
              </h2>
              <ThemeToggleIcon />
            </div>

            {/* Preview Mode Tabs */}
            <div className="mb-8 flex flex-wrap gap-2">
              {[
                { key: "card", label: "カード" },
                { key: "detail", label: "詳細ページ" },
                { key: "schedule", label: "スケジュール" },
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setPreviewMode(mode.key as PreviewMode)}
                  className={`group relative flex items-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm ${
                    previewMode === mode.key
                      ? "text-[var(--primary-color)]"
                      : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary-color)]"
                  }`}
                >
                  <span>{mode.label}</span>

                  {/* Animated underline */}
                  <div
                    className={`absolute right-2 bottom-0 left-2 h-0.5 rounded-full transition-all duration-300 ${
                      previewMode === mode.key
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                    } `}
                    style={{
                      background: "var(--instagram-gradient)",
                    }}
                  />

                  {/* Subtle background gradient for active state */}
                  {previewMode === mode.key && (
                    <div
                      className="absolute inset-0 -z-10 rounded-lg opacity-10"
                      style={{ background: "var(--instagram-gradient)" }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Preview Content */}
            {previewMode === "card" && (
              <div>
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  カードプレビュー
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {generatePreviewItems().map((item) => (
                    <UnifiedCard
                      key={item.id}
                      item={item}
                      variant="default"
                      showTags={true}
                      showDescription={true}
                      onClick={() => setPreviewMode("detail")}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Detail Preview - Full implementation as before */}
            {previewMode === "detail" && (
              <div>
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  詳細ページプレビュー
                </h3>
                <div className="max-h-[600px] space-y-6 overflow-y-auto">
                  <div className="mb-6 flex items-center gap-4">
                    <ItemTypeIcon type={previewItem.type} size="large" />
                    <span
                      className="rounded-full px-3 py-1 text-sm font-medium"
                      style={{
                        backgroundColor: "var(--primary-color)",
                        color: "var(--bg-primary)",
                      }}
                    >
                      {previewItem.type === "event" && "イベント"}
                      {previewItem.type === "exhibit" && "展示"}
                      {previewItem.type === "stall" && "露店"}
                      {previewItem.type === "sponsor" && "スポンサー"}
                    </span>
                  </div>

                  <h1
                    className="mb-4 text-2xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {previewItem.title}
                  </h1>

                  <div
                    className="grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-3"
                    style={{ backgroundColor: "var(--bg-primary)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        日付:
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {previewItem.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        時間:
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {previewItem.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        場所:
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {previewItem.location}
                      </span>
                    </div>
                  </div>

                  {previewItem.imageUrl && (
                    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      <img
                        src={previewItem.imageUrl}
                        alt={previewItem.title}
                        className="h-auto w-full object-cover"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                        }}
                      />
                    </div>
                  )}

                  {/* Location Map Preview */}
                  {previewItem.location && formData.coordinates && (
                    <div
                      className="rounded-lg p-4"
                      style={{ backgroundColor: "var(--bg-primary)" }}
                    >
                      <h3
                        className="mb-3 flex items-center gap-2 text-lg font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        場所: {previewItem.location}
                      </h3>
                      <div
                        className="map-container h-64 overflow-hidden rounded-lg border"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        <VectorMap
                          key="preview-map"
                          mode="detail"
                          highlightPoint={formData.coordinates}
                          height="256px"
                          className="h-full"
                          maxZoom={8}
                          minZoom={0.3}
                          showControls={true}
                        />
                      </div>
                      <p
                        className="mt-2 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        座標: X={formData.coordinates.x.toFixed(1)}, Y=
                        {formData.coordinates.y.toFixed(1)}
                      </p>
                    </div>
                  )}

                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: "var(--bg-primary)" }}
                  >
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {previewItem.description}
                    </p>
                  </div>

                  {/* Specific Details Section */}
                  {formData.type === "event" && (
                    <div
                      className="rounded-lg p-6"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      <h3
                        className="mb-4 text-xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        イベント詳細
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            主催者:
                          </span>
                          <span style={{ color: "var(--text-secondary)" }}>
                            {formData.organizer || "未設定"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            開催時間:
                          </span>
                          <span style={{ color: "var(--text-secondary)" }}>
                            {formData.startTime && formData.endTime
                              ? `${formData.startTime} - ${formData.endTime}`
                              : "未設定"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.type === "exhibit" && (
                    <div
                      className="rounded-lg p-6"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      <h3
                        className="mb-4 text-xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        展示詳細
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            制作者:
                          </span>
                          <span style={{ color: "var(--text-secondary)" }}>
                            {formData.creator || "未設定"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            展示時間:
                          </span>
                          <span style={{ color: "var(--text-secondary)" }}>
                            {formData.startTime && formData.endTime
                              ? `${formData.startTime} - ${formData.endTime}`
                              : "未設定"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.type === "stall" && (
                    <div
                      className="rounded-lg p-6"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      <h3
                        className="mb-4 text-xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        露店詳細
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            運営者:
                          </span>
                          <span style={{ color: "var(--text-secondary)" }}>
                            {formData.organizer || "未設定"}
                          </span>
                        </div>
                        <div>
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            提供商品:
                          </span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {formData.products &&
                            formData.products.length > 0 ? (
                              formData.products.map((product, index) => (
                                <span
                                  key={index}
                                  className="rounded px-2 py-1 text-sm"
                                  style={{
                                    backgroundColor: "var(--bg-tertiary)",
                                    color: "var(--text-secondary)",
                                  }}
                                >
                                  {product}
                                </span>
                              ))
                            ) : (
                              <span style={{ color: "var(--text-secondary)" }}>
                                未設定
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            営業時間:
                          </span>
                          <span style={{ color: "var(--text-secondary)" }}>
                            {formData.startTime && formData.endTime
                              ? `${formData.startTime} - ${formData.endTime}`
                              : "未設定"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.type === "sponsor" && (
                    <div
                      className="rounded-lg p-6"
                      style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      <h3
                        className="mb-4 text-xl font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        スポンサー詳細
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            ウェブサイト:
                          </span>
                          {formData.website ? (
                            <a
                              href={formData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                              style={{ color: "var(--primary-color)" }}
                            >
                              {formData.website}
                            </a>
                          ) : (
                            <span style={{ color: "var(--text-secondary)" }}>
                              未設定
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {previewItem.tags && previewItem.tags.length > 0 && (
                    <div>
                      <h3
                        className="mb-3 text-lg font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        タグ
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {previewItem.tags.map((tag, idx) => (
                          <Tag key={idx} tag={tag} interactive={false} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className="rounded-lg p-4"
                    style={{ backgroundColor: "var(--bg-primary)" }}
                  >
                    <h3
                      className="mb-3 text-lg font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      マップ
                    </h3>
                    <p style={{ color: "var(--text-secondary)" }}>
                      {previewItem.location}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Preview */}
            {previewMode === "schedule" && previewItem.type !== "sponsor" && (
              <div>
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  スケジュール表示プレビュー
                </h3>
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "var(--bg-primary)" }}
                >
                  <TimelineDay
                    date={previewItem.date}
                    items={
                      generatePreviewItems() as (Event | Exhibit | Stall)[]
                    }
                    timeSlots={[previewItem.time.split(" - ")[0]]}
                    groupedItems={{
                      [previewItem.time.split(" - ")[0]]:
                        generatePreviewItems() as (Event | Exhibit | Stall)[],
                    }}
                    dayName={
                      previewItem.date === "2025-11-08" ? "1日目" : "2日目"
                    }
                    animationKey={0}
                    onItemClick={() => setPreviewMode("detail")}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div className="glass-card mt-12 rounded-xl p-12 text-center">
            <div className="mx-auto max-w-4xl">
              <h3
                className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl"
                style={{ color: "var(--text-primary)" }}
              >
                Microsoft Formsで申請
              </h3>
              <p
                className="mb-6 text-base leading-relaxed sm:mb-8 sm:text-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                プレビューで内容を確認できました。
                問題がなければ下のボタンからMicrosoft
                Formsで正式に申請してください。
              </p>
              <PillButton
                href="https://forms.office.com/r/qaztknQ9fY"
                external={true}
                variant="primary"
                size="lg"
                className="px-12 py-4 text-lg font-bold"
              >
                申請フォームを開く
              </PillButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;

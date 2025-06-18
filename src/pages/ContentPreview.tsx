import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";
import { useLanguage } from "../context/LanguageContext";
import { Item, Event, Exhibit, Stall, Sponsor } from "../types/common";
import UnifiedCard from "../shared/components/ui/UnifiedCard";
import UnifiedMap from "../components/map/UnifiedMap";
import TimelineDay from "../components/schedule/TimelineDay";
import Tag from "../components/common/Tag";
import ItemTypeIcon from "../components/common/ItemTypeIcon";

type ContentType = "event" | "exhibit" | "stall" | "sponsor";

interface FormData {
  type: ContentType;
  title: string;
  description: string;
  imageFile: File | null;
  imagePreviewUrl: string;
  date: string;
  time: string;
  location: string;
  coordinates: { x: number; y: number } | null;
  tags: string[];
  organizer?: string;
  creator?: string;
  products?: string[];
  duration?: number;
  website?: string;
}

const ContentPreview = () => {
  const { theme, toggleTheme } = useTheme();
  const { getAllTags } = useData();
  const { t } = useLanguage();

  const [formData, setFormData] = useState<FormData>({
    type: "event",
    title: "",
    description: "",
    imageFile: null,
    imagePreviewUrl: "",
    date: "2025-11-08",
    time: "10:00 - 11:00",
    location: "",
    coordinates: null,
    tags: [],
    duration: 60,
  });

  const [previewMode, setPreviewMode] = useState<
    "card" | "detail" | "schedule" | "map"
  >("card");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // コンテンツタイプ別のプレースホルダーとガイド
  const getContentGuide = (type: ContentType) => {
    switch (type) {
      case "event":
        return {
          title: "例: 高専祭オープニングセレモニー",
          description:
            "例: 高専祭の幕開けを飾る盛大なセレモニーです。吹奏楽部の演奏、学生会による挨拶、そして今年のテーマ発表を行います。",
          organizer: "例: 学生会",
          duration: 90,
          time: "10:00 - 11:30",
          location: "例: 第一体育館",
        };
      case "exhibit":
        return {
          title: "例: ロボット技術展示",
          description:
            "例: 機械工学科の学生が製作した最新ロボットを展示します。AI搭載の自律移動ロボットや、産業用ロボットアームのデモンストレーションを行います。",
          creator: "例: 機械工学科3年A組",
          time: "10:00 - 17:00",
          location: "例: 機電棟1階",
        };
      case "stall":
        return {
          title: "例: たこ焼き屋台",
          description:
            "例: 関西風の本格たこ焼きを提供します。外はカリッと中はトロトロの絶品たこ焼きをお楽しみください。ソース、マヨネーズ、青のりでお仕上げします。",
          products: ["たこ焼き(8個)", "たこ焼き(12個)", "飲み物"],
          time: "11:00 - 16:00",
          location: "例: 学生会館前",
        };
      case "sponsor":
        return {
          title: "例: テックコーポレーション株式会社",
          description:
            "例: 最新のIT技術とエンジニアリングソリューションを提供する企業です。学生の皆様の技術力向上と就職活動を応援しています。",
          website: "https://example-tech.com",
          time: "全日",
          location: "例: エントランスホール",
        };
      default:
        return {};
    }
  };

  // Load available tags
  useEffect(() => {
    setAvailableTags(getAllTags());
  }, [getAllTags]);

  // Handle form changes
  const handleInputChange = (field: keyof FormData, value: any) => {
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
    setFormData((prev) => ({
      ...prev,
      coordinates: coordinate,
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

  // Generate preview item
  const generatePreviewItem = (): Item => {
    const baseItem = {
      id: `preview-${Date.now()}`,
      title: formData.title || "プレビュータイトル",
      description: formData.description || "プレビューの説明文です。",
      imageUrl: formData.imagePreviewUrl || "/images/events/event-1.jpg",
      date: formData.date,
      time: formData.time,
      location: formData.location || "未設定",
      tags: formData.tags.length > 0 ? formData.tags : ["プレビュー"],
    };

    switch (formData.type) {
      case "event":
        return {
          ...baseItem,
          type: "event",
          organizer: formData.organizer || "主催者未設定",
          duration: formData.duration || 60,
        } as Event;
      case "exhibit":
        return {
          ...baseItem,
          type: "exhibit",
          creator: formData.creator || "制作者未設定",
        } as Exhibit;
      case "stall":
        return {
          ...baseItem,
          type: "stall",
          products: formData.products || ["商品1", "商品2"],
        } as Stall;
      case "sponsor":
        return {
          ...baseItem,
          type: "sponsor",
          website: formData.website || "https://example.com",
          tier: "bronze",
        } as Sponsor;
      default:
        return baseItem as Event;
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = t("errors.titleRequired");
    if (!formData.description.trim())
      newErrors.description = t("errors.descriptionRequired");
    if (!formData.location.trim())
      newErrors.location = t("errors.locationRequired");
    if (!formData.coordinates)
      newErrors.coordinates = t("errors.coordinatesRequired");
    if (!formData.imageFile && !formData.imagePreviewUrl)
      newErrors.image = t("errors.imageRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit to Microsoft Forms
  const handleSubmit = () => {
    if (validateForm()) {
      const formsUrl = "https://forms.cloud.microsoft/hogehoge";
      window.open(formsUrl, "_blank");
    }
  };

  const previewItem = generatePreviewItem();
  const guide = getContentGuide(formData.type);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              コンテンツプレビュー ページ
            </h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
              }}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            掲載内容とプレビューを確認し、Formsに回答してください。
          </p>
        </div>

        {/* Main Content - Vertical Layout */}
        <div className="space-y-8">
          {/* Basic Information Section */}
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              基本情報
            </h2>

            <div className="space-y-6">
              {/* Content Type Selection */}
              <div>
                <label
                  className="block text-sm font-medium mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  コンテンツタイプ *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "event", label: "イベント", icon: "🎤" },
                    { value: "exhibit", label: "展示", icon: "🏛️" },
                    { value: "stall", label: "屋台", icon: "🍡" },
                    { value: "sponsor", label: "スポンサー", icon: "🏢" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange("type", type.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        formData.type === type.value
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          formData.type === type.value
                            ? "var(--color-accent)"
                            : "var(--color-bg-primary)",
                        borderColor:
                          formData.type === type.value
                            ? "var(--color-accent)"
                            : "var(--color-border-primary)",
                        color:
                          formData.type === type.value
                            ? "white"
                            : "var(--color-text-primary)",
                      }}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  タイトル *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={guide.title || "タイトルを入力してください"}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.title ? "border-red-500" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--color-bg-primary)",
                    borderColor: errors.title
                      ? "#ef4444"
                      : "var(--color-border-primary)",
                    color: "var(--color-text-primary)",
                  }}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  説明 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder={
                    guide.description || "詳細な説明を入力してください"
                  }
                  rows={4}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--color-bg-primary)",
                    borderColor: errors.description
                      ? "#ef4444"
                      : "var(--color-border-primary)",
                    color: "var(--color-text-primary)",
                  }}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    日付 *
                  </label>
                  <select
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: "var(--color-bg-primary)",
                      borderColor: "var(--color-border-primary)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <option value="2025-11-08">2025年6月15日（土）</option>
                    <option value="2025-11-09">2025年6月16日（日）</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    時間 *
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    placeholder={guide.time || "10:00 - 11:00"}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: "var(--color-bg-primary)",
                      borderColor: "var(--color-border-primary)",
                      color: "var(--color-text-primary)",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    場所 *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder={guide.location || "場所を入力してください"}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      errors.location ? "border-red-500" : ""
                    }`}
                    style={{
                      backgroundColor: "var(--color-bg-primary)",
                      borderColor: errors.location
                        ? "#ef4444"
                        : "var(--color-border-primary)",
                      color: "var(--color-text-primary)",
                    }}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Type-specific fields */}
              {formData.type === "event" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--color-text-primary)" }}
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
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: "var(--color-bg-primary)",
                        borderColor: "var(--color-border-primary)",
                        color: "var(--color-text-primary)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      開催時間（分）
                    </label>
                    <input
                      type="number"
                      value={formData.duration || 60}
                      onChange={(e) =>
                        handleInputChange("duration", parseInt(e.target.value))
                      }
                      placeholder="60"
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: "var(--color-bg-primary)",
                        borderColor: "var(--color-border-primary)",
                        color: "var(--color-text-primary)",
                      }}
                    />
                  </div>
                </div>
              )}

              {formData.type === "exhibit" && (
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-primary)" }}
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
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: "var(--color-bg-primary)",
                      borderColor: "var(--color-border-primary)",
                      color: "var(--color-text-primary)",
                    }}
                  />
                </div>
              )}

              {formData.type === "stall" && (
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    販売商品(1行に1つ)
                  </label>
                  <textarea
                    value={formData.products?.join("\n") || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "products",
                        e.target.value.split("\n").filter((p) => p.trim())
                      )
                    }
                    placeholder={
                      guide.products?.join("\n") || "商品1\n商品2\n商品3"
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: "var(--color-bg-primary)",
                      borderColor: "var(--color-border-primary)",
                      color: "var(--color-text-primary)",
                    }}
                  />
                </div>
              )}

              {formData.type === "sponsor" && (
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-text-primary)" }}
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
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: "var(--color-bg-primary)",
                      borderColor: "var(--color-border-primary)",
                      color: "var(--color-text-primary)",
                    }}
                  />
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  画像ファイル *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.image ? "border-red-500" : ""
                  }`}
                  style={{
                    backgroundColor: "var(--color-bg-primary)",
                    borderColor: errors.image
                      ? "#ef4444"
                      : "var(--color-border-primary)",
                    color: "var(--color-text-primary)",
                  }}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
                {formData.imagePreviewUrl && (
                  <div className="mt-3">
                    <img
                      src={formData.imagePreviewUrl}
                      alt="プレビュー"
                      className="w-32 h-32 object-cover rounded-lg border"
                      style={{ borderColor: "var(--color-border-primary)" }}
                    />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  タグ選択
                </label>

                {/* New tag input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="新しいタグを追加"
                    className="flex-1 px-3 py-2 rounded-lg border"
                    style={{
                      backgroundColor: "var(--color-bg-primary)",
                      borderColor: "var(--color-border-primary)",
                      color: "var(--color-text-primary)",
                    }}
                    onKeyPress={(e) => e.key === "Enter" && addNewTag()}
                  />
                  <button
                    onClick={addNewTag}
                    className="px-4 py-2 rounded-lg transition-all"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "white",
                    }}
                  >
                    追加
                  </button>
                </div>

                {/* Tag selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        formData.tags.includes(tag)
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      style={{
                        backgroundColor: formData.tags.includes(tag)
                          ? "var(--color-accent)"
                          : "var(--color-bg-tertiary)",
                        color: formData.tags.includes(tag)
                          ? "white"
                          : "var(--color-text-primary)",
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    選択中: {formData.tags.length}個のタグ
                  </p>
                </div>
              </div>

              {/* Map Coordinate Selection */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  マップ上の位置選択 *
                </label>

                {errors.coordinates && (
                  <p className="text-red-500 text-sm mb-3">
                    {errors.coordinates}
                  </p>
                )}

                {/* Coordinate display and copy */}
                <div
                  className="mb-4 p-3 rounded-lg"
                  style={{ backgroundColor: "var(--color-bg-primary)" }}
                >
                  {formData.coordinates ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          選択中の座標:
                        </p>
                        <p
                          className="text-sm font-mono"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          X: {formData.coordinates.x.toFixed(1)}, Y:{" "}
                          {formData.coordinates.y.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-orange-500">
                      マップをクリックして位置を選択してください
                    </p>
                  )}
                </div>

                {/* Interactive Map for coordinate selection */}
                <div
                  className="rounded-lg overflow-hidden border"
                  style={{ borderColor: "var(--color-border-primary)" }}
                >
                  <UnifiedMap
                    mode="interactive"
                    onCoordinateSelect={handleCoordinateSelect}
                    selectedCoordinate={formData.coordinates}
                    height="320px"
                    className="h-80"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                プレビュー
              </h2>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                }}
              >
                {theme === "light" ? "🌙 ダークモード" : "☀️ ライトモード"}
              </button>
            </div>

            {/* Preview Mode Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {[
                {
                  key: "card",
                  label: "カード",
                  icon: "🃏",
                  desc: "カード表示",
                },
                {
                  key: "detail",
                  label: "詳細ページ",
                  icon: "📄",
                  desc: "実際のDetailページ",
                },
                {
                  key: "schedule",
                  label: "スケジュール",
                  icon: "📅",
                  desc: "タイムライン表示",
                },
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setPreviewMode(mode.key as any)}
                  className={`p-3 rounded-lg border transition-all text-center ${
                    previewMode === mode.key
                      ? "ring-2 ring-blue-500 shadow-lg"
                      : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor:
                      previewMode === mode.key
                        ? "var(--color-accent)"
                        : "var(--color-bg-primary)",
                    borderColor:
                      previewMode === mode.key
                        ? "var(--color-accent)"
                        : "var(--color-border-primary)",
                    color:
                      previewMode === mode.key
                        ? "white"
                        : "var(--color-text-primary)",
                  }}
                >
                  <div className="text-2xl mb-1">{mode.icon}</div>
                  <div className="font-medium text-sm">{mode.label}</div>
                  <div
                    className="text-xs mt-1 opacity-75"
                    style={{
                      color:
                        previewMode === mode.key
                          ? "rgba(255,255,255,0.8)"
                          : "var(--color-text-secondary)",
                    }}
                  >
                    {mode.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Preview Content */}
            {previewMode === "card" && (
              <div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  カードプレビュー
                </h3>
                <div className="max-w-sm">
                  <UnifiedCard
                    item={previewItem}
                    variant="default"
                    showTags={true}
                    showDescription={true}
                  />
                </div>
              </div>
            )}

            {/* Detail Preview - Full implementation as before */}
            {previewMode === "detail" && (
              <div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  詳細ページプレビュー
                </h3>
                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <ItemTypeIcon type={previewItem.type as any} size="large" />
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: "var(--color-accent)",
                        color: "white",
                      }}
                    >
                      {previewItem.type === "event" && "イベント"}
                      {previewItem.type === "exhibit" && "展示"}
                      {previewItem.type === "stall" && "屋台"}
                      {previewItem.type === "sponsor" && "スポンサー"}
                    </span>
                  </div>

                  <h1
                    className="text-2xl font-bold mb-4"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {previewItem.title}
                  </h1>

                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg"
                    style={{ backgroundColor: "var(--color-bg-primary)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span>🕒</span>
                      <span
                        className="font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        日付:
                      </span>
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        {previewItem.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span
                        className="font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        時間:
                      </span>
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        {previewItem.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span
                        className="font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        場所:
                      </span>
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        {previewItem.location}
                      </span>
                    </div>
                  </div>

                  {previewItem.imageUrl && (
                    <div className="rounded-lg overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10">
                      <img
                        src={previewItem.imageUrl}
                        alt={previewItem.title}
                        className="w-full h-auto object-cover"
                        style={{
                          backgroundColor: "var(--color-bg-primary)",
                        }}
                      />
                    </div>
                  )}

                  {/* Location Map Preview */}
                  {previewItem.location && formData.coordinates && (
                    <div
                      className="rounded-lg p-4"
                      style={{ backgroundColor: "var(--color-bg-primary)" }}
                    >
                      <h3
                        className="text-lg font-semibold mb-3 flex items-center gap-2"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        <span>📍</span>
                        場所: {previewItem.location}
                      </h3>
                      <div
                        className="map-container h-64 rounded-lg overflow-hidden border"
                        style={{ borderColor: "var(--color-border-primary)" }}
                      >
                        <UnifiedMap
                          mode="detail"
                          highlightCoordinate={formData.coordinates}
                          allowInteraction={false}
                          height="256px"
                          className="h-full pointer-events-none"
                        />
                      </div>
                      <p
                        className="text-sm mt-2"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        座標: X={formData.coordinates.x.toFixed(1)}, Y=
                        {formData.coordinates.y.toFixed(1)}
                      </p>
                    </div>
                  )}

                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "var(--color-bg-primary)" }}
                  >
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {previewItem.description}
                    </p>
                  </div>

                  {previewItem.tags && previewItem.tags.length > 0 && (
                    <div>
                      <h3
                        className="text-lg font-semibold mb-3"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        タグ
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {previewItem.tags.map((tag, idx) => (
                          <Tag key={idx} tag={tag} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "var(--color-bg-primary)" }}
                  >
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      マップ
                    </h3>
                    <p style={{ color: "var(--color-text-secondary)" }}>
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
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  スケジュール表示プレビュー
                </h3>
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "var(--color-bg-primary)" }}
                >
                  <TimelineDay
                    date={previewItem.date}
                    items={[previewItem as any]}
                    timeSlots={[previewItem.time.split(" - ")[0]]}
                    groupedItems={{
                      [previewItem.time.split(" - ")[0]]: [previewItem as any],
                    }}
                    dayName={
                      previewItem.date === "2025-11-08" ? "1日目" : "2日目"
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div
            className="mt-12 p-8 rounded-xl text-center"
            style={{ backgroundColor: "var(--color-bg-secondary)" }}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Formsへの回答をお願いします
            </h3>
            <p
              className="text-sm mb-6 max-w-2xl mx-auto"
              style={{ color: "var(--color-text-secondary)" }}
            >
              実際にユーザーが見るDetailページと全く同じ表示でプレビューできます。
              内容を確認して、問題がなければMicrosoft
              Formsで正式に申請してください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                }}
              >
                📋 Microsoft Formsで申請する
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;

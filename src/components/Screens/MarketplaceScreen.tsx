import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Star,
  Heart,
  Plus,
  Minus,
  Trash2,
  Lock,
  ShieldCheck,
  AlertCircle,
  X,
  Check,
  Package,
  Globe,
  Coins,
  Store,
  Tag,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Eye,
  Layers,
} from 'lucide-react';
import { AthleteUser, CartItem, MarketplaceProduct, ThemeMode } from '../../types';
import {
  COUNTRIES_CURRENCIES,
  getCurrencyConfig,
  formatCurrencyPrice,
  convertToUsd,
} from '../../data/currencyData';

interface MarketplaceScreenProps {
  theme: ThemeMode;
  athlete: AthleteUser;
  products: MarketplaceProduct[];
  onAddProduct: (product: MarketplaceProduct) => void;
  cart: CartItem[];
  onAddToCart: (product: MarketplaceProduct) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  cartOpen: boolean;
  onToggleCart: (open: boolean) => void;
  onUpdateAthlete?: (data: Partial<AthleteUser>) => void;
}

// Curated stock photo presets for sellers to pick from instantly
const SELLER_IMAGE_PRESETS = [
  {
    id: 'preset-whey',
    label: 'Whey Protein Tub',
    url: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-creatine',
    label: 'Creatine Monohydrate',
    url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-belt',
    label: 'Lifting Lever Belt',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-straps',
    label: 'Heavy Wrist Wraps',
    url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-shaker',
    label: 'Athletic Shaker Bottle',
    url: 'https://images.unsplash.com/photo-1550989460-0adc9f549513?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-roller',
    label: 'Deep Tissue Foam Roller',
    url: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&auto=format&fit=crop&q=80',
  },
];

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({
  theme,
  athlete,
  products,
  onAddProduct,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  cartOpen,
  onToggleCart,
  onUpdateAthlete,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({ 'prod-1': true });
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Active currency defaults to athlete's nationality/preferredCurrency
  const userCountry = getCurrencyConfig(athlete.preferredCurrency || athlete.nationality || 'India');
  const [activeCurrencyCode, setActiveCurrencyCode] = useState<string>(userCountry.currencyCode);
  const activeCurrency = getCurrencyConfig(activeCurrencyCode);

  // 'Become a Seller' module expansion state
  const [isSellerModuleOpen, setIsSellerModuleOpen] = useState(false);

  // Seller Form State: Product Name, Price, Category, Image URL
  const [sellerProdName, setSellerProdName] = useState('');
  const [sellerProdBrand, setSellerProdBrand] = useState(athlete.name || 'FitSphere Athlete Seller');
  const [sellerProdCategory, setSellerProdCategory] = useState<MarketplaceProduct['category']>('Protein & Nutrition');
  const [sellerProdPrice, setSellerProdPrice] = useState('2499');
  const [sellerProdImageUrl, setSellerProdImageUrl] = useState(SELLER_IMAGE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [sellerProdSpecs, setSellerProdSpecs] = useState('');
  const [sellerProdBadge, setSellerProdBadge] = useState('Athlete Seller');
  const [sellerFormError, setSellerFormError] = useState<string | null>(null);

  const isLight = theme === 'daylight';

  const categories = [
    'All',
    'Saved Wishlist',
    'Seller Listed',
    'Protein & Nutrition',
    'Gym Equipment',
    'Recovery',
    'Snacks',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Saved Wishlist'
        ? !!wishlist[p.id]
        : selectedCategory === 'Seller Listed'
        ? !!p.isSellerProduct
        : p.category === selectedCategory;
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specs.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (product: MarketplaceProduct) => {
    onAddToCart(product);
    setAddedNotice(`Added "${product.name.split('(')[0]}" to cart`);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  // Submit and append to global marketplace product list
  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerProdName.trim()) {
      setSellerFormError('Please enter a product name');
      return;
    }
    const numPrice = parseFloat(sellerProdPrice);
    if (isNaN(numPrice) || numPrice <= 0) {
      setSellerFormError('Please enter a valid price');
      return;
    }

    const finalImage = customImageUrl.trim() || sellerProdImageUrl;
    if (!finalImage) {
      setSellerFormError('Please provide an image URL or choose a preset photo');
      return;
    }

    // Convert local price entered into base USD for global persistence across all currencies
    const calculatedPriceUsd = convertToUsd(numPrice, activeCurrencyCode);

    const newProduct: MarketplaceProduct = {
      id: `prod-seller-${Date.now()}`,
      name: sellerProdName.trim(),
      brand: sellerProdBrand.trim() || athlete.name || 'FitSphere Athlete',
      category: sellerProdCategory,
      priceUsd: calculatedPriceUsd,
      rating: 5.0,
      reviewsCount: 1,
      image: finalImage,
      badge: sellerProdBadge || 'Athlete Seller',
      inStock: true,
      specs: sellerProdSpecs.trim() || 'High-performance athletic item listed via FitSphere Become a Seller Module.',
      sellerName: athlete.name,
      isSellerProduct: true,
      createdAt: new Date().toISOString(),
    };

    // Append to global marketplace product list
    onAddProduct(newProduct);

    // Reset Form
    setSellerProdName('');
    setSellerProdSpecs('');
    setCustomImageUrl('');
    setSellerFormError(null);
    setIsSellerModuleOpen(false);
    setSelectedCategory('All');

    // Notify Athlete
    setAddedNotice(`🎉 "${newProduct.name}" appended to the global marketplace!`);
    setTimeout(() => setAddedNotice(null), 3500);
  };

  // Calculate live preview active price
  const previewNumericPrice = parseFloat(sellerProdPrice) || 0;
  const previewCalculatedUsd = convertToUsd(previewNumericPrice, activeCurrencyCode);
  const activePreviewImage = customImageUrl.trim() || sellerProdImageUrl;

  // Cart totals in selected currency
  const subtotalUsd = cart.reduce((sum, item) => sum + item.product.priceUsd * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full max-w-6xl mx-auto pb-24 md:pb-8 pt-2 px-3 sm:px-6 space-y-4">
      {/* Top Bar: Search, Currency Selector, Become a Seller Trigger & Cart */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search supplements, lever belts, recovery gear..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-body transition-all outline-hidden ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500'
                : 'bg-[#131b2e] border-slate-800 text-slate-100 focus:border-emerald-400'
            }`}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 overflow-x-auto shrink-0">
          {/* Quick Currency Selector Dropdown */}
          <div className="relative flex items-center">
            <select
              value={activeCurrencyCode}
              onChange={(e) => {
                setActiveCurrencyCode(e.target.value);
                if (onUpdateAthlete) {
                  onUpdateAthlete({ preferredCurrency: e.target.value });
                }
              }}
              title="Change Currency (Prices auto-convert)"
              className={`pl-2.5 pr-7 py-2.5 rounded-xl border text-xs font-telemetry font-bold transition-all outline-hidden appearance-none cursor-pointer ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  : 'bg-[#131b2e] border-slate-800 text-slate-100 hover:border-slate-700'
              }`}
            >
              {COUNTRIES_CURRENCIES.map((c) => (
                <option key={c.currencyCode} value={c.currencyCode} className="bg-slate-900 text-slate-100">
                  {c.flag} {c.currencyCode} ({c.currencySymbol})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Become a Seller Trigger Button */}
          <button
            onClick={() => setIsSellerModuleOpen(!isSellerModuleOpen)}
            className={`px-3.5 py-2.5 rounded-xl border font-telemetry font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              isSellerModuleOpen
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/80 text-emerald-400 hover:text-emerald-300 shadow-sm'
            }`}
            title="Open Become a Seller Module"
          >
            <Store className="w-4 h-4" />
            <span>{isSellerModuleOpen ? 'Close Module' : 'Become a Seller'}</span>
            {isSellerModuleOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                +List
              </span>
            )}
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={() => onToggleCart(true)}
            className="relative px-3.5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-telemetry font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="w-4 h-4 rounded-full bg-slate-950 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 1. BECOME A SELLER MODULE (Interactive In-Page Form + Real-Time Card Preview) */}
      <div
        className={`rounded-3xl border transition-all overflow-hidden ${
          isSellerModuleOpen
            ? isLight
              ? 'bg-white border-emerald-500/40 shadow-xl'
              : 'bg-gradient-to-br from-[#121c33] to-[#0c1426] border-emerald-500/40 shadow-2xl ring-1 ring-emerald-500/20'
            : isLight
            ? 'bg-gradient-to-r from-emerald-50 to-slate-50 border-emerald-200/80 hover:border-emerald-400'
            : 'bg-gradient-to-r from-emerald-950/30 via-slate-900 to-[#121c33] border-slate-800 hover:border-emerald-500/40'
        }`}
      >
        {/* Module Header / Expand Bar */}
        <div
          onClick={() => setIsSellerModuleOpen(!isSellerModuleOpen)}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-base tracking-tight">
                  Become a Seller on FitSphere AI
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-telemetry font-bold border border-emerald-500/30">
                  Global Marketplace
                </span>
              </div>
              <p className="text-xs text-slate-400 font-body mt-0.5 max-w-xl">
                List your athletic gear, custom nutritional blends, and workout equipment. Automatically converts to your customers&apos; national currencies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-block text-xs font-telemetry font-bold text-emerald-400 group-hover:underline">
              {isSellerModuleOpen ? 'Collapse Module' : 'Input Product Details & List →'}
            </span>
            <button
              type="button"
              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors"
            >
              {isSellerModuleOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Form & Live Preview Section */}
        {isSellerModuleOpen && (
          <div className="border-t border-slate-800/40 p-4 sm:p-6 bg-slate-950/30">
            <form onSubmit={handlePublishProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Input Fields (Left 7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-telemetry font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Product Listing Details
                  </span>
                  <span className="text-[11px] text-slate-400 font-telemetry">
                    Listing as: <strong className="text-white">{athlete.name}</strong>
                  </span>
                </div>

                {sellerFormError && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-telemetry flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{sellerFormError}</span>
                  </div>
                )}

                {/* 1. PRODUCT NAME */}
                <div>
                  <label className="block text-xs font-telemetry uppercase tracking-wider text-slate-400 mb-1">
                    1. Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerProdName}
                    onChange={(e) => setSellerProdName(e.target.value)}
                    placeholder="e.g. Kinetic Ultra Whey Isolate 2kg"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-body outline-hidden transition-all ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'bg-[#0f172a] border-slate-700 text-slate-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                    }`}
                  />
                </div>

                {/* 2. PRICE & NATIONAL CURRENCY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-telemetry uppercase tracking-wider text-slate-400">
                        2. Price in {activeCurrency.flag} {activeCurrency.currencyCode} *
                      </label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">
                        {activeCurrency.currencySymbol}
                      </span>
                      <input
                        type="number"
                        step="any"
                        required
                        min="1"
                        value={sellerProdPrice}
                        onChange={(e) => setSellerProdPrice(e.target.value)}
                        placeholder="e.g. 2499"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-display font-bold outline-hidden transition-all ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                            : 'bg-[#0f172a] border-slate-700 text-slate-100 focus:border-emerald-400'
                        }`}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-telemetry mt-1">
                      Base USD: ≈ ${previewCalculatedUsd.toFixed(2)} USD
                    </p>
                  </div>

                  {/* 3. CATEGORY */}
                  <div>
                    <label className="block text-xs font-telemetry uppercase tracking-wider text-slate-400 mb-1">
                      3. Category *
                    </label>
                    <div className="relative">
                      <select
                        value={sellerProdCategory}
                        onChange={(e) =>
                          setSellerProdCategory(e.target.value as MarketplaceProduct['category'])
                        }
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-body outline-hidden appearance-none cursor-pointer ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                            : 'bg-[#0f172a] border-slate-700 text-slate-100 focus:border-emerald-400'
                        }`}
                      >
                        <option value="Protein & Nutrition">Protein &amp; Nutrition</option>
                        <option value="Gym Equipment">Gym Equipment</option>
                        <option value="Recovery">Recovery &amp; Mobility</option>
                        <option value="Snacks">Snacks &amp; Athletic Fuel</option>
                        <option value="Apparel & Footwear">Apparel &amp; Footwear</option>
                        <option value="Accessories">Accessories &amp; Wraps</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 4. IMAGE URL & PRESET SELECTOR */}
                <div>
                  <label className="block text-xs font-telemetry uppercase tracking-wider text-slate-400 mb-1">
                    4. Product Image URL *
                  </label>
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="Enter custom image link (https://...) or choose preset below"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-body outline-hidden mb-2 ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                        : 'bg-[#0f172a] border-slate-700 text-slate-100 focus:border-emerald-400'
                    }`}
                  />

                  {/* Quick Photo Presets */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-telemetry block">
                      Or pick from verified athletic stock presets:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {SELLER_IMAGE_PRESETS.map((preset) => {
                        const isPresetSelected = !customImageUrl && sellerProdImageUrl === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setSellerProdImageUrl(preset.url);
                              setCustomImageUrl('');
                            }}
                            className={`relative p-1 rounded-xl border transition-all flex flex-col items-center group cursor-pointer ${
                              isPresetSelected
                                ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-500/15'
                                : 'border-slate-800 hover:border-slate-600 bg-slate-900/60'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-800"
                            />
                            <span className="text-[9px] text-slate-400 font-telemetry truncate w-full text-center mt-1">
                              {preset.label.split(' ')[0]}
                            </span>
                            {isPresetSelected && (
                              <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xs">
                                <Check className="w-2 h-2 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Specifications & Badge Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-telemetry uppercase tracking-wider text-slate-400 mb-1">
                      Brand / Manufacturer
                    </label>
                    <input
                      type="text"
                      value={sellerProdBrand}
                      onChange={(e) => setSellerProdBrand(e.target.value)}
                      placeholder="e.g. Apex Lab or Your Name"
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-body outline-hidden ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                          : 'bg-[#0f172a] border-slate-700 text-slate-100 focus:border-emerald-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-telemetry uppercase tracking-wider text-slate-400 mb-1">
                      Product Badge
                    </label>
                    <select
                      value={sellerProdBadge}
                      onChange={(e) => setSellerProdBadge(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border text-xs font-telemetry outline-hidden ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                          : 'bg-[#0f172a] border-slate-700 text-slate-100 focus:border-emerald-400'
                      }`}
                    >
                      <option value="Athlete Seller">Athlete Seller</option>
                      <option value="Pro Endorsed">Pro Endorsed</option>
                      <option value="New Release">New Release</option>
                      <option value="Handmade Gear">Handmade Gear</option>
                      <option value="Pure Formula">Pure Formula</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-telemetry uppercase tracking-wider text-slate-400 mb-1">
                    Specifications &amp; Benefits (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={sellerProdSpecs}
                    onChange={(e) => setSellerProdSpecs(e.target.value)}
                    placeholder="e.g. 28g Hydrolyzed Isolate per scoop, 0 sugar, Third-party tested, fast gastric emptying."
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-body outline-hidden resize-none ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                        : 'bg-[#0f172a] border-slate-700 text-slate-100 focus:border-emerald-400'
                    }`}
                  />
                </div>

                {/* Publish Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-telemetry font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-102 cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                    <span>Publish &amp; Append to Global Marketplace</span>
                  </button>
                </div>
              </div>

              {/* Real-Time Live Card Preview (Right 5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-start space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-telemetry font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    Live Listing Card Preview
                  </span>
                  <span className="text-[10px] font-telemetry text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                    Auto-Updates
                  </span>
                </div>

                {/* Preview of actual card */}
                <div
                  className={`p-4 rounded-2xl border shadow-lg transition-all flex flex-col gap-3 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-[#131b2e] border-slate-800'
                  }`}
                >
                  {/* Image Preview */}
                  <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                    {activePreviewImage ? (
                      <img
                        src={activePreviewImage}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback on broken custom url
                          (e.target as HTMLImageElement).src = SELLER_IMAGE_PRESETS[0].url;
                        }}
                      />
                    ) : (
                      <div className="text-slate-500 text-xs font-telemetry flex flex-col items-center">
                        <Package className="w-8 h-8 mb-1" />
                        <span>No image selected</span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-telemetry font-bold bg-slate-950/80 text-emerald-400 border border-emerald-500/40">
                      {sellerProdBadge || 'Athlete Seller'}
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-telemetry font-bold bg-emerald-500 text-slate-950">
                      In Stock
                    </span>
                  </div>

                  {/* Brand & Name */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-telemetry uppercase tracking-wider block">
                      {sellerProdBrand || 'FitSphere Athlete'} • {sellerProdCategory}
                    </span>
                    <h4 className="font-display font-bold text-base mt-0.5 line-clamp-1">
                      {sellerProdName || 'Your Product Title'}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-body line-clamp-2 mt-1">
                      {sellerProdSpecs || 'Custom athlete product specifications will appear here.'}
                    </p>
                  </div>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">
                    <div>
                      <span className="font-display font-black text-lg text-emerald-400 block leading-tight">
                        {formatCurrencyPrice(previewCalculatedUsd, activeCurrencyCode)}
                      </span>
                      <span className="text-[9px] text-slate-400 font-telemetry">
                        ≈ ${previewCalculatedUsd.toFixed(2)} USD global
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-telemetry font-bold">
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Add to Cart</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-telemetry flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Once published, your item is immediately appended to the global catalog and stored in your device&apos;s local encrypted state.
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* REGIONAL CURRENCY & NATIONALITY SYNC BANNER */}
      <div
        className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
          isLight
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="text-xs font-telemetry">
            <span className="font-bold">
              Showing Prices in {activeCurrency.flag} {activeCurrency.currencyName} (
              {activeCurrency.currencyCode} - {activeCurrency.currencySymbol}):
            </span>{' '}
            <span className={isLight ? 'text-emerald-900' : 'text-slate-300'}>
              Synchronized with your profile nationality ({athlete.nationality || 'India'}).
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-telemetry shrink-0">
          <span className="text-slate-400">
            1 USD ≈ {activeCurrency.currencySymbol}{activeCurrency.rateFromUsd}
          </span>
          {activeCurrencyCode !== userCountry.currencyCode && (
            <button
              onClick={() => setActiveCurrencyCode(userCountry.currencyCode)}
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to {userCountry.currencyCode}
            </button>
          )}
        </div>
      </div>

      {/* Added Toast Notice */}
      {addedNotice && (
        <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-telemetry font-bold flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{addedNotice}</span>
          </div>
          <button
            onClick={() => onToggleCart(true)}
            className="underline text-[11px] hover:text-black cursor-pointer font-bold"
          >
            View Cart →
          </button>
        </div>
      )}

      {/* CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const isSellerFilter = cat === 'Seller Listed';
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-telemetry font-bold border transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
                  : isLight
                  ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  : 'bg-[#131b2e] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isSellerFilter && <Store className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{cat}</span>
              {isSellerFilter && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-telemetry">
                  {products.filter((p) => p.isSellerProduct).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div
          className={`p-12 rounded-3xl border text-center ${
            isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#131b2e] border-slate-800 text-slate-400'
          }`}
        >
          <Package className="w-12 h-12 mx-auto text-slate-600 mb-2 stroke-[1.5]" />
          <h4 className="font-display font-bold text-base text-slate-200">No Products Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {selectedCategory === 'Seller Listed'
              ? 'No seller products listed yet. Use the "Become a Seller" module above to list your first item!'
              : 'Try clearing your search query or switching categories.'}
          </p>
          {selectedCategory === 'Seller Listed' && (
            <button
              onClick={() => setIsSellerModuleOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-telemetry font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Open Become a Seller Module</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className={`p-3.5 rounded-2xl border transition-all flex gap-3 ${
                isLight
                  ? 'bg-white border-slate-200 shadow-xs'
                  : 'bg-[#131b2e] border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Product Thumbnail with Wishlist overlay */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => toggleWishlist(prod.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/70 text-slate-300 hover:text-red-400 backdrop-blur-xs transition-colors"
                  title="Save to Wishlist"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      wishlist[prod.id] ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </button>
                {prod.isSellerProduct && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[8px] font-telemetry font-bold bg-slate-950/80 text-emerald-400 border border-emerald-500/40">
                    Seller Gear
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] text-slate-400 font-telemetry uppercase tracking-wider truncate">
                      {prod.brand}
                    </span>
                    {prod.badge && (
                      <span className="text-[9px] font-telemetry font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-sm leading-snug tracking-tight mt-0.5 truncate">
                    {prod.name}
                  </h3>

                  <p className="text-[11px] text-slate-400 font-body line-clamp-1 mt-0.5">
                    {prod.specs}
                  </p>
                </div>

                {/* Price, Star Rating & Add to Cart */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/20">
                  <div className="flex flex-col">
                    <span className="font-display font-black text-base text-emerald-400">
                      {formatCurrencyPrice(prod.priceUsd, activeCurrencyCode)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-amber-400 font-telemetry">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{prod.rating}</span>
                      <span className="text-slate-400 text-[9px]">({prod.reviewsCount})</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdd(prod)}
                    className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-telemetry font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PERSISTENT CART SLIDE-OVER / DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-md h-full flex flex-col border-l shadow-2xl p-4 sm:p-6 transition-all ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-[#111827] border-slate-800 text-slate-100'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/30">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-lg">
                  Athlete Cart ({totalItems})
                </h3>
              </div>
              <button
                onClick={() => onToggleCart(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Currency Notification in Cart */}
            <div className="py-2 px-3 my-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px] font-telemetry">
              <span className="flex items-center gap-1 text-emerald-400">
                <Coins className="w-3.5 h-3.5" />
                Pricing in {activeCurrency.flag} {activeCurrency.currencyCode} ({activeCurrency.currencySymbol})
              </span>
              <span className="text-slate-400">{athlete.nationality || 'India'}</span>
            </div>

            {/* Itemized List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <Package className="w-12 h-12 text-slate-600 mb-2 stroke-[1.5]" />
                  <div className="font-display font-bold text-sm text-slate-300">Your cart is empty</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Explore curated nutrition, wraps, and recovery gear to add items.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#171f33] border-slate-800'
                    }`}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-xs truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-telemetry font-bold">
                        {formatCurrencyPrice(item.product.priceUsd, activeCurrencyCode)} each
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-telemetry font-bold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onRemoveFromCart(item.product.id)}
                        className="ml-1 p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-800/40 space-y-3">
                <div className="flex items-center justify-between font-display text-sm">
                  <span className="text-slate-400 font-body">Subtotal:</span>
                  <span className="font-extrabold text-base text-emerald-400">
                    {formatCurrencyPrice(subtotalUsd, activeCurrencyCode)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-telemetry">
                  <span>Local VAT / Delivery:</span>
                  <span className="text-emerald-400 font-semibold">Included</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-2 text-xs">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 leading-tight">
                    FitSphere Prototype Mode. Orders are logged in your local sandbox vault.
                  </p>
                </div>

                <button
                  onClick={() => {
                    alert(`Order for ${formatCurrencyPrice(subtotalUsd, activeCurrencyCode)} simulated successfully in your local vault!`);
                    onToggleCart(false);
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Simulate Order ({formatCurrencyPrice(subtotalUsd, activeCurrencyCode)})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

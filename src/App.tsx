/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AthleteUser, CartItem, DisplayScale, MarketplaceProduct, ScreenType, ThemeMode, CompletedWorkoutSession } from './types';
import { initialAthlete, marketplaceProducts } from './data/mockData';
import { TopNavbar } from './components/Navigation/TopNavbar';
import { BottomTabBar } from './components/Navigation/BottomTabBar';
import { Sidebar } from './components/Navigation/Sidebar';
import { AvatarPickerModal } from './components/Common/AvatarPickerModal';
import { OnboardingScreen } from './components/Screens/OnboardingScreen';
import { DashboardScreen } from './components/Screens/DashboardScreen';
import { FitnessScreen } from './components/Screens/FitnessScreen';
import { SportsScreen } from './components/Screens/SportsScreen';
import { MarketplaceScreen } from './components/Screens/MarketplaceScreen';
import { SettingsScreen } from './components/Screens/SettingsScreen';
import { CoachScreen } from './components/Screens/CoachScreen';
import { VideoTourModal } from './components/Modals/VideoTourModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [theme, setTheme] = useState<ThemeMode>('obsidian');
  const [scale, setScale] = useState<DisplayScale>('standard');
  const [athlete, setAthlete] = useState<AthleteUser>(initialAthlete);
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState<boolean>(false);
  const [isVideoTourOpen, setIsVideoTourOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<MarketplaceProduct[]>(marketplaceProducts);
  const [cart, setCart] = useState<CartItem[]>([
    { product: marketplaceProducts[0], quantity: 1 },
    { product: marketplaceProducts[1], quantity: 1 },
  ]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddProduct = (newProduct: MarketplaceProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`"${newProduct.name}" listed on FitSphere AI Store!`);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'obsidian' ? 'daylight' : 'obsidian'));
  };

  // Cart operations
  const handleAddToCart = (product: MarketplaceProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Auth / Gateways
  const handleLoginSuccess = (athleteData?: Partial<AthleteUser>) => {
    if (athleteData) {
      setAthlete((prev) => ({ ...prev, ...athleteData }));
    }
    showToast('Session verified. Local vault decrypted.');
    setCurrentScreen('dashboard');
  };

  const handleContinueAsGuest = () => {
    setAthlete((prev) => ({
      ...prev,
      name: 'Guest Athlete',
      tier: 'Amateur',
      athleteHandle: '@guest_local',
    }));
    showToast('Connected as Guest in Local Sandbox');
    setCurrentScreen('dashboard');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.athlete) {
          setAthlete(json.athlete);
        }
        if (json.cart) {
          setCart(json.cart);
        }
        if (json.products) {
          setProducts(json.products);
        }
        showToast('Vault backup restored successfully!');
        setCurrentScreen('dashboard');
      } catch (err) {
        showToast('Invalid backup file format');
      }
    };
    reader.readAsText(file);
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '2.6.0',
      exportedAt: new Date().toISOString(),
      athlete,
      cart,
      products,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitsphere-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Encrypted JSON backup downloaded.');
  };

  const handleResetData = () => {
    setAthlete(initialAthlete);
    setCart([
      { product: marketplaceProducts[0], quantity: 1 },
      { product: marketplaceProducts[1], quantity: 1 },
    ]);
    showToast('Local vault reset to default state');
  };

  const handleLogActivity = (minutes: number, calories: number) => {
    const newSession: CompletedWorkoutSession = {
      id: `th-log-${Date.now()}`,
      title: 'Real-Time Telemetry Workout',
      discipline: 'Active Protocol',
      dateCompleted: 'Just now',
      durationMin: minutes,
      caloriesBurned: calories,
      totalReps: Math.round(minutes * 0.8),
      volumeKg: minutes * 50,
      avgHeartRate: 152,
      prBadge: '+Log Completed',
      formAccuracy: '98% Elite',
      intensity: 'High',
    };

    setAthlete((prev) => ({
      ...prev,
      activeMinutesToday: prev.activeMinutesToday + minutes,
      caloriesBurnedToday: prev.caloriesBurnedToday + calories,
      repsCountToday: prev.repsCountToday + Math.round(minutes * 0.8),
      trainingHistory: [newSession, ...(prev.trainingHistory || [])].slice(0, 10),
    }));
    showToast(`+${minutes} Active Minutes Logged! Training History Updated.`);
  };

  const handleUpdateAthlete = (updates: Partial<AthleteUser>) => {
    setAthlete((prev) => ({ ...prev, ...updates }));
  };

  const handleSaveAvatar = (newAvatarUrl: string) => {
    handleUpdateAthlete({ avatar: newAvatarUrl });
    showToast('Profile picture updated successfully!');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Background and text theme classes
  const isLight = theme === 'daylight';
  const isOutdoor = theme === 'outdoor';

  const themeClasses = isOutdoor
    ? 'bg-amber-950 text-yellow-100'
    : isLight
    ? 'bg-[#faf8ff] text-[#0f172a]'
    : 'bg-[#0b1326] text-[#dae2fd]';

  // Gym-Tuned Scaling classes
  const scaleClass =
    scale === 'xlarge'
      ? 'scale-105 origin-top text-[17px]'
      : scale === 'large'
      ? 'scale-102 origin-top text-[16px]'
      : 'text-[15px]';

  return (
    <div className={`min-h-screen ${themeClasses} transition-colors duration-200 flex w-full overflow-hidden`}>
      {/* 1. Permanent Desktop Sidebar & Mobile Off-Canvas Drawer */}
      <Sidebar
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
        athlete={athlete}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isDeviceFrame={isDeviceFrame}
        onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
        cartCount={totalCartCount}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenAvatarPicker={() => setIsAvatarPickerOpen(true)}
        onQuickLog={() => handleLogActivity(45, 380)}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Navbar */}
        <TopNavbar
          currentScreen={currentScreen}
          onSelectScreen={setCurrentScreen}
          athlete={athlete}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isDeviceFrame={isDeviceFrame}
          onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
          cartCount={totalCartCount}
          onOpenCart={() => {
            setCurrentScreen('marketplace');
            setCartOpen(true);
          }}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAvatarPicker={() => setIsAvatarPickerOpen(true)}
          onOpenVideoTour={() => setIsVideoTourOpen(true)}
        />

        {/* Content Area: Device Hardware Frame vs Responsive Full-Width */}
        <div className={`w-full flex-1 flex flex-col items-center justify-start ${isDeviceFrame ? 'py-6 px-2' : ''}`}>
          {isDeviceFrame ? (
            /* Sleek iPhone 16 Pro Style Hardware Frame */
            <div className="relative w-full max-w-[420px] rounded-[52px] border-[10px] border-slate-900 bg-black shadow-2xl overflow-hidden ring-1 ring-slate-800">
              {/* Dynamic Island Notch */}
              <div className="absolute top-2 inset-x-0 z-50 flex justify-center pointer-events-none">
                <div className="h-6 w-28 bg-black rounded-full flex items-center justify-between px-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-telemetry font-bold">FitSphere</span>
                  <span className="w-2 h-2 rounded-full bg-slate-800" />
                </div>
              </div>

              {/* Inner Mobile Screen Container */}
              <div
                className={`w-full h-[760px] overflow-y-auto pt-8 pb-16 relative scrollbar-none ${themeClasses} ${scaleClass}`}
              >
                {renderActiveScreen()}
              </div>

              {/* In-Frame Bottom Navigation Bar */}
              <BottomTabBar
                currentScreen={currentScreen}
                onSelectScreen={setCurrentScreen}
                theme={theme}
                cartCount={totalCartCount}
              />
            </div>
          ) : (
            /* Responsive Desktop & Mobile Adaptive Container */
            <main className={`w-full max-w-7xl mx-auto flex-1 relative px-2 sm:px-4 lg:px-8 ${scaleClass}`}>
              {renderActiveScreen()}
              {/* Persistent Mobile Bottom Tab Bar (Hidden on desktop md+) */}
              <BottomTabBar
                currentScreen={currentScreen}
                onSelectScreen={setCurrentScreen}
                theme={theme}
                cartCount={totalCartCount}
              />
            </main>
          )}
        </div>
      </div>

      {/* Global Interactive Avatar & Profile Picture Picker Modal */}
      <AvatarPickerModal
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        currentAvatar={athlete.avatar}
        athleteName={athlete.name}
        athleteTier={athlete.tier}
        theme={theme}
        onSaveAvatar={handleSaveAvatar}
      />

      {/* Interactive Project Video Tour & Screenplay Studio Modal */}
      <VideoTourModal
        isOpen={isVideoTourOpen}
        onClose={() => setIsVideoTourOpen(false)}
        onNavigateToScreen={(screen) => setCurrentScreen(screen)}
        theme={theme}
      />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 max-w-md p-3.5 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-telemetry font-bold flex items-center justify-between shadow-2xl shadow-emerald-500/40 animate-bounce">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-950 font-bold ml-3 hover:opacity-75">
            ✕
          </button>
        </div>
      )}
    </div>
  );

  function renderActiveScreen() {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <OnboardingScreen
            athlete={athlete}
            theme={theme}
            onLoginSuccess={handleLoginSuccess}
            onContinueAsGuest={handleContinueAsGuest}
            onImportBackup={handleImportBackup}
          />
        );

      case 'dashboard':
        return (
          <DashboardScreen
            athlete={athlete}
            theme={theme}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onLogActivity={handleLogActivity}
            onOpenAvatarPicker={() => setIsAvatarPickerOpen(true)}
          />
        );

      case 'fitness':
        return (
          <FitnessScreen
            athlete={athlete}
            theme={theme}
          />
        );

      case 'sports':
        return <SportsScreen theme={theme} />;

      case 'coach':
        return <CoachScreen athlete={athlete} theme={theme} />;

      case 'marketplace':
        return (
          <MarketplaceScreen
            theme={theme}
            athlete={athlete}
            products={products}
            onAddProduct={handleAddProduct}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            cartOpen={cartOpen}
            onToggleCart={setCartOpen}
            onUpdateAthlete={handleUpdateAthlete}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            athlete={athlete}
            theme={theme}
            onChangeTheme={setTheme}
            scale={scale}
            onChangeScale={setScale}
            onExportBackup={handleExportBackup}
            onResetData={handleResetData}
            onUpdateAthlete={handleUpdateAthlete}
            onOpenAvatarPicker={() => setIsAvatarPickerOpen(true)}
          />
        );

      default:
        return (
          <DashboardScreen
            athlete={athlete}
            theme={theme}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenAvatarPicker={() => setIsAvatarPickerOpen(true)}
          />
        );
    }
  }
}

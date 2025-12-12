import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useStravaData } from '../hooks/useStravaData';
import { ProgressIndicator } from './ui/ProgressIndicator';
import { YearPicker } from './ui/YearPicker';
import { IntroSlide } from './slides/IntroSlide';
import { TotalDistanceSlide } from './slides/TotalDistanceSlide';
import { TotalTimeSlide } from './slides/TotalTimeSlide';
import { ActivityCountSlide } from './slides/ActivityCountSlide';
import { ElevationSlide } from './slides/ElevationSlide';
import { LongestActivitySlide } from './slides/LongestActivitySlide';
import { MonthlyDistributionSlide } from './slides/MonthlyDistributionSlide';
import { ActivityTypesSlide } from './slides/ActivityTypesSlide';
import { KudosSlide } from './slides/KudosSlide';
import { SummarySlide } from './slides/SummarySlide';
import { LocationsSlide } from './slides/LocationsSlide';
import { Loader2, ChevronLeft, LogOut } from 'lucide-react';

export function StoryContainer() {
  const { athlete, logout } = useAuth();
  const { stats, isLoading, error, selectedYear, setSelectedYear, availableYears } = useStravaData();
  const [currentSlide, setCurrentSlide] = useState(0);

  const athleteName = athlete ? `${athlete.firstname}` : 'Athlete';
  const profilePicture = athlete?.profile;

  // Build slides array based on available data
  const slides = stats ? [
    <IntroSlide key="intro" year={selectedYear} athleteName={athleteName} profilePicture={profilePicture} />,
    stats.totalDistance > 0 && <TotalDistanceSlide key="distance" distance={stats.totalDistance} />,
    stats.totalTime > 0 && <TotalTimeSlide key="time" hours={stats.totalTime} />,
    stats.totalActivities > 0 && <ActivityCountSlide key="count" count={stats.totalActivities} year={selectedYear} />,
    stats.totalElevation > 0 && <ElevationSlide key="elevation" elevation={stats.totalElevation} />,
    stats.longestActivity && <LongestActivitySlide key="longest" activity={stats.longestActivity} />,
    Object.keys(stats.monthlyDistribution).length > 0 && <MonthlyDistributionSlide key="monthly" distribution={stats.monthlyDistribution} />,
    Object.keys(stats.activityTypes).length > 0 && <ActivityTypesSlide key="types" activityTypes={stats.activityTypes} />,
    stats.topRoutes.length > 0 && <LocationsSlide key="locations" routes={stats.topRoutes} />,
    stats.totalKudos > 0 && <KudosSlide key="kudos" totalKudos={stats.totalKudos} totalActivities={stats.totalActivities} />,
    <SummarySlide key="summary" stats={stats} year={selectedYear} athleteName={athleteName} profilePicture={profilePicture} />,
  ].filter(Boolean) : [];

  const totalSlides = slides.length;

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Reset slide when year changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedYear]);

  // Handle click navigation
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 3) {
      goToPrev();
    } else {
      goToNext();
    }
  };

  if (isLoading) {
    return (
      <div className="slide-container bg-zinc-900">
        <div className="w-full max-w-[430px] mx-auto min-h-dvh flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
          <p className="text-white/60">Loading your {selectedYear} activities...</p>
          <p className="text-white/40 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="slide-container bg-zinc-900">
        <div className="w-full max-w-[430px] mx-auto min-h-dvh flex flex-col items-center justify-center p-8">
          <p className="text-red-400 text-xl mb-4">😕 Oops!</p>
          <p className="text-white/60 text-center mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalActivities === 0) {
    return (
      <div className="slide-container bg-zinc-900">
        <div className="w-full max-w-[430px] mx-auto min-h-dvh flex flex-col items-center justify-center p-8">
          <p className="text-6xl mb-4">🏃‍♂️</p>
          <p className="text-white text-xl mb-2">No activities found</p>
          <p className="text-white/60 text-center mb-6">
            Looks like you don't have any activities recorded in {selectedYear}.
          </p>
          <YearPicker
            selectedYear={selectedYear}
            availableYears={availableYears}
            onYearChange={setSelectedYear}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh">
      {/* Slides - render first so it provides the background */}
      <div onClick={handleClick} className="cursor-pointer">
        <AnimatePresence mode="wait">
          {slides[currentSlide]}
        </AnimatePresence>
      </div>

      {/* Top bar - positioned over slides */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between max-w-[430px] mx-auto">
        {currentSlide > 0 ? (
          <button
            onClick={goToPrev}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        ) : (
          <button
            onClick={logout}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        )}

        <YearPicker
          selectedYear={selectedYear}
          availableYears={availableYears}
          onYearChange={setSelectedYear}
        />

        <div className="w-9" /> {/* Spacer for alignment */}
      </div>

      {/* Progress indicator */}
      <div className="absolute top-16 left-0 right-0 z-50 max-w-[430px] mx-auto">
        <ProgressIndicator total={totalSlides} current={currentSlide} />
      </div>

      {/* Navigation hint */}
      <div className="absolute bottom-8 left-0 right-0 z-50 text-center max-w-[430px] mx-auto">
        <p className="text-white/30 text-xs">
          Tap left/right to navigate • {currentSlide + 1}/{totalSlides}
        </p>
      </div>
    </div>
  );
}


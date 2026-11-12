import React, { useEffect, useRef, useState } from 'react';
import { CampusScene3D, CameraViewMode } from './game/CampusScene3D';
import { CAMPUS_LOCATIONS, INITIAL_QUESTS } from './data/campusData';
import { soundManager } from './audio/soundSynthesizer';
import { TitleScreen } from './components/TitleScreen';
import { GameHUD } from './components/GameHUD';
import { BottomDock } from './components/BottomDock';
import { InteractiveMapModal } from './components/InteractiveMapModal';
import { LocationDetailModal } from './components/LocationDetailModal';
import { ClubsModal } from './components/ClubsModal';
import { AdmissionsModal } from './components/AdmissionsModal';
import { MapsGroundingDrawer } from './components/MapsGroundingDrawer';
import { SportsMiniGame } from './components/SportsMiniGame';
import { PhotoGalleryModal } from './components/PhotoGalleryModal';
import { QuestModal } from './components/QuestModal';
import { PauseModal } from './components/PauseModal';
import { CampusDesignerModal } from './components/CampusDesignerModal';
import { DailyTasksModal } from './components/DailyTasksModal';
import { SchoolArcadeModal } from './components/SchoolArcadeModal';
import { FootballPenaltyMiniGame } from './components/FootballPenaltyMiniGame';
import { CampusTriviaMiniGame } from './components/CampusTriviaMiniGame';
import {
  loadDailyTasksState,
  completeDailyTask,
  rerollDailyTasks,
  claimDailyBonusReward,
} from './data/dailyTasksPool';
import { CampusLocation, CampusPhoto, Quest, DailyTasksState, MiniGameType } from './types/campus';

type GameState = 'title' | 'playing' | 'paused';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CampusScene3D | null>(null);

  // Dynamic Campus Layout & Locations State
  const [locations, setLocations] = useState<CampusLocation[]>(CAMPUS_LOCATIONS);

  // Daily School Tasks System State
  const [dailyTasksState, setDailyTasksState] = useState<DailyTasksState>(() => loadDailyTasksState());

  // Game Lifecycle State
  const [gameState, setGameState] = useState<GameState>('title');
  const [isMuted, setIsMuted] = useState(false);
  const [score, setScore] = useState(0);

  // Active Modals
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [isClubsOpen, setIsClubsOpen] = useState(false);
  const [isAdmissionsOpen, setIsAdmissionsOpen] = useState(false);
  const [isGroundingOpen, setIsGroundingOpen] = useState(false);
  const [isSportsOpen, setIsSportsOpen] = useState(false);
  const [isFootballOpen, setIsFootballOpen] = useState(false);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [isDailyTasksOpen, setIsDailyTasksOpen] = useState(false);
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);

  // Apply layout modifications to 3D scene and state
  const handleApplyLayout = (newLocations: CampusLocation[]) => {
    setLocations(newLocations);
    if (sceneRef.current) {
      sceneRef.current.updateLocationPositions(newLocations);
    }
  };

  // Camera & Time Preset State
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('third_person');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'golden' | 'sunset'>('day');

  // Quests & Visited Locations
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [visitedLocationIds, setVisitedLocationIds] = useState<string[]>([]);
  const [nearbyLocation, setNearbyLocation] = useState<CampusLocation | null>(null);

  // Photos
  const [photos, setPhotos] = useState<CampusPhoto[]>([]);

  // Flash effect state
  const [flashActive, setFlashActive] = useState(false);

  // 1. Initialize Three.js scene once in mountRef
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new CampusScene3D(mountRef.current);
    sceneRef.current = scene;

    // Attach callbacks
    scene.onNearbyLocationChange = (locId) => {
      if (!locId) {
        setNearbyLocation(null);
      } else {
        const found = locations.find((l) => l.id === locId) || CAMPUS_LOCATIONS.find((l) => l.id === locId) || null;
        setNearbyLocation(found);
      }
    };

    scene.onScoreBasket = () => {
      setScore((s) => s + 50);
      completeQuest('q-sports');
      checkDailyTaskProgress('volleyball-court');
    };

    scene.onScoreGoal = () => {
      setScore((s) => s + 80);
      completeQuest('q-sports');
      checkDailyTaskProgress('football-field');
    };

    soundManager.startAmbient();

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, [locations, dailyTasksState]);

  // Daily Tasks Checker & Handlers
  const checkDailyTaskProgress = (locationId: string) => {
    const matchingTask = dailyTasksState.tasks.find(
      (t) => t.targetLocationId === locationId && !t.isCompleted
    );
    if (matchingTask) {
      const { state: updatedState, justFinishedAll } = completeDailyTask(matchingTask.id);
      setDailyTasksState(updatedState);
      setScore((s) => s + matchingTask.rewardPoints);
      soundManager.playTaskComplete();
      if (justFinishedAll) {
        soundManager.playGoalCheer();
      }
    }
  };

  const handleRerollDailyTasks = () => {
    const newState = rerollDailyTasks();
    setDailyTasksState(newState);
    soundManager.playDiscovery();
  };

  const handleClaimDailyBonus = () => {
    const newState = claimDailyBonusReward();
    setDailyTasksState(newState);
    setScore((s) => s + 300);
  };

  // 2. Keyboard Control Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sceneRef.current) return;

      // Handle modals and pause
      if (e.key === 'Escape') {
        if (selectedLocation) {
          setSelectedLocation(null);
          return;
        }
        if (isMapOpen) {
          setIsMapOpen(false);
          return;
        }
        if (isDailyTasksOpen) {
          setIsDailyTasksOpen(false);
          return;
        }
        if (isArcadeOpen) {
          setIsArcadeOpen(false);
          return;
        }
        if (isFootballOpen) {
          setIsFootballOpen(false);
          return;
        }
        if (isTriviaOpen) {
          setIsTriviaOpen(false);
          return;
        }
        if (isDesignerOpen) {
          setIsDesignerOpen(false);
          return;
        }
        if (isClubsOpen) {
          setIsClubsOpen(false);
          return;
        }
        if (isAdmissionsOpen) {
          setIsAdmissionsOpen(false);
          return;
        }
        if (isGroundingOpen) {
          setIsGroundingOpen(false);
          return;
        }
        if (isSportsOpen) {
          setIsSportsOpen(false);
          return;
        }
        if (isPhotosOpen) {
          setIsPhotosOpen(false);
          return;
        }
        if (isQuestsOpen) {
          setIsQuestsOpen(false);
          return;
        }

        if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
        return;
      }

      // If in Title or Modal, ignore character movement
      const isAnyModalOpen =
        selectedLocation ||
        isMapOpen ||
        isDailyTasksOpen ||
        isArcadeOpen ||
        isFootballOpen ||
        isTriviaOpen ||
        isDesignerOpen ||
        isClubsOpen ||
        isAdmissionsOpen ||
        isGroundingOpen ||
        isSportsOpen ||
        isPhotosOpen ||
        isQuestsOpen;

      if (gameState === 'title') {
        if (e.key === 'Enter' || e.code === 'Space') {
          soundManager.playSchoolBell();
          setGameState('playing');
          if (sceneRef.current) {
            sceneRef.current.cameraMode = 'third_person';
            sceneRef.current.cameraYaw = 0;
          }
        }
        return;
      }

      if (isAnyModalOpen) return;

      // Quick shortcuts
      if (e.key.toLowerCase() === 'm') {
        setIsMapOpen((prev) => !prev);
        return;
      }
      if (e.key.toLowerCase() === 't') {
        setIsDailyTasksOpen((prev) => !prev);
        return;
      }
      if (e.key.toLowerCase() === 'g') {
        setIsArcadeOpen((prev) => !prev);
        return;
      }
      if (e.key.toLowerCase() === 'b') {
        setIsDesignerOpen((prev) => !prev);
        return;
      }
      if (e.key.toLowerCase() === 'h') {
        setIsDockCollapsed((prev) => !prev);
        return;
      }
      if (e.key.toLowerCase() === 'c') {
        setCameraMode((prev) => (prev === 'third_person' ? 'drone' : 'third_person'));
        if (sceneRef.current) {
          sceneRef.current.cameraMode = sceneRef.current.cameraMode === 'third_person' ? 'drone' : 'third_person';
        }
        return;
      }
      if (e.key.toLowerCase() === 'e') {
        if (nearbyLocation) {
          handleOpenLocation(nearbyLocation);
        }
        return;
      }

      // Character Movement Controls
      const c = sceneRef.current.controls;
      if (e.code === 'KeyW' || e.key === 'ArrowUp') c.forward = true;
      if (e.code === 'KeyS' || e.key === 'ArrowDown') c.backward = true;
      if (e.code === 'KeyA' || e.key === 'ArrowLeft') c.left = true;
      if (e.code === 'KeyD' || e.key === 'ArrowRight') c.right = true;
      if (e.shiftKey) c.sprint = true;
      if (e.code === 'Space') {
        c.jump = true;
        // If near sports court, trigger ball shot or kick
        if (nearbyLocation && (nearbyLocation.id === 'volleyball-court' || nearbyLocation.id === 'gymnasium')) {
          sceneRef.current.shootBasketball();
        } else if (nearbyLocation && nearbyLocation.id === 'football-field') {
          sceneRef.current.kickSoccerBall();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!sceneRef.current) return;
      const c = sceneRef.current.controls;
      if (e.code === 'KeyW' || e.key === 'ArrowUp') c.forward = false;
      if (e.code === 'KeyS' || e.key === 'ArrowDown') c.backward = false;
      if (e.code === 'KeyA' || e.key === 'ArrowLeft') c.left = false;
      if (e.code === 'KeyD' || e.key === 'ArrowRight') c.right = false;
      if (!e.shiftKey) c.sprint = false;
      if (e.code === 'Space') c.jump = false;
    };

    const handleBlur = () => {
      if (sceneRef.current) {
        sceneRef.current.controls = {
          forward: false,
          backward: false,
          left: false,
          right: false,
          sprint: false,
          jump: false,
        };
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [
    gameState,
    nearbyLocation,
    selectedLocation,
    isMapOpen,
    isDailyTasksOpen,
    isArcadeOpen,
    isFootballOpen,
    isTriviaOpen,
    isDesignerOpen,
    isClubsOpen,
    isAdmissionsOpen,
    isGroundingOpen,
    isSportsOpen,
    isPhotosOpen,
    isQuestsOpen,
  ]);

  // Touch Move Trigger helper
  const handleTouchMove = (key: string, isDown: boolean) => {
    if (!sceneRef.current) return;
    const c = sceneRef.current.controls;
    if (key === 'forward') c.forward = isDown;
    if (key === 'backward') c.backward = isDown;
    if (key === 'left') c.left = isDown;
    if (key === 'right') c.right = isDown;
    if (key === 'jump') c.jump = isDown;
  };

  // Quest Completer
  const completeQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.completed) {
          soundManager.playQuestComplete();
          setScore((s) => s + q.rewardPoints);
          return { ...q, completed: true };
        }
        return q;
      })
    );
  };

  // Location Visitor & Teleporter
  const handleOpenLocation = (loc: CampusLocation) => {
    setSelectedLocation(loc);
    handleMarkVisited(loc.id);
  };

  const handleMarkVisited = (locId: string) => {
    // Check daily task progression on every area visit
    checkDailyTaskProgress(locId);

    if (!visitedLocationIds.includes(locId)) {
      setVisitedLocationIds((prev) => [...prev, locId]);
      soundManager.playDiscovery();
      setScore((s) => s + 50);

      // Check corresponding quests
      if (locId === 'gate') completeQuest('q-gate');
      if (locId === 'flagpole') completeQuest('q-flagpole');
      if (locId === 'library') completeQuest('q-library');
      if (locId === 'canteen') completeQuest('q-canteen');
    }
  };

  const handleTeleport = (locId: string) => {
    if (sceneRef.current) {
      sceneRef.current.teleportToLocation(locId);
      const loc = CAMPUS_LOCATIONS.find((l) => l.id === locId);
      if (loc) {
        handleMarkVisited(locId);
      }
    }
  };

  // Photo Mode Snapshot
  const handleCapturePhoto = () => {
    if (!sceneRef.current) return;
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    const dataUrl = sceneRef.current.captureSnapshot();
    const currLocationName = nearbyLocation ? nearbyLocation.vietnameseName : 'Sân Trường Hàn Thuyên';

    const newPhoto: CampusPhoto = {
      id: `${Date.now()}`,
      url: dataUrl,
      title: 'Kỷ Niệm Ngày Tham Quan Hàn Thuyên',
      locationName: currLocationName,
      timestamp: new Date().toLocaleDateString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    completeQuest('q-photo');
    setScore((s) => s + 50);
  };

  // Change Camera Mode
  const handleChangeCameraMode = (mode: CameraViewMode) => {
    setCameraMode(mode);
    if (sceneRef.current) {
      sceneRef.current.cameraMode = mode;
    }
  };

  // Change Time of Day
  const handleChangeTimeOfDay = (preset: 'day' | 'golden' | 'sunset') => {
    setTimeOfDay(preset);
    if (sceneRef.current) {
      sceneRef.current.setTimeOfDay(preset);
    }
  };

  // Mute Toggle
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const completedQuestsCount = quests.filter((q) => q.completed).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 1. Isolated WebGL 3D Canvas Mount (Never re-renders from React state) */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* Camera Shutter Flash Overlay */}
      {flashActive && (
        <div className="absolute inset-0 z-50 bg-white pointer-events-none animate-out fade-out duration-300" />
      )}

      {/* 2. Title Screen State */}
      {gameState === 'title' && (
        <TitleScreen
          onStartGame={() => {
            setGameState('playing');
            if (sceneRef.current) {
              sceneRef.current.cameraMode = 'third_person';
              sceneRef.current.cameraYaw = 0;
            }
          }}
          onOpenMap={() => setIsMapOpen(true)}
          onOpenClubs={() => setIsClubsOpen(true)}
          onOpenAdmissions={() => setIsAdmissionsOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 3. In-Game Low-Occlusion HUD Overlay */}
      {gameState === 'playing' && (
        <>
          <GameHUD
            nearbyLocation={nearbyLocation}
            onInteract={() => nearbyLocation && handleOpenLocation(nearbyLocation)}
            onOpenSportsGame={() => setIsSportsOpen(true)}
            onOpenFootballGame={() => setIsFootballOpen(true)}
            onOpenTriviaGame={() => setIsTriviaOpen(true)}
            onOpenArcade={() => setIsArcadeOpen(true)}
            onOpenDailyTasks={() => setIsDailyTasksOpen(true)}
            dailyTasksCompleted={dailyTasksState.tasks.filter((t) => t.isCompleted).length}
            dailyTasksTotal={dailyTasksState.tasks.length}
            score={score}
            completedQuests={completedQuestsCount}
            totalQuests={quests.length}
            onOpenQuests={() => setIsQuestsOpen(true)}
            onOpenPhotos={() => setIsPhotosOpen(true)}
            onPause={() => setGameState('paused')}
            isShootingAvailable={
              nearbyLocation?.id === 'volleyball-court' || nearbyLocation?.id === 'gymnasium'
            }
            isFootballAvailable={nearbyLocation?.id === 'football-field'}
            isTriviaAvailable={nearbyLocation?.id === 'library' || nearbyLocation?.id === 'block-c'}
            onTriggerShoot={() => sceneRef.current?.shootBasketball()}
            onTriggerTouchMove={handleTouchMove}
          />

          {/* Unified Collapsible Bottom Dock */}
          <BottomDock
            isCollapsed={isDockCollapsed}
            onToggleCollapse={() => setIsDockCollapsed((c) => !c)}
            cameraMode={cameraMode}
            onChangeCameraMode={handleChangeCameraMode}
            timeOfDay={timeOfDay}
            onChangeTimeOfDay={handleChangeTimeOfDay}
            onOpenMap={() => setIsMapOpen(true)}
            onOpenDesigner={() => setIsDesignerOpen(true)}
            onOpenDailyTasks={() => setIsDailyTasksOpen(true)}
            onOpenArcade={() => setIsArcadeOpen(true)}
            onOpenClubs={() => setIsClubsOpen(true)}
            onOpenAdmissions={() => setIsAdmissionsOpen(true)}
            onOpenGrounding={() => setIsGroundingOpen(true)}
            onOpenQuests={() => setIsQuestsOpen(true)}
            onTriggerPhoto={handleCapturePhoto}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        </>
      )}

      {/* 4. Pause Modal */}
      <PauseModal
        isOpen={gameState === 'paused'}
        onResume={() => setGameState('playing')}
        onResetPosition={() => {
          handleTeleport('gate');
          setGameState('playing');
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onReturnTitle={() => {
          setGameState('title');
          if (sceneRef.current) {
            sceneRef.current.cameraMode = 'drone';
          }
        }}
      />

      {/* 5. 2D Interactive Masterplan Map */}
      <InteractiveMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelectLocation={handleOpenLocation}
        onTeleport={handleTeleport}
        locations={locations}
      />

      {/* 6. Location Detail Modal (Rich descriptions, photos/videos, specs) */}
      <LocationDetailModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onTeleport={handleTeleport}
        isVisited={selectedLocation ? visitedLocationIds.includes(selectedLocation.id) : false}
        onMarkVisited={handleMarkVisited}
      />

      {/* 7. Extracurricular Clubs & Activities Modal */}
      <ClubsModal
        isOpen={isClubsOpen}
        onClose={() => setIsClubsOpen(false)}
        onTeleportToLocation={handleTeleport}
      />

      {/* 8. Grade 10 Admissions & Scholarships Guide Modal */}
      <AdmissionsModal isOpen={isAdmissionsOpen} onClose={() => setIsAdmissionsOpen(false)} />

      {/* 9. Google Maps Grounding Assistant with Gemini 3.8 Flash */}
      <MapsGroundingDrawer isOpen={isGroundingOpen} onClose={() => setIsGroundingOpen(false)} />

      {/* 10. Basketball Sports Mini-Game */}
      <SportsMiniGame
        isOpen={isSportsOpen}
        onClose={() => setIsSportsOpen(false)}
        onShootBall={() => sceneRef.current?.shootBasketball()}
        onAddScore={(pts) => setScore((s) => s + pts)}
      />

      {/* 11. Yearbook Photo Gallery Modal */}
      <PhotoGalleryModal
        isOpen={isPhotosOpen}
        onClose={() => setIsPhotosOpen(false)}
        photos={photos}
        onDeletePhoto={(id) => setPhotos((prev) => prev.filter((p) => p.id !== id))}
        onTriggerCamera={handleCapturePhoto}
      />

      {/* 12. Student Quest Hand-Book Modal */}
      <QuestModal
        isOpen={isQuestsOpen}
        onClose={() => setIsQuestsOpen(false)}
        quests={quests}
        onTeleportToLocation={handleTeleport}
        totalPoints={score}
      />

      {/* 13. Interactive Campus Blueprint & Layout Designer Modal */}
      {isDesignerOpen && (
        <CampusDesignerModal
          locations={locations}
          onApplyLayout={handleApplyLayout}
          onClose={() => setIsDesignerOpen(false)}
        />
      )}

      {/* 14. Daily School Tasks System Modal */}
      <DailyTasksModal
        isOpen={isDailyTasksOpen}
        onClose={() => setIsDailyTasksOpen(false)}
        taskState={dailyTasksState}
        onTeleportToLocation={handleTeleport}
        onRerollTasks={handleRerollDailyTasks}
        onClaimDailyBonus={handleClaimDailyBonus}
      />

      {/* 15. Unified School Game Arcade Hub */}
      <SchoolArcadeModal
        isOpen={isArcadeOpen}
        onClose={() => setIsArcadeOpen(false)}
        onLaunchGame={(game: MiniGameType) => {
          if (game === 'basketball') setIsSportsOpen(true);
          if (game === 'football') setIsFootballOpen(true);
          if (game === 'trivia') setIsTriviaOpen(true);
        }}
        onTeleportToArea={handleTeleport}
        totalScore={score}
      />

      {/* 16. Football Penalty Shootout Mini-Game */}
      <FootballPenaltyMiniGame
        isOpen={isFootballOpen}
        onClose={() => setIsFootballOpen(false)}
        onAddScore={(pts) => {
          setScore((s) => s + pts);
          checkDailyTaskProgress('football-field');
        }}
        onKickBallIn3D={() => sceneRef.current?.kickSoccerBall()}
      />

      {/* 17. Campus Trivia & Knowledge Challenge Mini-Game */}
      <CampusTriviaMiniGame
        isOpen={isTriviaOpen}
        onClose={() => setIsTriviaOpen(false)}
        onAddScore={(pts) => {
          setScore((s) => s + pts);
          checkDailyTaskProgress('library');
        }}
      />
    </div>
  );
}

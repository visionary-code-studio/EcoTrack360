'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import {
  ActivityEntry,
  FootprintSummary,
  summarizeActivities,
  MONTHLY_BUDGET,
} from '@/lib/carbon';

// ── Sample seed data ──────────────────────────────────────────────────────────
const SEED_ACTIVITIES: ActivityEntry[] = [
  { id: 'seed-1',  category: 'transport',   type: 'car_petrol',  quantity: 25,  co2e: 4.800, date: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'seed-2',  category: 'food',        type: 'beef',        quantity: 2,   co2e: 13.22, date: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'seed-3',  category: 'electricity', type: 'grid',        quantity: 8,   co2e: 1.864, date: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'seed-4',  category: 'transport',   type: 'bus',         quantity: 12,  co2e: 1.068, date: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'seed-5',  category: 'food',        type: 'chicken',     quantity: 1,   co2e: 1.720, date: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'seed-6',  category: 'waste',       type: 'landfill',    quantity: 3,   co2e: 1.710, date: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'seed-7',  category: 'shopping',    type: 'clothing',    quantity: 1,   co2e: 20.00, date: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'seed-8',  category: 'food',        type: 'vegetarian',  quantity: 3,   co2e: 2.160, date: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: 'seed-9',  category: 'transport',   type: 'train',       quantity: 40,  co2e: 1.640, date: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'seed-10', category: 'electricity', type: 'grid',        quantity: 12,  co2e: 2.796, date: new Date(Date.now() - 8 * 86400000).toISOString() },
];

// ── Context type ──────────────────────────────────────────────────────────────
interface AppContextType {
  user: User | null;
  userLoading: boolean;
  activities: ActivityEntry[];
  summary: FootprintSummary;
  goal: number;
  addActivity: (a: ActivityEntry) => Promise<void>;
  resetActivities: () => Promise<void>;
  setGoal: (g: number) => Promise<void>;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [goal, setGoalState] = useState<number>(MONTHLY_BUDGET);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync state from Firestore when user changes
  useEffect(() => {
    const localUserStr = typeof window !== 'undefined' ? localStorage.getItem('eco_demo_user') : null;
    let demoUser: any = null;
    if (localUserStr) {
      try {
        demoUser = JSON.parse(localUserStr);
      } catch {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      if (currentUser) {
        setUser(currentUser);
        setUserLoading(true);
        try {
          // 1. Fetch user's carbon goal setting
          const goalRef = doc(db, 'users', currentUser.uid, 'settings', 'goal');
          const goalSnap = await getDoc(goalRef);
          if (goalSnap.exists()) {
            setGoalState(goalSnap.data().value || MONTHLY_BUDGET);
          } else {
            setGoalState(MONTHLY_BUDGET);
          }

          // 2. Fetch user's activities
          const activitiesRef = collection(db, 'users', currentUser.uid, 'activities');
          const q = query(activitiesRef, orderBy('date', 'desc'));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const fetched: ActivityEntry[] = [];
            querySnapshot.forEach((doc: any) => {
              const data = doc.data();
              fetched.push({
                id: doc.id,
                category: data.category,
                type: data.type,
                quantity: data.quantity,
                co2e: data.co2e,
                date: data.date,
                notes: data.notes || '',
              });
            });
            setActivities(fetched);
          } else {
            // Seeding default activities in Firestore for a rich initial experience
            const batch = writeBatch(db);
            SEED_ACTIVITIES.forEach((act) => {
              const docRef = doc(collection(db, 'users', currentUser.uid, 'activities'));
              batch.set(docRef, {
                category: act.category,
                type: act.type,
                quantity: act.quantity,
                co2e: act.co2e,
                date: act.date,
                notes: act.notes || 'Seed activity'
              });
            });
            await batch.commit();

            // Refetch seeded activities to ensure exact Firestore format (including ids)
            const refetchedSnap = await getDocs(q);
            const seeded: ActivityEntry[] = [];
            refetchedSnap.forEach((doc: any) => {
              const data = doc.data();
              seeded.push({
                id: doc.id,
                category: data.category,
                type: data.type,
                quantity: data.quantity,
                co2e: data.co2e,
                date: data.date,
                notes: data.notes || '',
              });
            });
            setActivities(seeded);
          }
        } catch (err) {
          console.error("Error loading user data from Firestore:", err);
          // Fallback to local storage on Firestore failure
          loadFromLocalStorage();
        } finally {
          setUserLoading(false);
        }
      } else if (demoUser) {
        setUser(demoUser as User);
        loadFromLocalStorage();
        setUserLoading(false);
      } else {
        // Not logged in: fallback to local storage
        setUser(null);
        loadFromLocalStorage();
        setUserLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('eco_activities');
      const storedGoal = localStorage.getItem('eco_goal');
      if (stored) {
        const parsed = JSON.parse(stored) as ActivityEntry[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActivities(parsed);
        } else {
          setActivities(SEED_ACTIVITIES);
        }
      } else {
        setActivities(SEED_ACTIVITIES);
      }
      if (storedGoal) {
        const parsedGoal = parseInt(storedGoal, 10);
        if (!isNaN(parsedGoal)) setGoalState(parsedGoal);
      }
    } catch {
      setActivities(SEED_ACTIVITIES);
    }
  };

  const summary = summarizeActivities(activities, goal);

  const addActivity = useCallback(async (a: ActivityEntry) => {
    setActivities((prev) => [a, ...prev]);

    if (user) {
      try {
        // Save to Firestore. Use setDoc with a.id to maintain consistency
        const actRef = doc(db, 'users', user.uid, 'activities', a.id);
        await setDoc(actRef, {
          category: a.category,
          type: a.type,
          quantity: a.quantity,
          co2e: a.co2e,
          date: a.date,
          notes: a.notes || ''
        });
      } catch (err) {
        console.error("Error writing activity to Firestore:", err);
      }
    } else {
      // Local fallback
      try {
        const stored = localStorage.getItem('eco_activities');
        const parsed = stored ? JSON.parse(stored) : [];
        localStorage.setItem('eco_activities', JSON.stringify([a, ...parsed]));
      } catch {}
    }
  }, [user]);

  const resetActivities = useCallback(async () => {
    if (user) {
      try {
        // 1. Delete all current activities in Firestore
        const activitiesRef = collection(db, 'users', user.uid, 'activities');
        const qSnap = await getDocs(activitiesRef);
        const batch = writeBatch(db);
        qSnap.forEach((doc: any) => {
          batch.delete(doc.ref);
        });
        await batch.commit();

        // 2. Re-seed default activities
        const seedBatch = writeBatch(db);
        SEED_ACTIVITIES.forEach((act) => {
          const docRef = doc(collection(db, 'users', user.uid, 'activities'));
          seedBatch.set(docRef, {
            category: act.category,
            type: act.type,
            quantity: act.quantity,
            co2e: act.co2e,
            date: act.date,
            notes: act.notes || 'Seed activity'
          });
        });
        await seedBatch.commit();

        // 3. Fetch and set
        const q = query(activitiesRef, orderBy('date', 'desc'));
        const refetchedSnap = await getDocs(q);
        const seeded: ActivityEntry[] = [];
        refetchedSnap.forEach((doc: any) => {
          const data = doc.data();
          seeded.push({
            id: doc.id,
            category: data.category,
            type: data.type,
            quantity: data.quantity,
            co2e: data.co2e,
            date: data.date,
            notes: data.notes || '',
          });
        });
        setActivities(seeded);
      } catch (err) {
        console.error("Error resetting activities in Firestore:", err);
      }
    } else {
      setActivities(SEED_ACTIVITIES);
      try { localStorage.removeItem('eco_activities'); } catch {}
    }
  }, [user]);

  const setGoal = useCallback(async (g: number) => {
    setGoalState(g);
    
    if (user) {
      try {
        const goalRef = doc(db, 'users', user.uid, 'settings', 'goal');
        await setDoc(goalRef, { value: g });
      } catch (err) {
        console.error("Error setting goal in Firestore:", err);
      }
    } else {
      try {
        localStorage.setItem('eco_goal', String(g));
      } catch {}
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ 
      user, 
      userLoading, 
      activities, 
      summary, 
      goal, 
      addActivity, 
      resetActivities, 
      setGoal,
      sidebarCollapsed,
      setSidebarCollapsed
    }}>
      {children}
    </AppContext.Provider>
  );
}

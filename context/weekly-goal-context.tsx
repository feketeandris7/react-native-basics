import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const WEEKLY_GOAL_STORAGE_KEY = 'weekly-goal-minutes';
const DEFAULT_WEEKLY_GOAL_MINUTES = 300;

let inMemoryGoalMinutes: number = DEFAULT_WEEKLY_GOAL_MINUTES;

type WeeklyGoalContextValue = Readonly<{
    weeklyGoalMinutes: number;
    isLoadingGoal: boolean;
    saveWeeklyGoalMinutes: (value: number) => Promise<void>;
}>;

const WeeklyGoalContext = createContext<WeeklyGoalContextValue | null>(null);

const normalizeGoal = (value: number) => Math.max(1, Math.round(value));

async function readStoredGoal() {
    try {
        const storedGoal = await AsyncStorage.getItem(WEEKLY_GOAL_STORAGE_KEY);

        if (storedGoal === null) {
            return inMemoryGoalMinutes;
        }

        const parsedGoal = Number(storedGoal);

        if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
            return inMemoryGoalMinutes;
        }

        return normalizeGoal(parsedGoal);
    } catch {
        return inMemoryGoalMinutes;
    }
}

async function persistGoal(value: number) {
    inMemoryGoalMinutes = value;

    try {
        await AsyncStorage.setItem(WEEKLY_GOAL_STORAGE_KEY, String(value));
    } catch {
        return;
    }
}

export function WeeklyGoalProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [weeklyGoalMinutes, setWeeklyGoalMinutes] = useState<number>(DEFAULT_WEEKLY_GOAL_MINUTES);
    const [isLoadingGoal, setIsLoadingGoal] = useState<boolean>(true);

    useEffect(() => {
        const loadGoal = async () => {
            const storedGoal = await readStoredGoal();
            setWeeklyGoalMinutes(storedGoal);
            setIsLoadingGoal(false);
        };

        void loadGoal();
    }, []);

    const saveWeeklyGoalMinutes = useCallback(async (value: number) => {
        const normalizedValue = normalizeGoal(value);
        setWeeklyGoalMinutes(normalizedValue);
        await persistGoal(normalizedValue);
    }, []);

    const contextValue = useMemo<WeeklyGoalContextValue>(
        () => ({
            weeklyGoalMinutes,
            isLoadingGoal,
            saveWeeklyGoalMinutes,
        }),
        [isLoadingGoal, saveWeeklyGoalMinutes, weeklyGoalMinutes],
    );

    return (
        <WeeklyGoalContext.Provider value={contextValue}>
            {children}
        </WeeklyGoalContext.Provider>
    );
}

export function useWeeklyGoal() {
    const context = useContext(WeeklyGoalContext);

    if (!context) {
        throw new Error('useWeeklyGoal must be used within WeeklyGoalProvider');
    }

    return context;
}

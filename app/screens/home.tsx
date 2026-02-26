import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Chip, ProgressBar, Surface, Text, useTheme, type MD3Theme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeeklyGoal } from '../../context/weekly-goal-context';

type WorkoutType = 'Strength' | 'Cardio' | 'Mobility';

type WorkoutSession = {
    id: number;
    type: WorkoutType;
    durationMinutes: number;
    date: Date;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const createDateDaysAgo = (daysAgo: number) => new Date(Date.now() - daysAgo * DAY_MS);

const initialSessions: WorkoutSession[] = [
    { id: 1, type: 'Strength', durationMinutes: 55, date: createDateDaysAgo(0) },
    { id: 2, type: 'Cardio', durationMinutes: 40, date: createDateDaysAgo(1) },
    { id: 3, type: 'Mobility', durationMinutes: 25, date: createDateDaysAgo(2) },
    { id: 4, type: 'Strength', durationMinutes: 65, date: createDateDaysAgo(4) },
    { id: 5, type: 'Cardio', durationMinutes: 35, date: createDateDaysAgo(6) },
];

const formatSessionDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

const getSessionIcon = (type: WorkoutType) => {
    if (type === 'Strength') {
        return 'weight-lifter';
    }

    if (type === 'Cardio') {
        return 'run';
    }

    return 'yoga';
};

const getWeekStart = (date: Date) => {
    const result = new Date(date);
    const day = result.getDay();
    const distance = day === 0 ? 6 : day - 1;
    result.setHours(0, 0, 0, 0);
    result.setDate(result.getDate() - distance);
    return result;
};

export default function Home() {
    const theme = useTheme();
    const [sessions, setSessions] = useState<WorkoutSession[]>(initialSessions);
    const { weeklyGoalMinutes } = useWeeklyGoal();

    const styles = useMemo(() => createStyles(theme), [theme]);
    const weekStart = useMemo(() => getWeekStart(new Date()), []);

    const weeklySessions = useMemo(
        () => sessions.filter((session) => session.date >= weekStart),
        [sessions, weekStart],
    );

    const weeklyMinutes = useMemo(
        () => weeklySessions.reduce((sum, session) => sum + session.durationMinutes, 0),
        [weeklySessions],
    );

    const weeklyAverageDailyMinutes = Math.round(weeklyMinutes / 7);
    const averageSessionMinutes = weeklySessions.length > 0
        ? Math.round(weeklyMinutes / weeklySessions.length)
        : 0;

    const weeklyProgress = Math.min(weeklyMinutes / weeklyGoalMinutes, 1);

    const deleteSession = (id: number) => {
        const newArray = sessions.filter((s) => s.id !== id);
        setSessions(newArray);
    }

    const handleLogSession = (durationMinutes: number, type: WorkoutType) => {
        setSessions((previous) => [
            {
                id: Date.now(),
                type,
                durationMinutes,
                date: new Date(),
            },
            ...previous,
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Surface elevation={1} style={styles.hero}>
                    <View style={styles.heroTopRow}>
                        <View>
                            <Text variant="labelMedium" style={styles.subtitle}>Gym tracker</Text>
                            <Text variant="headlineSmall" style={styles.title}>Train hard, recover smart 💪</Text>
                        </View>
                        <Avatar.Icon size={46} icon="dumbbell" style={styles.avatar} />
                    </View>

                    <Text variant="bodyMedium" style={styles.heroDescription}>
                        Log workouts quickly and keep an eye on your weekly consistency.
                    </Text>

                    <View style={styles.tagRow}>
                        <Chip compact icon="calendar-week">{weeklySessions.length} sessions this week</Chip>
                        <Chip compact icon="timer-outline">{weeklyAverageDailyMinutes} min/day avg</Chip>
                    </View>
                </Surface>

                <Text variant="titleMedium" style={styles.sectionTitle}>Log session</Text>
                <View style={styles.actionRow}>
                    <Button mode="contained" icon="run" style={styles.actionButton} onPress={() => handleLogSession(30, 'Cardio')}>
                        +30m Cardio
                    </Button>
                    <Button mode="contained-tonal" icon="weight-lifter" style={styles.actionButton} onPress={() => handleLogSession(45, 'Strength')}>
                        +45m Strength
                    </Button>
                </View>
                <Button mode="outlined" icon="yoga" style={styles.singleActionButton} onPress={() => handleLogSession(20, 'Mobility')}>
                    +20m Mobility / Stretch
                </Button>

                <Text variant="titleMedium" style={styles.sectionTitle}>Weekly stats</Text>
                <View style={styles.statsGrid}>
                    <Card mode="contained" style={styles.statCard}>
                        <Card.Content>
                            <Text variant="labelLarge" style={styles.muted}>Total this week</Text>
                            <Text variant="headlineSmall" style={styles.statValue}>{weeklyMinutes} min</Text>
                        </Card.Content>
                    </Card>
                    <Card mode="contained" style={styles.statCard}>
                        <Card.Content>
                            <Text variant="labelLarge" style={styles.muted}>Avg per session</Text>
                            <Text variant="headlineSmall" style={styles.statValue}>{averageSessionMinutes} min</Text>
                        </Card.Content>
                    </Card>
                </View>

                <Card mode="outlined" style={weeklyMinutes < weeklyGoalMinutes ? styles.goalCard : styles.achievedGoalCard}>
                    <Card.Content>
                        <View style={styles.goalHeader}>
                            <Text variant="titleSmall">Weekly goal progress</Text>
                            <Text variant="labelLarge" style={styles.muted}>{weeklyMinutes}/{weeklyGoalMinutes} min</Text>
                        </View>
                        <ProgressBar progress={weeklyProgress} style={styles.progressBar} />
                    </Card.Content>
                </Card>

                <Text variant="titleMedium" style={styles.sectionTitle}>Recent sessions</Text>
                <Card mode="outlined" style={styles.activityCard}>
                    <Card.Content>
                        {sessions.length ? (
                            sessions.map((session) => (
                                <View key={session.id} style={styles.activityRow}>
                                    <Avatar.Icon
                                        size={34}
                                        icon={getSessionIcon(session.type)}
                                        style={styles.activityIcon}
                                    />
                                    <View style={styles.activityTextWrap}>
                                        <Text variant="titleSmall">{session.type} · {session.durationMinutes} min</Text>
                                        <Text variant="bodySmall" style={styles.muted}>{formatSessionDate(session.date)}</Text>
                                    </View>
                                    <Avatar.Icon size={34} icon={'delete'} style={styles.deleteIcon} onTouchStart={() => deleteSession(session.id)}/>
                                </View>
                            ))) :
                        <Text variant="bodyMedium" style={styles.muted}>No sessions logged yet.</Text>
                        }           
                    </Card.Content>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (theme: MD3Theme) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            padding: 16,
            paddingBottom: 28,
            gap: 12,
        },
        hero: {
            borderRadius: 20,
            padding: 16,
            backgroundColor: theme.colors.surface,
        },
        heroTopRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        avatar: {
            backgroundColor: theme.colors.primary,
        },
        subtitle: {
            color: theme.colors.onSurfaceVariant,
        },
        title: {
            marginTop: 2,
            fontWeight: '700',
        },
        heroDescription: {
            marginTop: 12,
            color: theme.colors.onSurfaceVariant,
            lineHeight: 20,
        },
        tagRow: {
            marginTop: 14,
            flexDirection: 'row',
            gap: 8,
        },
        sectionTitle: {
            marginTop: 4,
            marginBottom: 2,
            fontWeight: '600',
        },
        actionRow: {
            flexDirection: 'row',
            gap: 10,
        },
        actionButton: {
            flex: 1,
            borderRadius: 12,
        },
        singleActionButton: {
            borderRadius: 12,
        },
        statsGrid: {
            flexDirection: 'row',
            gap: 10,
        },
        statCard: {
            flex: 1,
            borderRadius: 14,
        },
        statValue: {
            marginTop: 6,
            fontWeight: '700',
        },
        muted: {
            color: theme.colors.onSurfaceVariant,
        },
        activityCard: {
            borderRadius: 14,
        },
        goalCard: {
            borderRadius: 14,
        },
        achievedGoalCard: {
            borderRadius: 14,
            backgroundColor: '#80ef80',
        },
        goalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
        progressBar: {
            height: 10,
            borderRadius: 999,
        },
        activityRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12,
        },
        activityIcon: {
            backgroundColor: theme.colors.secondaryContainer,
        },
        deleteIcon: {
            backgroundColor: theme.colors.error,
        },
        activityTextWrap: {
            flex: 1,
        },
    });
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, HelperText, Text, TextInput, useTheme, type MD3Theme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeeklyGoal } from '../../context/weekly-goal-context';

const GOAL_PRESETS = [180, 240, 300, 420];

export default function Settings() {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const { weeklyGoalMinutes, isLoadingGoal, saveWeeklyGoalMinutes } = useWeeklyGoal();
    const [goalInput, setGoalInput] = useState<string>(String(weeklyGoalMinutes));
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>('');

    const parsedInput = Number(goalInput);
    const hasError = goalInput.length > 0 && (!Number.isFinite(parsedInput) || parsedInput <= 0);

    useEffect(() => {
        setGoalInput(String(weeklyGoalMinutes));
    }, [weeklyGoalMinutes]);

    const applyGoal = async (value: number) => {
        setIsSaving(true);

        try {
            await saveWeeklyGoalMinutes(value);
            setGoalInput(String(Math.max(1, Math.round(value))));
            setFeedback('Weekly goal saved.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        if (hasError) {
            setFeedback('Please enter a valid number greater than 0.');
            return;
        }

        await applyGoal(parsedInput);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text variant="headlineSmall" style={styles.title}>Settings</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                    Set your weekly workout goal in minutes.
                </Text>

                <Card mode="outlined" style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Weekly goal</Text>

                        <TextInput
                            mode="outlined"
                            label="Goal (minutes/week)"
                            keyboardType="number-pad"
                            value={goalInput}
                            onChangeText={setGoalInput}
                            disabled={isSaving || isLoadingGoal}
                            error={hasError}
                        />

                        <HelperText type="error" visible={hasError}>
                            Enter a value greater than 0.
                        </HelperText>

                        <View style={styles.presetRow}>
                            {GOAL_PRESETS.map((preset) => (
                                <Button
                                    key={preset}
                                    mode={preset === weeklyGoalMinutes ? 'contained-tonal' : 'text'}
                                    onPress={() => applyGoal(preset)}
                                    disabled={isSaving || isLoadingGoal}
                                    compact
                                >
                                    {preset}
                                </Button>
                            ))}
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleSave}
                            loading={isSaving}
                            disabled={isSaving || isLoadingGoal || hasError || goalInput.length === 0}
                            style={styles.saveButton}
                        >
                            Save goal
                        </Button>

                        <Text variant="bodySmall" style={styles.currentValue}>
                            Current goal: {weeklyGoalMinutes} min/week
                        </Text>

                        {feedback.length > 0 ? (
                            <Text variant="bodySmall" style={styles.feedback}>{feedback}</Text>
                        ) : null}
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
            gap: 10,
        },
        title: {
            fontWeight: '700',
        },
        subtitle: {
            color: theme.colors.onSurfaceVariant,
            marginBottom: 8,
        },
        card: {
            borderRadius: 14,
        },
        sectionTitle: {
            marginBottom: 10,
            fontWeight: '600',
        },
        presetRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 4,
        },
        saveButton: {
            marginTop: 12,
            borderRadius: 10,
        },
        currentValue: {
            marginTop: 10,
            color: theme.colors.onSurfaceVariant,
        },
        feedback: {
            marginTop: 8,
            color: theme.colors.primary,
        },
    });
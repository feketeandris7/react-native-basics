import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { WeeklyGoalProvider } from '../../context/weekly-goal-context';
import Home from './home';
import Settings from './settings';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Route {
    route: {
        name: string;
    }
}
interface TabBarIconProps {
    focused: boolean;
    color: string;
    size: number;
}

const Tab = createBottomTabNavigator();

const tabScreenOptions = ({ route }: Route) => ({
    headerShown: false,
    tabBarIcon: ({ focused, color, size }: TabBarIconProps) => {
        let iconName: IoniconName = 'home-outline';

        if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
    },
});

export default function AppContent() {
    return (
        <WeeklyGoalProvider>
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={tabScreenOptions}
            >
                <Tab.Screen name="Home" component={Home}  />
                <Tab.Screen name="Settings" component={Settings} />
            </Tab.Navigator>
        </WeeklyGoalProvider>
    );
}
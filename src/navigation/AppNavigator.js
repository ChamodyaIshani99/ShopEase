
import React from 'react';
import { Platform } from 'react-native';
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';


import useTheme from '../hooks/useTheme';
import { selectCartCount } from '../store/cartSlice';

import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import WishlistScreen from '../screens/WishlistScreen';
import Placeholder from '../screens/Placeholder';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ICONS = {
    Home: ['home', 'home-outline'],
    Wishlist: ['heart', 'heart-outline'],
    Cart: ['cart', 'cart-outline'],
    Profile: ['person', 'person-outline'],
};

function Tabs() {
    const { colors } = useTheme();
    const cartCount = useSelector(selectCartCount);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.subtext,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopWidth: 0,
                    elevation: 12,
                    height: Platform.OS === 'ios' ? 88 : 64,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
                    paddingTop: 8,
                },
                tabBarBadgeStyle: {
                    backgroundColor: colors.danger,
                    color: '#fff',
                },
                tabBarIcon: ({ focused, color }) => {
                    const [filled, outline] = ICONS[route.name];

                    return (
                        <Ionicons
                            name={focused ? filled : outline}
                            size={24}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
            />

            <Tab.Screen
                name="Wishlist"
                component={WishlistScreen}
            />

            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{ tabBarBadge: cartCount > 0 ? cartCount : undefined }}
            />

            <Tab.Screen
                name="Profile"
                component={Placeholder}
            />

        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { colors, isDark } = useTheme();

    const navTheme = {
        ...(isDark ? DarkTheme : DefaultTheme),
        colors: {
            ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
            background: colors.background,
            card: colors.card,
            text: colors.text,
            border: colors.border,
            primary: colors.primary,
        },
    };

    return (
        <NavigationContainer theme={navTheme}>
            <Stack.Navigator>
                <Stack.Screen
                    name="Tabs"
                    component={Tabs}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="ProductDetails"
                    component={ProductDetailsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Checkout"
                    component={Placeholder}
                    options={{ title: 'Checkout' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

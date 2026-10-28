import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import { selectCartCount } from '../store/cartSlice';

import HomeScreen from '../screens/HomeScreen';
import WishlistScreen from '../screens/WishlistScreen';
import CartScreen from '../screens/CartScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import OrdersScreen from '../screens/OrdersScreen';
import Placeholder from '../screens/Placeholder';
import ProfileScreen from '../screens/ProfileScreen';
import ManageProductsScreen from '../screens/ManageProductsScreen';
import ProductFormScreen from '../screens/ProductFormScreen';

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
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopWidth: 0,
                    elevation: 12,
                    height: Platform.OS === 'ios' ? 88 : 64,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
                    paddingTop: 8,
                },
                tabBarBadgeStyle: { backgroundColor: colors.danger, color: '#fff' },
                tabBarIcon: ({ focused, color }) => {
                    const [filled, outline] = ICONS[route.name];
                    return <Ionicons name={focused ? filled : outline} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Wishlist" component={WishlistScreen} />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{ tabBarBadge: cartCount > 0 ? cartCount : undefined }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const { colors, isDark } = useTheme();
    const user = useSelector((s) => s.auth.user);

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
                {!user ? (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                        <Stack.Screen
                            name="ProductDetails"
                            component={ProductDetailsScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
                        <Stack.Screen
                            name="OrderSuccess"
                            component={OrderSuccessScreen}
                            options={{ headerShown: false, gestureEnabled: false }}
                        />
                        <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'My Orders' }} />
                        <Stack.Screen
                            name="ManageProducts"
                            component={ManageProductsScreen}
                            options={{ title: 'Manage Products' }}
                        />
                        <Stack.Screen
                            name="ProductForm"
                            component={ProductFormScreen}
                            options={({ route }) => ({
                                title: route.params?.product ? 'Edit Product' : 'Add Product',
                            })}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
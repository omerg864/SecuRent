import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import HapticButton from '@/components/ui/HapticButton';
import { Feather } from '@expo/vector-icons';

// Sample Business Locations
const businessLocations = [
    {
        id: "1",
        name: 'Bike Shop',
        address: 'Eli Visel 2, Rishon Lezion',
        latitude: 31.9697,
        longitude: 34.7722,
    },
    {
        id: "2",
        name: 'Bowling Center',
        address: 'Eli Visel 18, Rishon Lezion',
        latitude: 31.9692,
        longitude: 34.7730,
    },
    {
        id: "3",
        name: 'Scuba Marine',
        address: 'Ahi Dakar 12, Rishon Lezion',
        latitude: 31.9635,
        longitude: 34.7701,
    },
    {
        id: "4",
        name: 'Auto Center',
        address: 'Rothschild 2, Rishon Lezion',
        latitude: 31.9735,
        longitude: 34.7745,
    },
];

const MapScreen: React.FC = () => {
    const router = useRouter();
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>({
        latitude: 31.9697,
        longitude: 34.7722,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Location access is required to show your position.");
                setLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        <ThemedView className="flex-1">
            {/* Back Button */}
            <View className="absolute top-10 left-4 z-10">
                <HapticButton onPress={() => router.back()} className="bg-white p-2 rounded-full shadow-md">
                    <Feather name="arrow-left" size={24} color="black" />
                </HapticButton>
            </View>

            {/* Map View */}
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: userLocation?.latitude || 31.9697,
                    longitude: userLocation?.longitude || 34.7722,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
                showsUserLocation={true}
            >
                {/* Business Markers */}
                {businessLocations.map((business) => (
                    <Marker
                        key={business.id}
                        coordinate={{
                            latitude: business.latitude,
                            longitude: business.longitude,
                        }}
                        title={business.name}
                        description={business.address}
                        onCalloutPress={() => console.log('Marker Pressed')}
                    />
                ))}
            </MapView>
        </ThemedView>
    );
};

export default MapScreen;
import React, { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter, useGlobalSearchParams, useFocusEffect } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView";
import FloatingBackArrowButton from "@/components/ui/FloatingBackArrowButton";
import ShowToast from "@/components/ui/ShowToast";

const MapScreen: React.FC = () => {
  const router = useRouter();
  const { businesses } = useGlobalSearchParams<{ businesses: string }>();

  const [businessLocations, setBusinessLocations] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState({
    latitude: 31.9697,
    longitude: 34.7722,
  });
  const [loading, setLoading] = useState(true);

  const fetchLocationAndBusinesses = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        ShowToast(
          "error",
          "Permission Denied",
          "Location access is required to show your position."
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const parsed = JSON.parse(businesses || "[]");
      const mapped = parsed.map((business: any) => ({
        id: business._id,
        name: business.name,
        address: business.address,
        latitude: parseFloat(business.location.coordinates[1]),
        longitude: parseFloat(business.location.coordinates[0]),
      }));

      setBusinessLocations(mapped);
    } catch (error) {
      console.error("Error fetching location or parsing businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchLocationAndBusinesses();
    }, [businesses])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ThemedView className="flex-1">
      <FloatingBackArrowButton />

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
      >
        {businessLocations.map((business) => (
          <Marker
            key={business.id}
            coordinate={{
              latitude: business.latitude,
              longitude: business.longitude,
            }}
            title={business.name}
            description={business.address}
            onCalloutPress={() => {
              router.push({
                pathname: "/customer/BusinessProfileScreen",
                params: { id: business.id },
              });
            }}
          />
        ))}
      </MapView>
    </ThemedView>
  );
};

export default MapScreen;

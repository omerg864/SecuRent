import { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import HapticButton from "@/components/ui/HapticButton";
import { ThemedText } from "./ui/ThemedText";
import { FileObject } from "@/types/business";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import ImageViewer from "react-native-image-zoom-viewer";

interface ProfileImageInputProps {
  setFile: (file: FileObject | null) => void;
  label?: string;
  labelClassName?: string;
  containerClassName?: string;
  themeText?: boolean;
  file: FileObject | null;
  initialUrl?: string; // <- added support for existing profile image
}

export default function ProfileImageInput({
  setFile,
  label,
  labelClassName,
  containerClassName,
  themeText = true,
  file,
  initialUrl,
}: ProfileImageInputProps) {
  const [uri, setUri] = useState<string | null>(null);
  const [wasManuallyEdited, setWasManuallyEdited] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const ensureValidFile = (
    uri: string,
    fileName: string = "image.jpg"
  ): FileObject => ({
    uri,
    name: fileName,
    type: "image/jpeg",
  });

  const pickFromLibrary = async () => {
    await actionSheetRef.current?.hide();
    setTimeout(async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const file = ensureValidFile(asset.uri, asset.fileName ?? "image.jpg");
        setWasManuallyEdited(true);
        setUri(asset.uri);
        setFile(file);
      }
    }, 300);
  };

  const takePhoto = async () => {
    await actionSheetRef.current?.hide();
    setTimeout(async () => {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) return;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const file = ensureValidFile(asset.uri, "camera.jpg");
        setWasManuallyEdited(true);
        setUri(asset.uri);
        setFile(file);
      }
    }, 300);
  };

  const handleRemove = () => {
    actionSheetRef.current?.hide();
    setWasManuallyEdited(true);
    setUri(null);
    setTimeout(() => {
      setFile(null);
    }, 50);
  };

  useEffect(() => {
    if (file?.uri) {
      setUri(file.uri);
    } else if (initialUrl && !wasManuallyEdited) {
      setUri(initialUrl);
    } else {
      setUri(null);
    }
  }, [file, initialUrl, wasManuallyEdited]);

  const handleEditPress = () => {
    actionSheetRef.current?.show();
  };

  return (
    <View className={`${containerClassName} flex-col gap-4`}>
      <View className="items-center">
        {themeText ? (
          <ThemedText className={`text-sm font-medium ${labelClassName}`}>
            {label}
          </ThemedText>
        ) : (
          <Text className={`text-lg font-lg ${labelClassName}`}>{label}</Text>
        )}

        <HapticButton
          onPress={() => {
            if (uri) {
              setShowPreview(true);
            } else {
              handleEditPress();
            }
          }}
          className="w-24 h-24 rounded-full bg-gray-300 justify-center items-center mt-2 overflow-hidden"
        >
          {uri ? (
            <Image source={{ uri }} className="w-full h-full" />
          ) : (
            <Text className="text-gray-500">Upload</Text>
          )}
        </HapticButton>

        {uri && (
          <View className="mt-2 flex-col gap-2">
            <Text onPress={handleEditPress} className="text-blue-500 underline">
              Edit Image
            </Text>
          </View>
        )}
      </View>

      {/* Action Sheet */}
      <ActionSheet ref={actionSheetRef}>
        <TouchableOpacity
          onPress={takePhoto}
          className="p-4 border-b border-gray-200"
        >
          <Text className="text-lg text-center">Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pickFromLibrary}
          className="p-4 border-b border-gray-200"
        >
          <Text className="text-lg text-center">Choose from Library</Text>
        </TouchableOpacity>

        {uri && (
          <TouchableOpacity
            onPress={handleRemove}
            className="p-4 border-b border-gray-200"
          >
            <Text className="text-lg text-center text-red-500">
              Remove Image
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => actionSheetRef.current?.hide()}
          className="p-4"
        >
          <Text className="text-lg text-center">Cancel</Text>
        </TouchableOpacity>
      </ActionSheet>

      {/* Image Preview Modal */}
      <Modal visible={showPreview} transparent={true}>
        <ImageViewer
          imageUrls={[{ url: uri! }]}
          enableSwipeDown
          onSwipeDown={() => setShowPreview(false)}
          onCancel={() => setShowPreview(false)}
          renderHeader={() => (
            <TouchableOpacity
              onPress={() => setShowPreview(false)}
              style={{
                position: "absolute",
                top: 50,
                left: 20,
                zIndex: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 30 }}>✕</Text>
            </TouchableOpacity>
          )}
        />
      </Modal>
    </View>
  );
}

import React from 'react';
import { Modal, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { TouchableOpacity } from './ui/touchable-opacity';
import { ThemedText } from './ui/ThemedText';

interface ModelListProps<T> {
	modalVisible: boolean;
	setModalVisible: (visible: boolean) => void;
	data: T[];
	renderFunction: (item: T) => JSX.Element;
	uniqueKey?: keyof T;
}

const ModalList = <T,>({
	modalVisible,
	setModalVisible,
	data,
	renderFunction,
	uniqueKey
}: ModelListProps<T>) => {
	return (
		<Modal
			visible={modalVisible}
			animationType="slide"
			transparent={true}
			onRequestClose={() => setModalVisible(false)}
		>
			<View className="flex-1 justify-center items-center bg-black bg-opacity-50">
				<View className="w-4/5 bg-white rounded-xl p-5">
					<FlatList
						data={data}
						renderItem={({ item }) => renderFunction(item)}
						keyExtractor={(item) =>
							(item as any)[uniqueKey || 'id']?.toString() || ''
						}
					/>
					<TouchableOpacity
						className="mt-5 bg-black p-3 rounded-xl items-center"
						onPress={() => setModalVisible(false)}
					>
						<ThemedText className="text-lg text-gray-700">
							Close
						</ThemedText>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

export default ModalList;

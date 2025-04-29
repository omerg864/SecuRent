import React from 'react';
import { Modal, Pressable, View, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';

interface BaseModalProps {
	visible: boolean;
	onClose: () => void;
	children: React.ReactNode;
	blur?: boolean;
	centered?: boolean;
}

export const BaseModal = ({
	visible,
	onClose,
	children,
	blur = true,
	centered = true,
}: BaseModalProps) => {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<Pressable style={styles.pressable} onPress={onClose}>
				{blur && (
					<BlurView
						intensity={60}
						tint="dark"
						style={StyleSheet.absoluteFill}
					/>
				)}
				<View style={[styles.content, centered && styles.centered]}>
					{children}
				</View>
			</Pressable>
		</Modal>
	);
};

const styles = StyleSheet.create({
	pressable: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		zIndex: 10,
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});

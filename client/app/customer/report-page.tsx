import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { z } from 'zod';
import FloatingBackArrowButton from '@/components/ui/FloatingBackArrowButton';
import ShowToast from '@/components/ui/ShowToast';
import LabeledInput from '@/components/ui/LabeledInput';

const schema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
});

type FormData = z.infer<typeof schema>;

const AddReportPage = () => {
	const { businessName, BusinessId } = useLocalSearchParams();
	const [form, setForm] = useState<FormData>({ title: '', description: '' });
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		const result = schema.safeParse(form);
		if (!result.success) {
			const msg = Object.values(result.error.flatten().fieldErrors)
				.flat()
				.join('\n');
			return ShowToast('error', 'Validation Error', msg);
		}
		setLoading(true);
		try {
			ShowToast('success', 'Report submitted successfully');
			router.back();
		} catch {
			ShowToast('error', 'Failed to submit report');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<FloatingBackArrowButton />
			<ScrollView className="flex-1 bg-gray-100">
				<View className="px-6 pt-20 pb-8">
					<Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
						New Report for {'\n'}
						{businessName}
					</Text>

					<View className="space-y-5 mt-2">
						<LabeledInput
							label="Report Title"
							value={form.title}
							onChange={(text) =>
								setForm((f) => ({ ...f, title: text }))
							}
						/>

						<LabeledInput
							label="Description"
							value={form.description}
							onChange={(text) =>
								setForm((f) => ({ ...f, description: text }))
							}
							multiline
						/>
					</View>

					<TouchableOpacity
						className={`mt-8 py-4 rounded-xl items-center ${
							loading ? 'bg-blue-300' : 'bg-blue-600'
						}`}
						onPress={handleSubmit}
						disabled={loading}
					>
						<Text className="text-white text-base font-semibold">
							{loading ? 'Submitting...' : 'Submit Report'}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</>
	);
};

export default AddReportPage;

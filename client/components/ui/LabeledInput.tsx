import { View, Text, TextInput } from 'react-native';
const LabeledInput = ({
	label,
	value,
	onChange,
	multiline = false,
}: {
	label: string;
	value: string;
	onChange: (text: string) => void;
	multiline?: boolean;
}) => (
	<View>
		<Text className="text-base font-semibold text-gray-700 mb-2 mt-2">
			{label} <Text className="text-red-500">*</Text>
		</Text>
		<TextInput
			className={`border border-gray-300 rounded-xl p-4 bg-white text-gray-800 ${
				multiline ? 'h-36' : ''
			}`}
			placeholder={`Enter ${label.toLowerCase()}`}
			multiline={multiline}
			textAlignVertical={multiline ? 'top' : 'auto'}
			value={value}
			onChangeText={onChange}
		/>
	</View>
);
export default LabeledInput;

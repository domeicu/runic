import { View, ScrollView, Text, TouchableOpacity } from 'react-native';

interface ChipSelectorProps<T extends string> {
  theme: any;
  onPress: (value: T) => void;
  values: T[];
  activeValue: T;
}

const ChipSelector = <T extends string>({
  theme,
  onPress,
  values,
  activeValue,
}: ChipSelectorProps<T>) => (
  <View className="mb-6">
    <Text className="mb-2 font-medium" style={{ color: theme.textSecondary }}>
      type
    </Text>
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      className="flex-row"
      contentContainerStyle={{ columnGap: 5 }}
    >
      {values.map((value) => (
        <TouchableOpacity
          key={value}
          onPress={() => onPress(value)}
          className={'px-4 py-2 rounded-full border'}
          style={
            activeValue === value
              ? { backgroundColor: theme.accent }
              : { backgroundColor: 'transparent', borderColor: theme.border }
          }
        >
          <Text
            style={activeValue === value ? { color: theme.glass } : { color: theme.textSecondary }}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

export default ChipSelector;

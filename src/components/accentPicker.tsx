import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Check, Plus, X } from 'lucide-react-native';
import { useTheme } from '../lib/themeContext';

const PRESET_COLORS = [
  '#FACC15', // Neon Yellow
  '#C084FC', // Neon Purple
  '#F472B6', // Neon Pink
  '#2DD4BF', // Neon Turquoise
  '#94A3B8', // Grey-Blue (Slate)
];

const AccentPicker = () => {
  const { theme, accent, updateAccent } = useTheme();

  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState(accent);

  const isCustomColor = !PRESET_COLORS.includes(accent);

  useEffect(() => {
    setInputText(accent);
  }, [accent]);

  const handleCustomColorChange = (text: string) => {
    const formatted = text.startsWith('#') ? text : `#${text}`;
    setInputText(formatted);

    const hexRegex = /^#([A-Fa-f0-9]{6})$/;
    if (hexRegex.test(formatted)) {
      updateAccent(formatted);
    }
  };

  const handlePresetPress = (color: string) => {
    updateAccent(color);
    setShowInput(false);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: 20,
          gap: 16,
          paddingVertical: 4,
        }}
      >
        {PRESET_COLORS.map((color) => {
          const isActive = accent === color;

          return (
            <TouchableOpacity
              key={color}
              onPress={() => handlePresetPress(color)}
              activeOpacity={0.7}
              className="items-center justify-center"
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: theme.surface,
                  shadowColor: color,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                {isActive && <Check size={20} color="#fff" strokeWidth={3} />}
              </View>

              {isActive && (
                <View
                  style={{
                    position: 'absolute',
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    borderWidth: 2,
                    borderColor: theme.text,
                    opacity: 0.2,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Custom Color Button */}
        <TouchableOpacity
          onPress={() => setShowInput(!showInput)}
          activeOpacity={0.7}
          className="items-center justify-center"
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isCustomColor ? accent : theme.surface,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: isCustomColor ? theme.surface : theme.border,
              borderStyle: isCustomColor ? 'solid' : 'dashed',
            }}
          >
            {isCustomColor ? (
              <Check size={20} color="#fff" strokeWidth={3} />
            ) : (
              <Plus size={20} color={theme.textSecondary} />
            )}
          </View>

          {(isCustomColor || showInput) && (
            <View
              style={{
                position: 'absolute',
                width: 48,
                height: 48,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: theme.text,
                opacity: 0.2,
              }}
            />
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Hex Input Field */}
      {showInput && (
        <View className="mt-4 flex-row items-center">
          <View
            className="flex-1 flex-row items-center rounded-xl border px-3 py-2"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
            }}
          >
            <View
              className="mr-3 h-4 w-4 rounded-full"
              style={{ backgroundColor: inputText }}
            />
            <TextInput
              value={inputText}
              onChangeText={handleCustomColorChange}
              placeholder="#000000"
              placeholderTextColor={theme.textSecondary}
              maxLength={7}
              autoCapitalize="characters"
              autoCorrect={false}
              style={{
                color: theme.text,
                flex: 1,
                fontSize: 16,
                fontWeight: '500',
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowInput(false)}
            className="ml-3 p-2"
          >
            <X size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AccentPicker;

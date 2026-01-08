import React, { useState } from 'react';
import { View, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SPRING_CONFIG = {
  damping: 15,
  mass: 0.6,
  stiffness: 250,
};

const BUTTON_HEIGHT = 44;
const CLOSED_WIDTH = 44;
const OPEN_WIDTH = 110;

interface ActionButton {
  icon: React.ReactNode;
  onPress: () => void;
}

interface ExpandingActionPillProps {
  theme: any;
  leftAction: ActionButton;
  rightAction: ActionButton;
}

const ExpandingActionPill = ({ theme, leftAction, rightAction }: ExpandingActionPillProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const progress = useSharedValue(0);

  const toggle = () => {
    const newValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);
    progress.value = withSpring(newValue, SPRING_CONFIG);
  };

  const close = () => {
    if (isOpen) toggle();
  };

  const handlePress = (callback: () => void) => {
    toggle();
    setTimeout(callback, 50);
  };

  const containerStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [CLOSED_WIDTH, OPEN_WIDTH]),
    borderRadius: BUTTON_HEIGHT / 2,
  }));

  const plusStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6], [1, 0]),
    transform: [
      { rotate: `${interpolate(progress.value, [0, 1], [0, 90])}deg` },
      { scale: interpolate(progress.value, [0, 1], [1, 0.5]) },
    ],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.4, 1], [0, 1]),
    transform: [{ scale: interpolate(progress.value, [0.5, 1], [0.8, 1]) }],
  }));

  return (
    <View style={{ zIndex: 50 }}>
      {/* Invisible view so tapping outside closes */}
      {isOpen && (
        <TouchableWithoutFeedback onPress={close}>
          <View
            style={{
              position: 'absolute',
              top: -height,
              left: -width,
              width: width * 2,
              height: height * 2,
            }}
          />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[
          containerStyle,
          {
            backgroundColor: theme.glass,
            borderColor: theme.border,
            borderWidth: 1,
            shadowColor: theme.shadow,
            shadowOpacity: 0.2,
            shadowRadius: 10,
          },
        ]}
        className="h-11 w-11 items-center justify-center rounded-full shadow-xl backdrop-blur-xl"
      >
        {/* Toggle Button */}
        <Animated.View
          style={[plusStyle, { position: 'absolute', zIndex: 20 }]}
          pointerEvents={isOpen ? 'none' : 'auto'}
        >
          <TouchableOpacity
            onPress={toggle}
            activeOpacity={0.7}
            className="w-11 h-11 items-center justify-center"
          >
            <Plus size={22} color={theme.text} strokeWidth={1.5} />
          </TouchableOpacity>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={[actionsStyle, { width: '100%', height: '100%' }]}
          className="flex-row items-center justify-evenly"
          pointerEvents={isOpen ? 'auto' : 'none'}
        >
          <TouchableOpacity
            onPress={() => handlePress(leftAction.onPress)}
            className="flex-1 h-full items-center justify-center active:bg-black/5 dark:active:bg-white/10"
          >
            {leftAction.icon}
          </TouchableOpacity>

          <View className="h-4 w-[1px] bg-zinc-400/20 dark:bg-zinc-600/40" />

          <TouchableOpacity
            onPress={() => handlePress(rightAction.onPress)}
            className="flex-1 h-full items-center justify-center active:bg-black/5 dark:active:bg-white/10"
          >
            {rightAction.icon}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default ExpandingActionPill;

import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'nativewind';
import { icons } from '@/constants/icons';

const _layout = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const accentColor = isDark ? '#deff63' : '#accf2d';

  return (
    <NativeTabs tintColor={accentColor}>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon src={icons.home} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="schedule">
        <Label>Schedule</Label>
        <Icon src={icons.schedule} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon src={icons.person} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default _layout;

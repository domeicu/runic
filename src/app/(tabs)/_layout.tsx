import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'nativewind';
import { icons } from '@/src/constants/icons';
import { Colours } from '@/src/constants/theme';

const Layout = () => {
  const { colorScheme } = useColorScheme();
  const theme = Colours[colorScheme ?? 'light'];

  return (
    <NativeTabs tintColor={theme.accent}>
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

export default Layout;

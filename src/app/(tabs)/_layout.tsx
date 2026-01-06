import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { icons } from '@/constants/icons';

const _layout = () => {
  return (
    <NativeTabs>
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

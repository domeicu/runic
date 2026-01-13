import { useRef, useCallback, useEffect, RefObject } from 'react';
import { SectionList } from 'react-native';
import { useFocusEffect } from 'expo-router';

export function useAutoScrollToToday(
  listRef: RefObject<SectionList | null>,
  data: any[] | undefined,
  todayIndex: number
) {
  const userHasTouched = useRef(false);

  useFocusEffect(
    useCallback(() => {
      userHasTouched.current = false;
    }, [])
  );

  useEffect(() => {
    const shouldScroll =
      todayIndex !== -1 && data !== undefined && !userHasTouched.current;

    if (shouldScroll) {
      const timer = setTimeout(() => {
        if (!userHasTouched.current) {
          listRef?.current?.scrollToLocation({
            sectionIndex: todayIndex,
            itemIndex: 0,
            viewPosition: 0.1,
            animated: true,
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [todayIndex, data, listRef]);

  return {
    handleTouchStart: () => {
      userHasTouched.current = true;
    },
  };
}

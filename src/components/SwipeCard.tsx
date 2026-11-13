import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, GestureResponderEvent } from 'react-native';

interface Props {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onDoubleSwipeRight?: () => void;
  leftThreshold?: number;
  rightThreshold?: number;
  doubleSwipeThreshold?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;
const DOUBLE_SWIPE_THRESHOLD = 200;

export const SwipeCard: React.FC<Props> = ({ children, onSwipeLeft, onSwipeRight, onDoubleSwipeRight, leftThreshold = -SWIPE_THRESHOLD, rightThreshold = SWIPE_THRESHOLD, doubleSwipeThreshold = DOUBLE_SWIPE_THRESHOLD }) => {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const swipeCount = useRef(0);
  const swipeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSwipeRight = useCallback(() => {
    swipeCount.current += 1;
    if (swipeCount.current === 1) {
      swipeTimeout.current = setTimeout(() => {
        if (swipeCount.current === 1) {
          onSwipeRight?.();
        }
        swipeCount.current = 0;
      }, 500);
    } else if (swipeCount.current >= 2) {
      if (swipeTimeout.current) clearTimeout(swipeTimeout.current);
      swipeCount.current = 0;
      onDoubleSwipeRight?.();
    }
  }, [onSwipeRight, onDoubleSwipeRight]);

  const handlePanResponderMove = useCallback((_event: GestureResponderEvent, gesture: any) => {
    setOffsetX(gesture.dx);
    setOffsetY(gesture.dy);
  }, []);

  const handlePanResponderRelease = useCallback((_event: GestureResponderEvent, gesture: any) => {
    if (gesture.dx < leftThreshold) {
      setOffsetX(-SCREEN_WIDTH);
      setOffsetY(100);
      onSwipeLeft?.();
    } else if (gesture.dx > doubleSwipeThreshold) {
      setOffsetX(SCREEN_WIDTH);
      setOffsetY(100);
      handleSwipeRight();
    } else if (gesture.dx > rightThreshold) {
      setOffsetX(SCREEN_WIDTH);
      setOffsetY(100);
      handleSwipeRight();
    } else {
      setOffsetX(0);
      setOffsetY(0);
    }
  }, [leftThreshold, doubleSwipeThreshold, rightThreshold, onSwipeLeft, handleSwipeRight]);

  const rotate = offsetX / SCREEN_WIDTH * 30;
  const opacity = 1 - Math.abs(offsetX) / SCREEN_WIDTH * 0.7;

  return (
    <View
      style={[styles.card, { transform: [{ translateX: offsetX }, { translateY: offsetY }, { rotate: `${rotate}deg` }], opacity }]}
      onTouchStart={() => {}}
      onTouchMove={(e) => handlePanResponderMove(e as any, { dx: e.nativeEvent.pageX, dy: e.nativeEvent.pageY })}
      onTouchEnd={(e) => handlePanResponderRelease(e as any, { dx: offsetX, dy: offsetY })}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 40,
    alignSelf: 'center',
    borderRadius: 16,
    backgroundColor: '#1e1e2e',
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
});
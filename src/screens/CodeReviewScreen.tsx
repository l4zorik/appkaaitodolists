import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Header } from '../components/Header';
import { QualityControl } from '../components/QualityControl';

interface Props {
  isPremium: boolean;
  onBack: () => void;
}

export const CodeReviewScreen: React.FC<Props> = ({ isPremium, onBack }) => (
  <View style={styles.container}>
    <Header current="codeReview" onNavigate={onBack} isPremium={isPremium} adCount={0} />
    <QualityControl isPremium={isPremium} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
});
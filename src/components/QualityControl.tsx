import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { analyzeCode, CodeAnalysis } from '../ai/codeReview';

interface Props {
  isPremium: boolean;
}

export const QualityControl: React.FC<Props> = ({ isPremium }) => {
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (!isPremium) return;
    setLoading(true);
    setTimeout(() => {
      const result = analyzeCode(code);
      setAnalysis(result);
      setLoading(false);
    }, 500);
  };

  const severityColor = { error: '#f44336', warning: '#ff9800', info: '#2196f3' };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Code Quality Control</Text>
      <TextInput
        style={styles.codeInput}
        value={code}
        onChangeText={setCode}
        placeholder="Paste code to analyze..."
        placeholderTextColor="#666"
        multiline
        numberOfLines={10}
        editable={isPremium}
      />
      <TouchableOpacity style={[styles.analyzeBtn, !isPremium && styles.analyzeBtnDisabled]} onPress={handleAnalyze} disabled={!isPremium || loading}>
        <Text style={styles.analyzeBtnText}>{loading ? 'Analyzing...' : 'Analyze Code'}</Text>
      </TouchableOpacity>

      {analysis && (
        <View style={styles.result}>
          <Text style={styles.score}>Score: {analysis.score}/100</Text>
          <Text style={styles.summary}>{analysis.summary}</Text>
          <ScrollView>
            {analysis.issues.map((issue, i) => (
              <View key={i} style={[styles.issue, { borderLeftColor: severityColor[issue.severity] }]}>
                <Text style={[styles.severity, { color: severityColor[issue.severity] }]}>{issue.severity.toUpperCase()}</Text>
                <Text style={styles.issueText}>L{issue.line}: {issue.message}</Text>
                <Text style={styles.rule}>rule: {issue.rule}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 16 },
  heading: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 16 },
  codeInput: { backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#333', height: 200, textAlignVertical: 'top', fontFamily: 'monospace', fontSize: 13 },
  analyzeBtn: { backgroundColor: '#7c3aed', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 12 },
  analyzeBtnDisabled: { opacity: 0.5 },
  analyzeBtnText: { color: '#fff', fontWeight: '700' },
  result: { marginTop: 20 },
  score: { color: '#f59e0b', fontSize: 24, fontWeight: '900' },
  summary: { color: '#ccc', fontSize: 14, marginTop: 4 },
  issue: { padding: 10, borderLeftWidth: 3, borderLeftColor: '#f44336', backgroundColor: '#1a1a2e', marginTop: 8, borderRadius: 4 },
  severity: { fontSize: 11, fontWeight: '700' },
  issueText: { color: '#ddd', fontSize: 13, marginTop: 2 },
  rule: { color: '#666', fontSize: 11, marginTop: 2 },
});
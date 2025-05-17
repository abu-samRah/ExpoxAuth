import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { useTheme } from '../lib/theme/useTheme';
import { useAuth } from '../hooks/useAuth';

export function SettingsMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark, toggleTheme, colors } = useTheme();
  const { signOut } = useAuth();
  const scaleAnim = new Animated.Value(0);

  const showMenu = () => {
    setIsVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const hideMenu = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };

  const handleThemeToggle = () => {
    toggleTheme();
    hideMenu();
  };

  const handleSignOut = () => {
    signOut();
    hideMenu();
  };

  return (
    <>
      <TouchableOpacity
        onPress={showMenu}
        style={[styles.menuButton, { backgroundColor: colors.buttonBackground }]}>
        <Text style={[styles.menuButtonText, { color: colors.buttonText }]}>⋮</Text>
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="fade" onRequestClose={hideMenu}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={hideMenu}>
          <Animated.View
            style={[
              styles.menuContainer,
              {
                backgroundColor: colors.card,
                transform: [{ scale: scaleAnim }],
              },
            ]}>
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={handleThemeToggle}>
              <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>
                {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={handleSignOut}>
              <Text style={[styles.menuItemText, { color: colors.errorText }]}>Sign Out</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  menuButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

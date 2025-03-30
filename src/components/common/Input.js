import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize = 'none',
  keyboardType = 'default',
  error,
  touched,
  icon,
  onBlur,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  disabled = false,
  ...rest
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: disabled ? theme.colors.lightGrey : theme.colors.inputBackground,
            borderColor: isFocused 
              ? theme.colors.primary 
              : error && touched 
              ? theme.colors.error 
              : theme.colors.border,
            borderWidth: isFocused || (error && touched) ? 1.5 : 1,
            height: multiline ? 24 * numberOfLines + 24 : 56,
          },
        ]}
      >
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={
              isFocused
                ? theme.colors.primary
                : error && touched
                ? theme.colors.error
                : theme.colors.grey
            }
            style={styles.icon}
          />
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={!disabled}
          style={[
            styles.input,
            {
              color: theme.colors.textPrimary,
              fontFamily: 'poppins-regular',
              textAlignVertical: multiline ? 'top' : 'center',
            },
            icon && { paddingLeft: 40 },
            secureTextEntry && { paddingRight: 50 },
            inputStyle,
          ]}
          {...rest}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <MaterialCommunityIcons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={24}
              color={theme.colors.grey}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && touched && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    position: 'absolute',
    left: 12,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;

import { useSelector } from 'react-redux';
import { lightColors, darkColors } from '../theme';

export default function useTheme() {
  const mode = useSelector((s) => s.theme.mode);
  const isDark = mode === 'dark';
  return { colors: isDark ? darkColors : lightColors, isDark };
}
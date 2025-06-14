
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Theme, themes } from '@/lib/themes';
import { CheckCircle } from 'lucide-react';

interface ThemeSelectorProps {
  activeTheme: Theme | null;
  onThemeSelect: (theme: Theme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ activeTheme, onThemeSelect }) => {
  const groupedThemes = themes.reduce((acc, theme) => {
    const category = theme.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(theme);
    return acc;
  }, {} as Record<string, Theme[]>);

  return (
    <Card className="p-4 bg-white/50 backdrop-blur-sm border-white/30">
      <h3 className="text-sm font-medium text-gray-700 mb-3">主题配色</h3>
      <div className="space-y-4">
        {Object.entries(groupedThemes).map(([category, themeList]) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-gray-500 mb-2">{category}</h4>
            <div className="space-y-2">
              {themeList.map((theme) => (
                <div
                  key={theme.name}
                  onClick={() => onThemeSelect(theme)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeTheme?.name === theme.name
                      ? 'bg-white/70 shadow-md ring-2 ring-indigo-500/20'
                      : 'hover:bg-white/50'
                  }`}
                >
                  <div className="flex-shrink-0 flex items-center gap-1">
                    {Object.values(theme.palette).slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-5 h-5 rounded-full border border-gray-200/50"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700 flex-1">{theme.name}</span>
                  {activeTheme?.name === theme.name && (
                    <CheckCircle className="w-5 h-5 text-indigo-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

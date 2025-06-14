
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

interface DoubaoApiConfigProps {
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
}

export const DoubaoApiConfig: React.FC<DoubaoApiConfigProps> = ({
  apiKey,
  onApiKeyChange,
}) => {
  return (
    <Card className="p-4 bg-white/50 backdrop-blur-sm border-white/30">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-gray-600" />
          <Label htmlFor="api-key" className="text-sm font-medium text-gray-700">
            豆包 API Key
          </Label>
        </div>
        <Input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="输入您的豆包API密钥"
          className="bg-white/70 border-white/30 focus:bg-white/90 transition-all duration-300"
        />
        <p className="text-xs text-gray-500">
          当前使用预设密钥，您可以替换为自己的API密钥
        </p>
      </div>
    </Card>
  );
};

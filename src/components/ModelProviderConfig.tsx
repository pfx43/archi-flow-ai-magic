
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModelProviderConfigProps {
  modelProvider: 'doubao' | 'openrouter';
  setModelProvider: (provider: 'doubao' | 'openrouter') => void;
  doubaoApiKey: string;
  onDoubaoApiKeyChange: (key: string) => void;
  openRouterApiKey: string;
  onOpenRouterApiKeyChange: (key: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const openRouterModels = [
    "openai/gpt-4o",
    "openai/gpt-4-turbo",
    "google/gemini-pro-1.5",
    "anthropic/claude-3-opus",
    "anthropic/claude-3.5-sonnet"
];

export const ModelProviderConfig: React.FC<ModelProviderConfigProps> = ({
  modelProvider,
  setModelProvider,
  doubaoApiKey,
  onDoubaoApiKeyChange,
  openRouterApiKey,
  onOpenRouterApiKeyChange,
  selectedModel,
  setSelectedModel
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">模型配置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="model-provider">模型提供商</Label>
          <Select
            value={modelProvider}
            onValueChange={(value) => setModelProvider(value as 'doubao' | 'openrouter')}
          >
            <SelectTrigger id="model-provider">
              <SelectValue placeholder="选择模型提供商" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="doubao">豆包大模型</SelectItem>
              <SelectItem value="openrouter">OpenRouter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {modelProvider === 'doubao' && (
          <div>
            <Label htmlFor="doubao-api-key">豆包 API Key</Label>
            <Input
              id="doubao-api-key"
              type="password"
              placeholder="请输入豆包 API Key"
              value={doubaoApiKey}
              onChange={(e) => onDoubaoApiKeyChange(e.target.value)}
            />
          </div>
        )}

        {modelProvider === 'openrouter' && (
          <>
            <div>
              <Label htmlFor="openrouter-api-key">OpenRouter API Key</Label>
              <Input
                id="openrouter-api-key"
                type="password"
                placeholder="请输入 OpenRouter API Key"
                value={openRouterApiKey}
                onChange={(e) => onOpenRouterApiKeyChange(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="openrouter-model">选择模型</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger id="openrouter-model">
                  <SelectValue placeholder="选择一个模型" />
                </SelectTrigger>
                <SelectContent>
                  {openRouterModels.map(model => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

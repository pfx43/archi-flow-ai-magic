
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
  language: 'zh' | 'en';
  setLanguage: (language: 'zh' | 'en') => void;
}

const openRouterModels = [
    "google/gemini-2.5-flash-preview-05-20",
    "google/gemini-2.5-pro-preview-06-05",
    "anthropic/claude-4-sonnet-20250522",
    "openai/chatgpt-4o-latest",
    "deepseek/deepseek-r1-0528:free",
    "qwen/qwen3-30b-a3b:free"
];

export const ModelProviderConfig: React.FC<ModelProviderConfigProps> = ({
  modelProvider,
  setModelProvider,
  doubaoApiKey,
  onDoubaoApiKeyChange,
  openRouterApiKey,
  onOpenRouterApiKeyChange,
  selectedModel,
  setSelectedModel,
  language,
  setLanguage
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

        <div>
          <Label htmlFor="language">架构图语言</Label>
          <Select value={language} onValueChange={(value) => setLanguage(value as 'zh' | 'en')}>
            <SelectTrigger id="language">
              <SelectValue placeholder="选择语言" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="en">English</SelectItem>
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

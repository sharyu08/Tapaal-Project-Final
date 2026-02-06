import React from 'react';
import { Brain, Lightbulb, X, Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ContentSuggestion {
    type: 'subject' | 'description' | 'recipient' | 'priority';
    suggestion: string;
    confidence: number;
    reason: string;
    basedOn: string;
}

interface AIContentSuggestionsProps {
    suggestions: ContentSuggestion[];
    onApplySuggestion: (type: string, suggestion: string) => void;
    onDismiss?: () => void;
}

export function AIContentSuggestions({
    suggestions,
    onApplySuggestion,
    onDismiss
}: AIContentSuggestionsProps) {
    if (suggestions.length === 0) return null;

    const getSuggestionIcon = (type: string) => {
        switch (type) {
            case 'subject': return '📝';
            case 'description': return '📄';
            case 'recipient': return '👤';
            case 'priority': return '⭐';
            default: return '💡';
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.9) return 'bg-green-100 text-green-800';
        if (confidence >= 0.7) return 'bg-blue-100 text-blue-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    return (
        <Card className="border-l-4 border-blue-200 bg-blue-50">
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-semibold text-blue-900">AI Content Suggestions</h4>
                            <Badge className="bg-blue-100 text-blue-800">
                                Based on previous data
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} className="bg-white rounded-lg p-3 border border-blue-100">
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm capitalize">{suggestion.type}</span>
                                                <Badge className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}>
                                                    {Math.round(suggestion.confidence * 100)}% confidence
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-1">{suggestion.suggestion}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Lightbulb className="w-3 h-3" />
                                                <span>{suggestion.reason}</span>
                                                <span>•</span>
                                                <span>Based on: {suggestion.basedOn}</span>
                                            </div>
                                            <div className="mt-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onApplySuggestion(suggestion.type, suggestion.suggestion)}
                                                    className="text-xs"
                                                >
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 mt-3">
                            <Button variant="ghost" size="sm" onClick={onDismiss}>
                                <X className="w-4 h-4 mr-1" />
                                Dismiss
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

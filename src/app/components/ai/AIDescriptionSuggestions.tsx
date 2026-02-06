import React, { useState } from 'react';
import { Lightbulb, Copy, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DescriptionSuggestion } from '../../services/ai-service';

interface AIDescriptionSuggestionsProps {
    suggestions: DescriptionSuggestion[];
    onSelectSuggestion?: (suggestion: string) => void;
    onDismiss?: () => void;
}

export function AIDescriptionSuggestions({
    suggestions,
    onSelectSuggestion,
    onDismiss
}: AIDescriptionSuggestionsProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    if (suggestions.length === 0) return null;

    const handleCopySuggestion = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return 'bg-green-50 border-green-200 text-green-800';
        if (confidence >= 0.6) return 'bg-blue-50 border-blue-200 text-blue-800';
        return 'bg-gray-50 border-gray-200 text-gray-800';
    };

    const getConfidenceLabel = (confidence: number) => {
        if (confidence >= 0.8) return 'High Match';
        if (confidence >= 0.6) return 'Good Match';
        return 'Possible Match';
    };

    return (
        <Card className="border-l-4 border-blue-200">
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">AI Description Suggestions</h4>
                            {onDismiss && (
                                <Button variant="ghost" size="sm" onClick={onDismiss}>
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                            Based on your subject, here are some professional government-style descriptions:
                        </p>

                        <div className="space-y-3">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className={`border rounded-lg p-3 ${getConfidenceColor(suggestion.confidence)}`}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Badge className={getConfidenceColor(suggestion.confidence)}>
                                                {getConfidenceLabel(suggestion.confidence)} ({Math.round(suggestion.confidence * 100)}%)
                                            </Badge>
                                            <Badge className="text-xs border border-gray-300">
                                                {suggestion.category}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-1">
                                            {onSelectSuggestion && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onSelectSuggestion(suggestion.text)}
                                                    className="h-8 px-2"
                                                >
                                                    Use This
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCopySuggestion(suggestion.text, index)}
                                                className="h-8 px-2"
                                            >
                                                {copiedIndex === index ? 'Copied!' : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm leading-relaxed">
                                        {suggestion.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                            💡 Tip: Click "Use This" to apply the suggestion or "Copy" to copy to clipboard
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

import React, { useState } from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PriorityResult } from '../../services/ai-service';

interface AIPrioritySuggestionProps {
    priorityResult: PriorityResult;
    onApplyPriority?: (priority: string) => void;
    onDismiss?: () => void;
}

export function AIPrioritySuggestion({
    priorityResult,
    onApplyPriority,
    onDismiss
}: AIPrioritySuggestionProps) {
    const [isApplied, setIsApplied] = useState(false);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'bg-red-50 border-red-200 text-red-800';
            case 'High': return 'bg-orange-50 border-orange-200 text-orange-800';
            case 'Medium': return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'Low': return 'bg-gray-50 border-gray-200 text-gray-800';
            default: return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'Critical': return <AlertCircle className="w-4 h-4" />;
            case 'High': return <TrendingUp className="w-4 h-4" />;
            case 'Medium': return <Brain className="w-4 h-4" />;
            case 'Low': return <CheckCircle className="w-4 h-4" />;
            default: return <Brain className="w-4 h-4" />;
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return 'text-green-600';
        if (confidence >= 0.6) return 'text-yellow-600';
        return 'text-red-600';
    };

    const handleApplyPriority = () => {
        if (onApplyPriority) {
            onApplyPriority(priorityResult.priority);
            setIsApplied(true);
        }
    };

    if (isApplied) return null;

    return (
        <Card className={`border-l-4 ${getPriorityColor(priorityResult.priority)}`}>
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">AI Priority Suggestion</h4>
                            <Badge className={getPriorityColor(priorityResult.priority)}>
                                {getPriorityIcon(priorityResult.priority)}
                                <span className="ml-1">{priorityResult.priority}</span>
                            </Badge>
                            <span className={`text-sm font-medium ${getConfidenceColor(priorityResult.confidence)}`}>
                                {Math.round(priorityResult.confidence * 100)}% confidence
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                            {priorityResult.reason}
                        </p>

                        {priorityResult.keywords.length > 0 && (
                            <div className="mb-3">
                                <span className="text-sm font-medium">Detected keywords: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {priorityResult.keywords.map((keyword, index) => (
                                        <Badge key={index} className="text-xs bg-gray-100 text-gray-700">
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2">
                            {onApplyPriority && (
                                <Button size="sm" onClick={handleApplyPriority}>
                                    Apply Suggestion
                                </Button>
                            )}
                            {onDismiss && (
                                <Button variant="outline" size="sm" onClick={onDismiss}>
                                    Dismiss
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

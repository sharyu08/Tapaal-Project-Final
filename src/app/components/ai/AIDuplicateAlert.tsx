import React from 'react';
import { AlertTriangle, Eye, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DuplicateResult } from '../../services/ai-service';

interface AIDuplicateAlertProps {
    duplicateResult: DuplicateResult;
    onViewDuplicate?: () => void;
    onDismiss?: () => void;
}

export function AIDuplicateAlert({
    duplicateResult,
    onViewDuplicate,
    onDismiss
}: AIDuplicateAlertProps) {
    if (!duplicateResult.isDuplicate) return null;

    const getSimilarityColor = (similarity: number) => {
        if (similarity >= 0.9) return 'bg-red-50 border-red-200 text-red-800';
        if (similarity >= 0.8) return 'bg-orange-50 border-orange-200 text-orange-800';
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    };

    const getSimilarityLabel = (similarity: number) => {
        if (similarity >= 0.9) return 'Very High';
        if (similarity >= 0.8) return 'High';
        return 'Medium';
    };

    return (
        <Card className={`border-l-4 ${getSimilarityColor(duplicateResult.similarity)}`}>
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">Potential Duplicate Detected</h4>
                            <Badge className={getSimilarityColor(duplicateResult.similarity)}>
                                {getSimilarityLabel(duplicateResult.similarity)} Match ({Math.round(duplicateResult.similarity * 100)}%)
                            </Badge>
                        </div>

                        <p className="text-sm mb-3">
                            A similar mail already exists in the system. Please review before creating a duplicate entry.
                        </p>

                        {duplicateResult.matchedMail && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="font-medium">Subject:</span>
                                        <p className="text-gray-600 truncate">{duplicateResult.matchedMail.subject}</p>
                                    </div>
                                    {duplicateResult.matchedMail.sender && (
                                        <div>
                                            <span className="font-medium">Sender:</span>
                                            <p className="text-gray-600">{duplicateResult.matchedMail.sender}</p>
                                        </div>
                                    )}
                                    {duplicateResult.matchedMail.department && (
                                        <div>
                                            <span className="font-medium">Department:</span>
                                            <p className="text-gray-600">{duplicateResult.matchedMail.department}</p>
                                        </div>
                                    )}
                                    {duplicateResult.matchedMail.priority && (
                                        <div>
                                            <span className="font-medium">Priority:</span>
                                            <p className="text-gray-600">{duplicateResult.matchedMail.priority}</p>
                                        </div>
                                    )}
                                </div>

                                {duplicateResult.matchedFields.length > 0 && (
                                    <div className="mt-2">
                                        <span className="font-medium text-sm">Matched fields: </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {duplicateResult.matchedFields.map((field, index) => (
                                                <Badge key={index} className="text-xs bg-gray-100 text-gray-700">
                                                    {field}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-2">
                            {onViewDuplicate && (
                                <Button variant="outline" size="sm" onClick={onViewDuplicate}>
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Existing Mail
                                </Button>
                            )}
                            {onDismiss && (
                                <Button variant="ghost" size="sm" onClick={onDismiss}>
                                    <X className="w-4 h-4 mr-1" />
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

import React from 'react';
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AnomalyResult } from '../../services/ai-service';

interface AIAnomalyAlertProps {
    anomalyResult: AnomalyResult;
    onViewDetails?: () => void;
    onDismiss?: () => void;
}

export function AIAnomalyAlert({
    anomalyResult,
    onViewDetails,
    onDismiss
}: AIAnomalyAlertProps) {
    if (!anomalyResult.isAnomaly) return null;

    const getSeverityColor = (daysDelayed: number, averageTime: number) => {
        const ratio = daysDelayed / averageTime;
        if (ratio >= 2) return 'bg-red-50 border-red-200 text-red-800';
        if (ratio >= 1.5) return 'bg-orange-50 border-orange-200 text-orange-800';
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    };

    const getSeverityLabel = (daysDelayed: number, averageTime: number) => {
        const ratio = daysDelayed / averageTime;
        if (ratio >= 2) return 'Critical';
        if (ratio >= 1.5) return 'High';
        return 'Medium';
    };

    const severityColor = getSeverityColor(anomalyResult.daysDelayed, anomalyResult.averageProcessingTime);
    const severityLabel = getSeverityLabel(anomalyResult.daysDelayed, anomalyResult.averageProcessingTime);

    return (
        <Card className={`border-l-4 ${severityColor}`}>
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">Processing Delay Detected</h4>
                            <Badge className={severityColor}>
                                {severityLabel} Priority
                            </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                            {anomalyResult.reason}
                        </p>

                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <span className="font-medium">Days Delayed:</span>
                                        <p className="text-gray-600">{anomalyResult.daysDelayed} days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <span className="font-medium">Department Average:</span>
                                        <p className="text-gray-600">{anomalyResult.averageProcessingTime} days</p>
                                    </div>
                                </div>
                                {anomalyResult.department && (
                                    <div>
                                        <span className="font-medium">Department:</span>
                                        <p className="text-gray-600">{anomalyResult.department}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Delay Ratio:</span>
                                    <span className={`font-bold ${severityColor}`}>
                                        {(anomalyResult.daysDelayed / anomalyResult.averageProcessingTime).toFixed(1)}x average time
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {onViewDetails && (
                                <Button variant="outline" size="sm" onClick={onViewDetails}>
                                    View Mail Details
                                </Button>
                            )}
                            {onDismiss && (
                                <Button variant="ghost" size="sm" onClick={onDismiss}>
                                    Dismiss Alert
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AIAnomalyAlert } from './AIAnomalyAlert';
import { aiService, AnomalyResult } from '../../services/ai-service';
import { AlertTriangle, TrendingUp, Clock, Filter } from 'lucide-react';

interface AIMonitoringDashboardProps {
    className?: string;
}

export function AIMonitoringDashboard({ className }: AIMonitoringDashboardProps) {
    const [anomalies, setAnomalies] = useState<AnomalyResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');

    // Mock data for demonstration
    const mockMails = [
        {
            id: '1',
            subject: 'Emergency Court Case Notice',
            description: 'Urgent court case requiring immediate attention',
            sender: 'Legal Department',
            department: 'Legal',
            status: 'Pending',
            priority: 'Critical',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        },
        {
            id: '2',
            subject: 'Budget Approval Request',
            description: 'Annual budget approval for next fiscal year',
            sender: 'Finance Department',
            department: 'Finance',
            status: 'Pending',
            priority: 'High',
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        },
        {
            id: '3',
            subject: 'Staff Meeting Schedule',
            description: 'Monthly staff meeting schedule',
            sender: 'HR Department',
            department: 'Human Resources',
            status: 'Pending',
            priority: 'Medium',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        }
    ];

    useEffect(() => {
        const checkAnomalies = async () => {
            setLoading(true);
            const departmentAverages = await aiService.getDepartmentAverages();

            const anomalyResults = await Promise.all(
                mockMails.map(async (mail) => {
                    const result = await aiService.detectAnomaly(mail, departmentAverages);
                    return { ...result, mailId: mail.id, mail };
                })
            );

            setAnomalies(anomalyResults.filter(result => result.isAnomaly));
            setLoading(false);
        };

        checkAnomalies();
    }, []);

    const getFilteredAnomalies = () => {
        if (filter === 'all') return anomalies;

        return anomalies.filter(anomaly => {
            const ratio = anomaly.daysDelayed / anomaly.averageProcessingTime;
            if (filter === 'critical') return ratio >= 2;
            if (filter === 'high') return ratio >= 1.5;
            if (filter === 'medium') return ratio >= 1.2;
            return true;
        });
    };

    const getAnomalyStats = () => {
        const filtered = getFilteredAnomalies();
        const critical = filtered.filter(a => a.daysDelayed / a.averageProcessingTime >= 2).length;
        const high = filtered.filter(a => {
            const ratio = a.daysDelayed / a.averageProcessingTime;
            return ratio >= 1.5 && ratio < 2;
        }).length;
        const medium = filtered.filter(a => {
            const ratio = a.daysDelayed / a.averageProcessingTime;
            return ratio >= 1.2 && ratio < 1.5;
        }).length;

        return { total: filtered.length, critical, high, medium };
    };

    if (loading) {
        return (
            <Card className={`p-6 ${className}`}>
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </Card>
        );
    }

    const stats = getAnomalyStats();
    const filteredAnomalies = getFilteredAnomalies();

    return (
        <Card className={`p-6 ${className}`}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                        <div>
                            <h3 className="text-lg font-semibold">AI Anomaly Detection</h3>
                            <p className="text-sm text-gray-600">
                                Monitor mails with unusual processing delays
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="text-sm border rounded px-2 py-1"
                        >
                            <option value="all">All Anomalies</option>
                            <option value="critical">Critical Only</option>
                            <option value="high">High & Critical</option>
                            <option value="medium">Medium+</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Total Anomalies</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium">Critical</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium">High</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium">Medium</span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
                    </div>
                </div>

                {/* Anomaly List */}
                <div className="space-y-3">
                    {filteredAnomalies.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No anomalies detected</p>
                            <p className="text-sm">All mails are processing within normal timeframes</p>
                        </div>
                    ) : (
                        filteredAnomalies.map((anomaly, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-medium">
                                                {(anomaly as any).mail?.subject || 'Unknown Subject'}
                                            </h4>
                                            <Badge className="bg-orange-100 text-orange-800">
                                                {(anomaly.daysDelayed / anomaly.averageProcessingTime).toFixed(1)}x delay
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Department:</span> {anomaly.department}
                                            </div>
                                            <div>
                                                <span className="font-medium">Days Delayed:</span> {anomaly.daysDelayed}
                                            </div>
                                            <div>
                                                <span className="font-medium">Average Time:</span> {anomaly.averageProcessingTime} days
                                            </div>
                                        </div>
                                    </div>

                                    <Button variant="outline" size="sm">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Actions */}
                {filteredAnomalies.length > 0 && (
                    <div className="flex gap-2 pt-4 border-t">
                        <Button size="sm">
                            Export Report
                        </Button>
                        <Button variant="outline" size="sm">
                            Notify Department Heads
                        </Button>
                        <Button variant="outline" size="sm">
                            Schedule Review
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}

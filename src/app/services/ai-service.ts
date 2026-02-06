// AI Service for Advanced Mail Processing Features

interface MailData {
    subject: string;
    description?: string;
    sender?: string;
    recipient?: string;
    department?: string;
    priority?: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface DuplicateResult {
    isDuplicate: boolean;
    similarity: number;
    matchedMail?: MailData;
    matchedFields: string[];
}

interface PriorityResult {
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    confidence: number;
    keywords: string[];
    reason: string;
}

interface AnomalyResult {
    isAnomaly: boolean;
    daysDelayed: number;
    averageProcessingTime: number;
    department?: string;
    reason: string;
}

interface DescriptionSuggestion {
    text: string;
    confidence: number;
    category: string;
}

interface ContentSuggestion {
    type: 'subject' | 'description' | 'recipient' | 'priority';
    suggestion: string;
    confidence: number;
    reason: string;
    basedOn: string;
}

class AIService {
    // 1. DUPLICATE FILE DETECTION
    async detectDuplicate(
        newMail: MailData,
        existingMails: MailData[],
        threshold: number = 0.8
    ): Promise<DuplicateResult> {
        let highestSimilarity = 0;
        let bestMatch: MailData | undefined;
        let matchedFields: string[] = [];

        for (const existingMail of existingMails) {
            const similarities: { field: string; score: number }[] = [];

            // Subject similarity
            if (newMail.subject && existingMail.subject) {
                const subjectSim = this.calculateStringSimilarity(
                    newMail.subject.toLowerCase(),
                    existingMail.subject.toLowerCase()
                );
                similarities.push({ field: 'subject', score: subjectSim });
            }

            // Description similarity
            if (newMail.description && existingMail.description) {
                const descSim = this.calculateStringSimilarity(
                    newMail.description.toLowerCase(),
                    existingMail.description.toLowerCase()
                );
                similarities.push({ field: 'description', score: descSim });
            }

            // Sender similarity
            if (newMail.sender && existingMail.sender) {
                const senderSim = this.calculateStringSimilarity(
                    newMail.sender.toLowerCase(),
                    existingMail.sender.toLowerCase()
                );
                similarities.push({ field: 'sender', score: senderSim });
            }

            // Calculate weighted average similarity
            const avgSimilarity = similarities.reduce((sum, sim) => sum + sim.score, 0) / similarities.length;

            if (avgSimilarity > highestSimilarity) {
                highestSimilarity = avgSimilarity;
                bestMatch = existingMail;
                matchedFields = similarities
                    .filter(sim => sim.score > threshold)
                    .map(sim => sim.field);
            }
        }

        return {
            isDuplicate: highestSimilarity > threshold,
            similarity: highestSimilarity,
            matchedMail: bestMatch,
            matchedFields
        };
    }

    // Levenshtein distance algorithm for string similarity
    private calculateStringSimilarity(str1: string, str2: string): number {
        const matrix = Array(str2.length + 1).fill(null).map(() =>
            Array(str1.length + 1).fill(null)
        );

        for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + indicator
                );
            }
        }

        const distance = matrix[str2.length][str1.length];
        const maxLength = Math.max(str1.length, str2.length);
        return maxLength === 0 ? 1 : 1 - distance / maxLength;
    }

    // 2. AI-DRIVEN PRIORITY ASSIGNMENT
    async assignPriority(content: string): Promise<PriorityResult> {
        const text = content.toLowerCase();

        // Priority keywords with weights
        const priorityKeywords = {
            critical: [
                { word: 'emergency', weight: 1.0 },
                { word: 'urgent', weight: 0.9 },
                { word: 'immediate', weight: 0.9 },
                { word: 'critical', weight: 1.0 },
                { word: 'court case', weight: 0.95 },
                { word: 'legal notice', weight: 0.9 },
                { word: 'supreme court', weight: 0.95 },
                { word: 'high court', weight: 0.9 },
                { word: 'disaster', weight: 1.0 },
                { word: 'security breach', weight: 0.95 }
            ],
            high: [
                { word: 'important', weight: 0.7 },
                { word: 'priority', weight: 0.7 },
                { word: 'asap', weight: 0.8 },
                { word: 'deadline', weight: 0.6 },
                { word: 'meeting', weight: 0.5 },
                { word: 'inspection', weight: 0.6 },
                { word: 'audit', weight: 0.6 },
                { word: 'compliance', weight: 0.6 }
            ],
            medium: [
                { word: 'review', weight: 0.4 },
                { word: 'consideration', weight: 0.3 },
                { word: 'approval', weight: 0.4 },
                { word: 'processing', weight: 0.3 },
                { word: 'verification', weight: 0.3 }
            ]
        };

        let criticalScore = 0;
        let highScore = 0;
        let mediumScore = 0;
        const foundKeywords: string[] = [];

        // Calculate scores
        const priorityKeys = Object.keys(priorityKeywords) as Array<keyof typeof priorityKeywords>;
        for (const priority of priorityKeys) {
            const keywords = priorityKeywords[priority];
            for (const { word, weight } of keywords) {
                if (text.includes(word)) {
                    foundKeywords.push(word);
                    switch (priority) {
                        case 'critical':
                            criticalScore += weight;
                            break;
                        case 'high':
                            highScore += weight;
                            break;
                        case 'medium':
                            mediumScore += weight;
                            break;
                    }
                }
            }
        }

        // Determine priority
        let priority: 'Critical' | 'High' | 'Medium' | 'Low';
        let confidence: number;
        let reason: string;

        if (criticalScore >= 0.8) {
            priority = 'Critical';
            confidence = Math.min(criticalScore, 1.0);
            reason = `Critical priority assigned due to urgent keywords: ${foundKeywords.join(', ')}`;
        } else if (highScore >= 0.5) {
            priority = 'High';
            confidence = Math.min(highScore, 1.0);
            reason = `High priority assigned due to important keywords: ${foundKeywords.join(', ')}`;
        } else if (mediumScore >= 0.3) {
            priority = 'Medium';
            confidence = Math.min(mediumScore, 1.0);
            reason = `Medium priority assigned based on content analysis`;
        } else {
            priority = 'Low';
            confidence = 0.8;
            reason = 'Low priority - no urgent indicators found';
        }

        return {
            priority,
            confidence,
            keywords: foundKeywords,
            reason
        };
    }

    // 3. ANOMALY DETECTION
    async detectAnomaly(
        mail: MailData,
        departmentAverages: { [department: string]: number }
    ): Promise<AnomalyResult> {
        if (!mail.createdAt || !mail.department || mail.status !== 'Pending') {
            return {
                isAnomaly: false,
                daysDelayed: 0,
                averageProcessingTime: 0,
                reason: 'Mail not in pending status or missing required data'
            };
        }

        const daysSinceCreation = this.getDaysDifference(mail.createdAt, new Date());
        const averageProcessingTime = departmentAverages[mail.department] || 7; // Default 7 days
        const threshold = averageProcessingTime * 1.5; // 50% above average

        const isAnomaly = daysSinceCreation > threshold;

        return {
            isAnomaly,
            daysDelayed: daysSinceCreation,
            averageProcessingTime,
            department: mail.department,
            reason: isAnomaly
                ? `Mail is ${daysSinceCreation} days old, which exceeds the department average of ${averageProcessingTime} days`
                : 'Processing time within normal range'
        };
    }

    private getDaysDifference(date1: Date, date2: Date): number {
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // 4. AI DESCRIPTION SUGGESTIONS
    async getDescriptionSuggestions(subject: string): Promise<DescriptionSuggestion[]> {
        const subjectLower = subject.toLowerCase();
        const suggestions: DescriptionSuggestion[] = [];

        // Government communication templates
        const templates = [
            {
                keywords: ['meeting', 'schedule', 'appointment'],
                templates: [
                    'This correspondence is regarding the scheduled meeting to discuss important matters. Please review the attached agenda and prepare necessary documentation.',
                    'Reference is made to the forthcoming meeting scheduled for [date]. This communication serves as official confirmation and reminder of the same.',
                    'In accordance with the administrative procedures, this letter is to confirm the meeting arrangement and to request your presence for deliberations on [topic].'
                ],
                category: 'Meeting Correspondence'
            },
            {
                keywords: ['approval', 'sanction', 'permission'],
                templates: [
                    'This application is submitted for your kind consideration and approval. The matter has been examined in detail and found to be in order as per the established guidelines.',
                    'Reference to the subject cited above, approval is requested for the proposed action. All necessary documentation has been attached for your perusal.',
                    'In compliance with the administrative procedures, this matter requires your approval before proceeding further. The proposal has been thoroughly reviewed and recommended.'
                ],
                category: 'Approval Request'
            },
            {
                keywords: ['complaint', 'grievance', 'issue'],
                templates: [
                    'This communication is to bring to your kind attention the matter mentioned in the subject. Immediate intervention is requested to resolve the issue at the earliest.',
                    'Reference to the subject, this is to formally register a complaint regarding the matter. Request for necessary action to be taken at the earliest opportunity.',
                    'In accordance with the grievance redressal mechanism, this issue is being brought to your notice for appropriate action and resolution.'
                ],
                category: 'Complaint/Grievance'
            },
            {
                keywords: ['information', 'details', 'query'],
                templates: [
                    'This communication is to request necessary information regarding the subject matter. The details are required for official record and further processing.',
                    'Reference to the subject, information is requested on the following points for administrative purposes. Your prompt response would be highly appreciated.',
                    'In order to proceed with the matter at hand, certain clarifications and information are required. This communication seeks the same for official records.'
                ],
                category: 'Information Request'
            },
            {
                keywords: ['report', 'submission', 'document'],
                templates: [
                    'This is to submit the report/document as requested in the reference cited. The same has been prepared in accordance with the prescribed format and guidelines.',
                    'Reference to the subject, the required report is hereby submitted for your kind perusal and necessary action. All relevant details have been included.',
                    'In compliance with the instructions, the requested document is being submitted. The same has been verified and found to be complete in all respects.'
                ],
                category: 'Report Submission'
            }
        ];

        // Find matching templates
        for (const template of templates) {
            const matchCount = template.keywords.filter(keyword =>
                subjectLower.includes(keyword)
            ).length;

            if (matchCount > 0) {
                const confidence = Math.min(matchCount / template.keywords.length, 1.0);

                template.templates.forEach((text, index) => {
                    suggestions.push({
                        text,
                        confidence: confidence * (1 - index * 0.1), // Slightly lower confidence for subsequent suggestions
                        category: template.category
                    });
                });
            }
        }

        // Add generic suggestions if no specific match
        if (suggestions.length === 0) {
            suggestions.push(
                {
                    text: 'This communication is regarding the matter mentioned in the subject. Necessary action may please be taken at the earliest.',
                    confidence: 0.6,
                    category: 'General Correspondence'
                },
                {
                    text: 'Reference to the subject cited above, this is to bring to your notice the matter for appropriate action and necessary follow-up.',
                    confidence: 0.5,
                    category: 'General Correspondence'
                }
            );
        }

        // Sort by confidence and return top 3
        return suggestions
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 3);
    }

    // Utility method to get department processing averages
    async getDepartmentAverages(): Promise<{ [department: string]: number }> {
        // This would typically fetch from database
        // For now, returning mock data
        return {
            'Administration': 5,
            'Finance': 7,
            'Human Resources': 4,
            'Information Technology': 3,
            'Operations': 6,
            'Legal': 8,
            'Procurement': 5,
            'Facilities': 4,
            'Public Relations': 3,
            'Audit & Compliance': 10
        };
    }

    // 5. CONTEXTUAL CONTENT SUGGESTIONS
    async getContentSuggestions(
        currentMail: {
            subject?: string;
            description?: string;
            recipient?: string;
            department?: string;
            priority?: string;
        },
        existingMails: MailData[]
    ): Promise<ContentSuggestion[]> {
        const suggestions: ContentSuggestion[] = [];

        // Analyze department patterns
        if (currentMail.department) {
            const deptMails = existingMails.filter(mail => mail.department === currentMail.department);

            if (deptMails.length > 0) {
                // Suggest common subjects for this department
                const subjectPatterns = this.analyzeCommonPatterns(deptMails.map(m => m.subject).filter(Boolean));
                if (subjectPatterns.length > 0 && !currentMail.subject) {
                    suggestions.push({
                        type: 'subject',
                        suggestion: subjectPatterns[0].pattern,
                        confidence: subjectPatterns[0].frequency,
                        reason: `Common subject pattern for ${currentMail.department}`,
                        basedOn: `${subjectPatterns[0].count} similar mails`
                    });
                }

                // Suggest typical priority for this department
                const priorityCounts = deptMails.reduce((acc, mail) => {
                    if (mail.priority) {
                        acc[mail.priority] = (acc[mail.priority] || 0) + 1;
                    }
                    return acc;
                }, {} as Record<string, number>);

                const mostCommonPriority = Object.keys(priorityCounts).reduce((a, b) =>
                    priorityCounts[a] > priorityCounts[b] ? a : b
                );

                if (mostCommonPriority && !currentMail.priority) {
                    suggestions.push({
                        type: 'priority',
                        suggestion: mostCommonPriority,
                        confidence: priorityCounts[mostCommonPriority] / deptMails.length,
                        reason: `Most common priority for ${currentMail.department}`,
                        basedOn: `${priorityCounts[mostCommonPriority]} out of ${deptMails.length} mails`
                    });
                }
            }
        }

        // Analyze recipient patterns
        if (currentMail.subject && !currentMail.recipient) {
            const similarMails = existingMails.filter(mail =>
                mail.subject && this.calculateStringSimilarity(
                    currentMail.subject.toLowerCase(),
                    mail.subject.toLowerCase()
                ) > 0.6
            );

            if (similarMails && similarMails.length > 0) {
                const recipientCounts = similarMails.reduce((acc, mail) => {
                    if (mail.recipient) {
                        acc[mail.recipient] = (acc[mail.recipient] || 0) + 1;
                    }
                    return acc;
                }, {} as Record<string, number>);

                const mostCommonRecipient = Object.keys(recipientCounts).reduce((a, b) =>
                    recipientCounts[a] > recipientCounts[b] ? a : b
                );

                if (mostCommonRecipient) {
                    suggestions.push({
                        type: 'recipient',
                        suggestion: mostCommonRecipient,
                        confidence: recipientCounts[mostCommonRecipient] / similarMails.length,
                        reason: 'Common recipient for similar subjects',
                        basedOn: `${recipientCounts[mostCommonRecipient]} similar mails`
                    });
                }
            }
        }

        // Suggest description based on subject
        if (currentMail.subject && !currentMail.description) {
            const descSuggestions = await this.getDescriptionSuggestions(currentMail.subject);
            if (descSuggestions.length > 0) {
                suggestions.push({
                    type: 'description',
                    suggestion: descSuggestions[0].text,
                    confidence: descSuggestions[0].confidence,
                    reason: 'Suggested description based on subject content',
                    basedOn: 'Subject analysis'
                });
            }
        }

        return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
    }

    private analyzeCommonPatterns(strings: string[]): Array<{ pattern: string; frequency: number; count: number }> {
        const patterns: Record<string, number> = {};

        strings.forEach(str => {
            // Extract common patterns (first few words, common phrases)
            const words = str.toLowerCase().split(' ');
            const pattern = words.slice(0, 3).join(' ');
            patterns[pattern] = (patterns[pattern] || 0) + 1;
        });

        return Object.keys(patterns)
            .map(pattern => ({
                pattern,
                frequency: patterns[pattern] / strings.length,
                count: patterns[pattern]
            }))
            .sort((a, b) => b.frequency - a.frequency);
    }
}

export const aiService = new AIService();
export type {
    MailData,
    DuplicateResult,
    PriorityResult,
    AnomalyResult,
    DescriptionSuggestion,
    ContentSuggestion
};

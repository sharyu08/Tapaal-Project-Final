export interface Mail {
    id: string;
    trackingId: string;
    // Common properties
    date: string;
    deliveryMode: string;
    status: string;
    priority: string;
    dueDate: string;
    attachments: number;
    cost?: number;
    createdAt: string;
    updatedAt: string;

    // Outward mail properties
    subject?: string;
    receiver?: string;
    sentBy?: string;
    department?: string;

    // Inward mail properties
    receivedBy?: string;
    handoverTo?: string;
    sender?: string;
    type?: string;
    details?: string;
    referenceDetails?: string;
}

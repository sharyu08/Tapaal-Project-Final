import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:./dev.db"
        }
    }
});

// System Overview
router.get('/system/overview', async (req, res) => {
    try {
        const [
            totalInwardMails,
            totalOutwardMails,
            totalUsers,
            totalDepartments,
            totalTrackingEvents,
            activeUsers,
            activeDepartments,
            pendingMails,
            completedMails,
            deliveredMails
        ] = await Promise.all([
            prisma.inwardMail.count(),
            prisma.outwardMail.count(),
            prisma.user.count(),
            prisma.department.count(),
            prisma.trackingEvent.count(),
            prisma.user.count({ where: { status: 'Active' } }),
            prisma.department.count({ where: { status: 'Active' } }),
            prisma.inwardMail.count({ where: { status: 'PENDING' } }),
            prisma.inwardMail.count({ where: { status: 'COMPLETED' } }),
            prisma.outwardMail.count({ where: { status: 'DELIVERED' } })
        ]);

        res.json({
            success: true,
            data: {
                totalInwardMails,
                totalOutwardMails,
                totalUsers,
                totalDepartments,
                totalTrackingEvents,
                activeUsers,
                activeDepartments,
                pendingMails,
                completedMails,
                deliveredMails,
                totalMails: totalInwardMails + totalOutwardMails
            }
        });
    } catch (error) {
        console.error('Error getting system overview:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Inward Mails
router.get('/mails/inward', async (req, res) => {
    try {
        const { status, department, priority } = req.query;
        const where = {};

        if (status) where.status = status;
        if (department) where.department = { name: department };
        if (priority) where.priority = priority;

        const mails = await prisma.inwardMail.findMany({
            where,
            include: {
                department: true,
                tracking: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedMails = mails.map(mail => ({
            id: mail.mailId || mail.id,
            trackingId: mail.trackingId,
            subject: mail.subject,
            details: mail.details || mail.description,
            sender: mail.sender || mail.senderName,
            date: mail.date || mail.createdAt,
            status: mail.status.toLowerCase(),
            priority: mail.priority,
            department: mail.department?.name,
            receivedBy: mail.receivedBy,
            handoverTo: mail.handoverTo,
            deliveryMode: mail.deliveryMode,
            referenceDetails: mail.referenceDetails,
            type: mail.type
        }));

        res.json({ success: true, data: formattedMails });
    } catch (error) {
        console.error('Error getting inward mails:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Outward Mails
router.get('/mails/outward', async (req, res) => {
    try {
        const { status, department, priority } = req.query;
        const where = {};

        if (status) where.status = status;
        if (department) where.department = { name: department };
        if (priority) where.priority = priority;

        const mails = await prisma.outwardMail.findMany({
            where,
            include: {
                department: true,
                tracking: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedMails = mails.map(mail => ({
            id: mail.mailId || mail.id,
            trackingId: mail.trackingId,
            subject: mail.subject,
            receiver: mail.receiver,
            date: mail.date || mail.createdAt,
            status: mail.status.toLowerCase().replace('_', '-'),
            priority: mail.priority,
            department: mail.department?.name,
            sentBy: mail.sentBy,
            deliveryMode: mail.deliveryMode,
            dueDate: mail.dueDate,
            attachments: mail.attachments,
            type: mail.type
        }));

        res.json({ success: true, data: formattedMails });
    } catch (error) {
        console.error('Error getting outward mails:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Users
router.get('/users', async (req, res) => {
    try {
        const { role, department, status } = req.query;
        const where = {};

        if (role) where.role = role;
        if (department) where.department = { name: department };
        if (status) where.status = status;

        const users = await prisma.user.findMany({
            where,
            include: {
                department: true
            },
            orderBy: { name: 'asc' }
        });

        const formattedUsers = users.map(user => ({
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department?.name,
            status: user.status
        }));

        res.json({ success: true, data: formattedUsers });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Departments
router.get('/departments', async (req, res) => {
    try {
        const { status } = req.query;
        const where = {};

        if (status) where.status = status;

        const departments = await prisma.department.findMany({
            where,
            include: {
                users: true,
                mails: true,
                outwardMails: true
            },
            orderBy: { name: 'asc' }
        });

        const formattedDepartments = departments.map(dept => ({
            id: dept.id,
            name: dept.name,
            code: dept.code,
            head: dept.head,
            status: dept.status,
            userCount: dept.users.length,
            mailCount: dept.mails.length + dept.outwardMails.length
        }));

        res.json({ success: true, data: formattedDepartments });
    } catch (error) {
        console.error('Error getting departments:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Tracking Events
router.get('/tracking', async (req, res) => {
    try {
        const { mailType, status, department } = req.query;
        const where = {};

        if (mailType) where.mailType = mailType;
        if (status) where.status = status;
        if (department) where.department = department;

        const events = await prisma.trackingEvent.findMany({
            where,
            include: {
                inwardMail: {
                    include: { department: true }
                },
                outwardMail: {
                    include: { department: true }
                },
                timeline: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedEvents = events.map(event => {
            const mail = event.inwardMail || event.outwardMail;
            return {
                id: event.eventId || event.id,
                mailId: mail?.mailId || mail?.id,
                mailType: event.mailType,
                subject: event.subject || mail?.subject,
                sender: event.sender || (event.inwardMail?.sender || event.inwardMail?.senderName),
                receiver: event.receiver || event.outwardMail?.receiver,
                currentStatus: event.currentStatus || event.status,
                priority: event.priority || mail?.priority,
                department: event.department || mail?.department?.name,
                assignedTo: event.assignedTo,
                createdAt: event.createdAt,
                lastUpdated: event.lastUpdated,
                timeline: event.timeline.map(t => ({
                    status: t.event,
                    timestamp: t.timestamp,
                    user: t.updatedBy || 'System',
                    remarks: t.remarks
                }))
            };
        });

        res.json({ success: true, data: formattedEvents });
    } catch (error) {
        console.error('Error getting tracking events:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mail Details
router.get('/mails/:mailType/:mailId', async (req, res) => {
    try {
        const { mailType, mailId } = req.params;

        if (mailType === 'inward') {
            const mail = await prisma.inwardMail.findFirst({
                where: {
                    OR: [
                        { mailId: mailId },
                        { id: mailId }
                    ]
                },
                include: {
                    department: true,
                    tracking: {
                        include: { timeline: true }
                    }
                }
            });

            if (!mail) {
                return res.status(404).json({ success: false, error: 'Mail not found' });
            }

            const mailDetails = {
                id: mail.mailId || mail.id,
                trackingId: mail.trackingId,
                subject: mail.subject,
                details: mail.details || mail.description,
                sender: mail.sender || mail.senderName,
                date: mail.date || mail.createdAt,
                status: mail.status.toLowerCase(),
                priority: mail.priority,
                department: mail.department?.name,
                receivedBy: mail.receivedBy,
                handoverTo: mail.handoverTo,
                deliveryMode: mail.deliveryMode,
                referenceDetails: mail.referenceDetails,
                type: mail.type
            };

            res.json({ success: true, data: mailDetails });
        } else if (mailType === 'outward') {
            const mail = await prisma.outwardMail.findFirst({
                where: {
                    OR: [
                        { mailId: mailId },
                        { id: mailId }
                    ]
                },
                include: {
                    department: true,
                    tracking: {
                        include: { timeline: true }
                    }
                }
            });

            if (!mail) {
                return res.status(404).json({ success: false, error: 'Mail not found' });
            }

            const mailDetails = {
                id: mail.mailId || mail.id,
                trackingId: mail.trackingId,
                subject: mail.subject,
                receiver: mail.receiver,
                date: mail.date || mail.createdAt,
                status: mail.status.toLowerCase().replace('_', '-'),
                priority: mail.priority,
                department: mail.department?.name,
                sentBy: mail.sentBy,
                deliveryMode: mail.deliveryMode,
                dueDate: mail.dueDate,
                attachments: mail.attachments,
                type: mail.type
            };

            res.json({ success: true, data: mailDetails });
        } else {
            res.status(400).json({ success: false, error: 'Invalid mail type' });
        }
    } catch (error) {
        console.error('Error getting mail details:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Tracking Details
router.get('/tracking/:trackingId', async (req, res) => {
    try {
        const { trackingId } = req.params;

        const event = await prisma.trackingEvent.findFirst({
            where: {
                OR: [
                    { eventId: trackingId },
                    { id: trackingId }
                ]
            },
            include: {
                inwardMail: {
                    include: { department: true }
                },
                outwardMail: {
                    include: { department: true }
                },
                timeline: true
            }
        });

        if (!event) {
            return res.status(404).json({ success: false, error: 'Tracking event not found' });
        }

        const mail = event.inwardMail || event.outwardMail;

        const trackingDetails = {
            id: event.eventId || event.id,
            mailId: mail?.mailId || mail?.id,
            mailType: event.mailType,
            subject: event.subject || mail?.subject,
            sender: event.sender || (event.inwardMail?.sender || event.inwardMail?.senderName),
            receiver: event.receiver || event.outwardMail?.receiver,
            currentStatus: event.currentStatus || event.status,
            priority: event.priority || mail?.priority,
            department: event.department || mail?.department?.name,
            assignedTo: event.assignedTo,
            createdAt: event.createdAt,
            lastUpdated: event.lastUpdated,
            timeline: event.timeline.map(t => ({
                status: t.event,
                timestamp: t.timestamp,
                user: t.updatedBy || 'System',
                remarks: t.remarks
            }))
        };

        res.json({ success: true, data: trackingDetails });
    } catch (error) {
        console.error('Error getting tracking details:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Department Statistics
router.get('/departments/stats', async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            include: {
                users: true,
                mails: true,
                outwardMails: true
            }
        });

        const stats = {};

        for (const dept of departments) {
            const deptInwardMails = dept.mails;
            const deptOutwardMails = dept.outwardMails;
            const deptTracking = await prisma.trackingEvent.findMany({
                where: { department: dept.name }
            });

            stats[dept.name] = {
                department: dept.name,
                head: dept.head,
                users: dept.users.length,
                inwardMails: deptInwardMails.length,
                outwardMails: deptOutwardMails.length,
                trackingEvents: deptTracking.length,
                pendingMails: deptInwardMails.filter(m => m.status === 'PENDING').length,
                completedMails: deptInwardMails.filter(m => m.status === 'COMPLETED').length
            };
        }

        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('Error getting department stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// User Activity Summary
router.get('/users/activity', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                department: true
            }
        });

        const activity = {};

        for (const user of users) {
            const userInwardMails = await prisma.inwardMail.findMany({
                where: {
                    OR: [
                        { receivedBy: user.name },
                        { handoverTo: user.name }
                    ]
                }
            });

            const userOutwardMails = await prisma.outwardMail.findMany({
                where: { sentBy: user.name }
            });

            const userTracking = await prisma.trackingEvent.findMany({
                where: { assignedTo: user.name }
            });

            activity[user.name] = {
                user: user.name,
                role: user.role,
                department: user.department?.name,
                status: user.status,
                email: user.email,
                inwardMailsHandled: userInwardMails.length,
                outwardMailsSent: userOutwardMails.length,
                trackingEvents: userTracking.length
            };
        }

        res.json({ success: true, data: activity });
    } catch (error) {
        console.error('Error getting user activity summary:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Search
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;

        const [
            inwardMails,
            outwardMails,
            users,
            departments,
            tracking
        ] = await Promise.all([
            prisma.inwardMail.findMany({
                where: {
                    OR: [
                        { subject: { contains: query, mode: 'insensitive' } },
                        { sender: { contains: query, mode: 'insensitive' } },
                        { senderName: { contains: query, mode: 'insensitive' } },
                        { details: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { trackingId: { contains: query, mode: 'insensitive' } },
                        { mailId: { contains: query, mode: 'insensitive' } }
                    ]
                },
                include: { department: true }
            }),
            prisma.outwardMail.findMany({
                where: {
                    OR: [
                        { subject: { contains: query, mode: 'insensitive' } },
                        { receiver: { contains: query, mode: 'insensitive' } },
                        { trackingId: { contains: query, mode: 'insensitive' } },
                        { mailId: { contains: query, mode: 'insensitive' } }
                    ]
                },
                include: { department: true }
            }),
            prisma.user.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                        { role: { contains: query, mode: 'insensitive' } }
                    ]
                },
                include: { department: true }
            }),
            prisma.department.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { code: { contains: query, mode: 'insensitive' } },
                        { head: { contains: query, mode: 'insensitive' } }
                    ]
                }
            }),
            prisma.trackingEvent.findMany({
                where: {
                    OR: [
                        { subject: { contains: query, mode: 'insensitive' } },
                        { eventId: { contains: query, mode: 'insensitive' } },
                        { currentStatus: { contains: query, mode: 'insensitive' } }
                    ]
                }
            })
        ]);

        const results = {
            inwardMails: inwardMails.map(mail => ({
                ...mail,
                department: mail.department?.name
            })),
            outwardMails: outwardMails.map(mail => ({
                ...mail,
                department: mail.department?.name
            })),
            users: users.map(user => ({
                ...user,
                department: user.department?.name
            })),
            departments,
            tracking
        };

        res.json({ success: true, data: results });
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all mails (both inward and outward)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'inward' or 'outward'
        const department = searchParams.get('department');
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const search = searchParams.get('search');

        let whereClause: any = {};

        if (type) {
            if (type === 'inward') {
                const inwardMails = await prisma.inwardMail.findMany({
                    where: {
                        ...(department && { department: { name: { contains: department, mode: 'insensitive' } } }),
                        ...(status && { status: { contains: status, mode: 'insensitive' } }),
                        ...(priority && { priority: { contains: priority, mode: 'insensitive' } }),
                        ...(search && {
                            OR: [
                                { subject: { contains: search, mode: 'insensitive' } },
                                { sender: { contains: search, mode: 'insensitive' } },
                                { description: { contains: search, mode: 'insensitive' } }
                            ]
                        })
                    },
                    include: {
                        department: true,
                        tracking: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });

                return NextResponse.json({ data: inwardMails, type: 'inward' });
            } else if (type === 'outward') {
                const outwardMails = await prisma.outwardMail.findMany({
                    where: {
                        ...(department && { department: { name: { contains: department, mode: 'insensitive' } } }),
                        ...(status && { status: { contains: status, mode: 'insensitive' } }),
                        ...(priority && { priority: { contains: priority, mode: 'insensitive' } }),
                        ...(search && {
                            OR: [
                                { subject: { contains: search, mode: 'insensitive' } },
                                { receiver: { contains: search, mode: 'insensitive' } },
                                { description: { contains: search, mode: 'insensitive' } }
                            ]
                        })
                    },
                    include: {
                        department: true,
                        tracking: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                });

                return NextResponse.json({ data: outwardMails, type: 'outward' });
            }
        }

        // Return all mails if no type specified
        const [inwardMails, outwardMails] = await Promise.all([
            prisma.inwardMail.findMany({
                include: { department: true },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.outwardMail.findMany({
                include: { department: true },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return NextResponse.json({
            inward: inwardMails,
            outward: outwardMails
        });

    } catch (error) {
        console.error('Error fetching mails:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mails' },
            { status: 500 }
        );
    }
}

// POST new mail (either inward or outward)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, ...mailData } = body;

        if (!type || (type !== 'inward' && type !== 'outward')) {
            return NextResponse.json(
                { error: 'Invalid mail type. Must be "inward" or "outward"' },
                { status: 400 }
            );
        }

        let newMail;

        if (type === 'inward') {
            // Generate mail ID
            const mailCount = await prisma.inwardMail.count();
            const mailId = `INW-${new Date().getFullYear()}-${String(mailCount + 1).padStart(3, '0')}`;

            newMail = await prisma.inwardMail.create({
                data: {
                    ...mailData,
                    mailId,
                    deptId: mailData.deptId || mailData.departmentId
                },
                include: {
                    department: true
                }
            });

            // Create initial tracking event
            await prisma.trackingEvent.create({
                data: {
                    inwardMailId: newMail.id,
                    eventId: `TRK-INW-${Date.now()}`,
                    mailType: 'Inward',
                    status: newMail.status,
                    subject: newMail.subject,
                    sender: newMail.sender,
                    priority: newMail.priority,
                    department: newMail.department?.name,
                    updatedBy: 'System'
                }
            });
        } else {
            // Generate mail ID
            const mailCount = await prisma.outwardMail.count();
            const mailId = `OUT-${new Date().getFullYear()}-${String(mailCount + 1).padStart(3, '0')}`;

            newMail = await prisma.outwardMail.create({
                data: {
                    ...mailData,
                    mailId,
                    deptId: mailData.deptId || mailData.departmentId
                },
                include: {
                    department: true
                }
            });

            // Create initial tracking event
            await prisma.trackingEvent.create({
                data: {
                    outwardMailId: newMail.id,
                    eventId: `TRK-OUT-${Date.now()}`,
                    mailType: 'Outward',
                    status: newMail.status,
                    subject: newMail.subject,
                    receiver: newMail.receiver,
                    priority: newMail.priority,
                    department: newMail.department?.name,
                    updatedBy: 'System'
                }
            });
        }

        return NextResponse.json({ data: newMail, type }, { status: 201 });

    } catch (error) {
        console.error('Error creating mail:', error);
        return NextResponse.json(
            { error: 'Failed to create mail' },
            { status: 500 }
        );
    }
}

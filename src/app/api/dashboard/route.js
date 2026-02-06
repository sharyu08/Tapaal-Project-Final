import { NextRequest, NextResponse } from 'next/server';
import { addSampleData, getDashboardData, getRealDashboardData } from '../../../services/database';

export async function GET(request) {
    try {
        // Get real dashboard data
        const realData = await getRealDashboardData();
        const stats = await getDashboardData();

        return NextResponse.json({
            success: true,
            data: {
                stats,
                realData
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        if (body.action === 'addSampleData') {
            const result = await addSampleData();

            // After adding data, fetch updated dashboard data
            const realData = await getRealDashboardData();
            const stats = await getDashboardData();

            return NextResponse.json({
                success: result.success,
                message: result.message,
                verification: result.verification,
                data: {
                    stats,
                    realData
                }
            });
        }

        return NextResponse.json(
            { success: false, error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Error in dashboard API:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

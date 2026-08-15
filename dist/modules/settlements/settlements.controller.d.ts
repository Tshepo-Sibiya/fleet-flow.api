import { SettlementsService } from './settlements.service';
import { CalculateSettlementDto, CreateSettlementDto } from './dto/settlement.dto';
export declare class SettlementsController {
    private readonly settlementsService;
    constructor(settlementsService: SettlementsService);
    calculatePreview(req: any, dto: CalculateSettlementDto): Promise<{
        driverId: string;
        driverName: string;
        ownerId: string;
        vehicleId: import("mongoose").Types.ObjectId;
        vehicleDetails: string;
        weekStartDate: string;
        weekEndDate: string;
        uberGrossPayout: number;
        fixedCheckInAmount: number;
        openingDebtBalance: number;
        approvedAdvancesThisWeek: number;
        totalDebtOwed: number;
        requestedDebtDeduction: number;
        actualDebtDeducted: number;
        netDriverPayout: number;
        closingDebtBalance: number;
    }>;
    createSettlement(req: any, dto: CreateSettlementDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/weekly-settlement.schema").WeeklySettlementDocument, {}, {}> & import("../../schemas/weekly-settlement.schema").WeeklySettlement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/weekly-settlement.schema").WeeklySettlementDocument, {}, {}> & import("../../schemas/weekly-settlement.schema").WeeklySettlement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getFinancialSummary(req: any): Promise<{
        currentWeek: {
            weekStartDate: string;
            grossPayout: number;
            ownerShare: number;
            driverNetPayout: number;
        };
        currentMonth: {
            monthYear: string;
            grossPayout: number;
            ownerTotalEarned: number;
            driverTotalPayout: number;
            totalDebtCollected: number;
            settlementCount: number;
        };
    }>;
}

import { Model } from 'mongoose';
import { WeeklySettlement, WeeklySettlementDocument } from '../../schemas/weekly-settlement.schema';
import { UserDocument } from '../../schemas/user.schema';
import { VehicleDocument } from '../../schemas/vehicle.schema';
import { CheckInRatesService } from '../check-in-rates/check-in-rates.service';
import { DriversService } from '../drivers/drivers.service';
import { CalculateSettlementDto, CreateSettlementDto } from './dto/settlement.dto';
export declare class SettlementsService {
    private settlementModel;
    private userModel;
    private vehicleModel;
    private checkInRatesService;
    private driversService;
    constructor(settlementModel: Model<WeeklySettlementDocument>, userModel: Model<UserDocument>, vehicleModel: Model<VehicleDocument>, checkInRatesService: CheckInRatesService, driversService: DriversService);
    calculatePreview(ownerId: string, dto: CalculateSettlementDto): Promise<{
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
    createSettlement(ownerId: string, dto: CreateSettlementDto): Promise<import("mongoose").Document<unknown, {}, WeeklySettlementDocument, {}, {}> & WeeklySettlement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAllForUser(user: any): Promise<(import("mongoose").Document<unknown, {}, WeeklySettlementDocument, {}, {}> & WeeklySettlement & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getFinancialSummary(user: any): Promise<{
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
    private getMondayString;
    private getSundayString;
}

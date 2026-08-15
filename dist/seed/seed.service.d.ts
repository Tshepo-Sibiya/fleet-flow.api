import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { VehicleDocument } from '../schemas/vehicle.schema';
import { CheckInRateDocument } from '../schemas/check-in-rate.schema';
import { AdvanceRequestDocument } from '../schemas/advance-request.schema';
import { WeeklySettlementDocument } from '../schemas/weekly-settlement.schema';
export declare class SeedService {
    private userModel;
    private vehicleModel;
    private checkInRateModel;
    private advanceModel;
    private settlementModel;
    constructor(userModel: Model<UserDocument>, vehicleModel: Model<VehicleDocument>, checkInRateModel: Model<CheckInRateDocument>, advanceModel: Model<AdvanceRequestDocument>, settlementModel: Model<WeeklySettlementDocument>);
    seed(): Promise<void>;
    private getMondayString;
    private getSundayString;
}

import { Model } from 'mongoose';
import { CheckInRate, CheckInRateDocument } from '../../schemas/check-in-rate.schema';
import { UserDocument } from '../../schemas/user.schema';
import { SetCheckInRateDto } from './dto/check-in-rate.dto';
export declare class CheckInRatesService {
    private checkInRateModel;
    private userModel;
    constructor(checkInRateModel: Model<CheckInRateDocument>, userModel: Model<UserDocument>);
    setRate(ownerId: string, dto: SetCheckInRateDto): Promise<import("mongoose").Document<unknown, {}, CheckInRateDocument, {}, {}> & CheckInRate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getRateForDriver(driverId: string, weekStartDate?: string): Promise<{
        driverId: string;
        effectiveWeekStart: string;
        weeklyAmount: number;
        isLocked: boolean;
    }>;
    private getMondayString;
}

import { Model } from 'mongoose';
import { AdvanceRequest, AdvanceRequestDocument } from '../../schemas/advance-request.schema';
import { UserDocument } from '../../schemas/user.schema';
import { CreateAdvanceRequestDto, UpdateAdvanceStatusDto } from './dto/advance.dto';
export declare class AdvancesService {
    private advanceModel;
    private userModel;
    constructor(advanceModel: Model<AdvanceRequestDocument>, userModel: Model<UserDocument>);
    createRequest(driverId: string, dto: CreateAdvanceRequestDto): Promise<import("mongoose").Document<unknown, {}, AdvanceRequestDocument, {}, {}> & AdvanceRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAllForUser(user: any): Promise<(import("mongoose").Document<unknown, {}, AdvanceRequestDocument, {}, {}> & AdvanceRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateStatus(id: string, ownerId: string, dto: UpdateAdvanceStatusDto): Promise<import("mongoose").Document<unknown, {}, AdvanceRequestDocument, {}, {}> & AdvanceRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}

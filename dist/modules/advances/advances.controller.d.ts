import { AdvancesService } from './advances.service';
import { CreateAdvanceRequestDto, UpdateAdvanceStatusDto } from './dto/advance.dto';
export declare class AdvancesController {
    private readonly advancesService;
    constructor(advancesService: AdvancesService);
    create(req: any, dto: CreateAdvanceRequestDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/advance-request.schema").AdvanceRequestDocument, {}, {}> & import("../../schemas/advance-request.schema").AdvanceRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/advance-request.schema").AdvanceRequestDocument, {}, {}> & import("../../schemas/advance-request.schema").AdvanceRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateStatus(req: any, id: string, dto: UpdateAdvanceStatusDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/advance-request.schema").AdvanceRequestDocument, {}, {}> & import("../../schemas/advance-request.schema").AdvanceRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}

import { AdvanceStatus } from '../../../schemas/advance-request.schema';
export declare class CreateAdvanceRequestDto {
    amount: number;
    reason: string;
}
export declare class UpdateAdvanceStatusDto {
    status: AdvanceStatus;
    notes?: string;
}

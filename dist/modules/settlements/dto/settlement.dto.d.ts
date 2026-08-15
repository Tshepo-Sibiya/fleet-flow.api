export declare class CalculateSettlementDto {
    driverId: string;
    uberGrossPayout: number;
    requestedDebtDeduction?: number;
    weekStartDate?: string;
}
export declare class CreateSettlementDto extends CalculateSettlementDto {
    notes?: string;
}

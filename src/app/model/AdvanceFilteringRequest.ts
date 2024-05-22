export class AdvanceFilteringRequest {
  sector!:number;
  startDate!:Date;
  endDate!: Date;
  maxDailyPrice!:number;
  maxMonthlyPrice!:number;
  indefinitePeriod!:boolean;
}

import {AdminListingDecision} from "./AdminListingDecision";

export class AdminUpdateListingRequest {
  message!: string;
  adminListingDecision!: AdminListingDecision;

  constructor(message: string, adminListingDecision: AdminListingDecision) {
    this.message = message;
    this.adminListingDecision = adminListingDecision;
  }
}

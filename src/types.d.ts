export interface Campaign {
  id: number;
  user_id: number;
  name: string;
  description: string;
  target_amount: number;
  collected_amount: number;
  start_date: string;
  end_date: string;
  image_url?: string;
  evidence_url?: string;
  evidence_uploaded_at?: string;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
}

export enum CampaignStatus {
  PendingVerification = "PendingVerification",
  Active = "Active",
  Rejected = "Rejected",
  Completed = "Completed",
}

export interface CreateCampaignRequest {
  name: string;
  description: string;
  target_amount: number;
  start_date: string;
  end_date: string;
  image_url?: string;
}
export interface UpdateCampaignRequest {
  name?: string;
  description?: string;
  target_amount?: number;
  end_date?: string;
  image_url?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  content: string;
  created_at: string; // ISO timestamp as string
  target_type: "NewCampaign" | string; // If you have more possible values, you can expand this union
  marked_as_read: boolean;
}

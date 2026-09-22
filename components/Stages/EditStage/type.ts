export type EditStageFormValues = {
  name: string;
  amount: string;
  displayOrder: string;
};

export type EditStagePayload = {
  name: string;
  amount: number;
  displayOrder: number;
};

export type StageRecord = {
  _id: string;

  stageId: string;
  key: string;

  name: string;
  amount: number;

  isActive: boolean;
  isSystem: boolean;

  displayOrder: number;

  createdById?: string | null;
  createdByName?: string | null;

  updatedById?: string | null;
  updatedByName?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

export type StageListResponse = {
  success: boolean;
  count: number;
  data: StageRecord[];
};

export type EditStageResponse = {
  success: boolean;
  message: string;
  data: StageRecord;
};
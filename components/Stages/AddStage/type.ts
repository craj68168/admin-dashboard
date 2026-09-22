export type AddStageFormValues = {
  name: string;
  amount: string;
  status: "active" | "inactive";
};

export type AddStagePayload = {
  name: string;
  amount: number;
};

export type UpdateStageStatusPayload = {
  stageId: string;
  isActive: boolean;
};

export type CreatedStage = {
  _id: string;
  stageId: string;
  key: string;
  name: string;
  amount: number;
  displayOrder: number;
  isActive: boolean;
  isSystem: boolean;

  createdById?: string | null;
  createdByName?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

export type AddStageResponse = {
  success: boolean;
  message: string;
  data: CreatedStage;
};

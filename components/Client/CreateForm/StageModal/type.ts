export type CreateStageFormValues = {
  name: string;
  amount: string;
};
export type CreateStageModalProps = {
  open: boolean;
  isLoading: boolean;
  errorMessage: string;
  onClose: () => void;
  onSubmit: (values: CreateStageFormValues) => Promise<void>;
};

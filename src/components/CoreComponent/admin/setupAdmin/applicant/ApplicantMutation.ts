import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addApplicant, deleteApplicant } from "./ApplcantAction";

export default function useApplicantMutations() {
  const queryClient = useQueryClient();

  const { mutateAsync: createApplicants } = useMutation({
    mutationFn: addApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicant"] });
    },
  });
  const { mutateAsync: applicantDelete } = useMutation({
    mutationFn: deleteApplicant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicant"] });
    },
  });

  return {
    createApplicants,
    applicantDelete,
  };
}

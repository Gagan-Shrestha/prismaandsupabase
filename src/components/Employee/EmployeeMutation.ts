import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee, deleteEmployee } from "./AddEmployeeServer";

export default function useEmployeeMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync: addEmployeeDetails } = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee"] });
    },
  });
  const { mutateAsync: deleteEmployeeData } = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee"] });
    },
  });
  return {
    addEmployeeDetails,
    deleteEmployeeData,
  };
}

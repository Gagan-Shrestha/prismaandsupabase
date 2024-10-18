/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProperty, deleteProperty } from "./PropertyServer";

export default function usePropertyMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync: addPropertyData } = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
    },
  });
  const { mutateAsync: deletePropertyData } = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property"] });
    },
  });

  return {
    addPropertyData,
    deletePropertyData,
  };
}

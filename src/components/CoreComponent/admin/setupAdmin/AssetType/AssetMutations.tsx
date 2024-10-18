import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAsset, deleteAssetSpecific } from "./AssetServerActions";

export default function useAssetMutations() {
  const queryClient = useQueryClient();

  const { mutateAsync: addAsset } = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AssetDetails"],
      });
    },
  });

  const { mutateAsync: deleteAsset } = useMutation({
    mutationFn: deleteAssetSpecific,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AssetDetails"],
      });
    },
  });

  return {
    addAsset,
    deleteAsset,
  };
}

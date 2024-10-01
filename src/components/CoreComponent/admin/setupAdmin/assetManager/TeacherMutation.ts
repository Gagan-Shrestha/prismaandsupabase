/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeacher, deleteTeacher } from "./TeacherServer";

export default function useTeacherMutation() {
  const queryClient = useQueryClient();
  const { mutateAsync: addTeacherData } = useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
    },
  });
  const { mutateAsync: deleteTeacherData } = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
    },
  });
  return {
    addTeacherData,
    deleteTeacherData,
  };
}

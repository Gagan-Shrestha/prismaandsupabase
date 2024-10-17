/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTeacher,
  createTeacherBulk,
  deleteTeacher,
} from "./ManagerServer";

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
  const { mutateAsync: addBulkTeacher } = useMutation({
    mutationFn: createTeacherBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
    },
  });
  return {
    addTeacherData,
    deleteTeacherData,
    addBulkTeacher,
  };
}

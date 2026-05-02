import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import headerObject from "../utils/headerObject";
import { toast } from "react-toastify";

const toggleFollow = (id) => {
  return axios.put(
    `https://route-posts.routemisr.com/users/${id}/follow`,
    null,
    headerObject(),
  );
};

export default function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFollow,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["followSuggestions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["profileData"],
      });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message);
    },
  });
}

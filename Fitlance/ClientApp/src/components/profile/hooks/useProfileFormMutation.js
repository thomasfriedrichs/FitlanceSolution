import { putProfile } from "../../../services/ProfileService";
import { useMutation } from "@tanstack/react-query";

export const useProfileFormMutation = () => {
    return useMutation((values) => {
        return putProfile(values);
    });
};
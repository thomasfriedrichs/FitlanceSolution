import { putProfile } from "../../../services/ProfileService";
import { useMutation } from "@tanstack/react-query";

const useProfileFormMutation = () => {
    return useMutation((values) => {
        return putProfile(values);
    });
};

export default useProfileFormMutation;
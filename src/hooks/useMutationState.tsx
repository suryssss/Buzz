import { useMutation } from "convex/react";
import { useState } from "react";

export const useMutationState = (mutationTorun:any) => {
    const [pending,setPending]=useState(false);
    const mutationfn=useMutation(mutationTorun)

    const mutate=(payload:any)=>{
        setPending(true)

        return mutationfn(payload)
        .then((res)=>{
            return res;
        })
        .catch((error)=>{
            throw error
        })
        .finally(()=>setPending(false))
    }

    return {mutate,
        pending
    }

}
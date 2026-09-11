"use client";
import CustomModal from "@/components/Reusable/CustomModal";
import { useCreateClassAndRateMutation } from "@/redux/features/classAndRate.features";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useGetSingleDueDateQuery, useUpdateDueCollectionDateMutation } from "@/redux/features/dueCollection.features";
import CustomStatus from "@/components/Reusable/CustomStatus";
import CustomInput from "@/components/Reusable/CustomInput";
import { showToast } from "@/components/Toast/CustomToast";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
type TForm = {
    date: Date,
    note: string,
}
type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
    id: string | undefined,
    setId: Dispatch<SetStateAction<string | undefined>>
};

const UpdateDueCollectionDateModal = ({ isOpen, onClose, id, setId }: TCustomModal) => {
    const { data, isError, isLoading: dueLoading, error } = useGetSingleDueDateQuery(id,
        {
            refetchOnMountOrArgChange: true,
            skip: !id
        })
    const [mutateAsync, { isLoading }] =   useUpdateDueCollectionDateMutation();
    const { handleSubmit, control, reset, formState: { errors }, register } = useForm<TForm>({

    });
    useEffect(() => {
        if (!data?.data?.nextPaymentDate) return;
        reset({
            date: new Date(data?.data?.nextPaymentDate),
        });
    }, [data, reset]);


    console.log(error)

    const onSubmit: SubmitHandler<TForm> = async (data) => {
        const payload={
            id, data
        }
        try {
          const result = await mutateAsync(payload).unwrap();
          if (result?.success) {
            onClose();
            return showToast({
              title: result?.message,
              type: "success",
              options: {
                duration: 4000,
                icon: <FaCircleCheck className="h-5 w-5" />,
              },
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log(error);
          return showToast({
            title:
              error?.data?.message ||
              "দুঃখিত! সার্ভারে ত্রুটি হয়েছে, পরে চেষ্টা করুন",
            type: "error",
            options: {
              duration: 4000,
              icon: <MdOutlineError className="h-5 w-5" />,
            },
          });
        }
    };


    const handleClose = () => {
        setId(undefined)
        onClose()
    }

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={handleClose}

            width="sm"
        >{
                dueLoading ?
                    <CustomStatus type="loading" />
                    : isError ?
                        <CustomStatus type="error" />
                        :
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <h1 className="pb-2 font-medium text-[15px]">বাকি পরিশোধের তারিখ পরিবর্তন</h1>
                            <CustomDatePicker
                                control={control}
                                name="date"
                                placeholder="বাকি পরিশোধের তারিখ"
                                disablePastDates
                                error={errors.date}
                                rules={{ required: "বাকি পরিশোধের তারিখ পরিবর্তন" }}
                            />


                           <div className="pt-4">
                             <CustomInput
                                name="note"
                                label="নোট"
                                placeholder="নোট"
                                register={register}
                                type="text"
                            />
                           </div>
                            <div className="pt-5">
                                <button
                                    type="submit"
                                    className="text-[14px] bg-[#039A63] px-8 py-1.5 text-gray-100 font-medium rounded cursor-pointer"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "অ্যাড হচ্ছে..." : "পরিবর্তন করুন"}
                                </button>
                            </div>
                        </form>
            }

        </CustomModal>
    );
};

export default UpdateDueCollectionDateModal;

import { z } from "zod";

const invoiceZodSchema = z.object({
  customer: z.object({
    name: z
      .string({ error: "কাস্টমারের নাম লিখুন" })
      .min(1, "কাস্টমারের নাম লিখুন"),
    address: z
      .string({ error: "কাস্টমারের ঠিকানা লিখুন" })
      .min(1, "কাস্টমারের ঠিকানা লিখুন"),
    phoneNumber: z
      .string({ error: "ফোন নম্বর লিখুন" })
      .min(11, "ফোন নম্বর লিখুন"),
  }),

  invoice: z.object({
    // deliveryDate: z.date({ error: "ডেলিভারির তারিখ লিখুন" }),
    // challanDate: z.date({ error: "চ্যালানের তারিখ লিখুন" }),
    // duePaymentDate: z.date({ error: "বাকি পরিশোধের তারিখ লিখুন" }),
    // discount: z.string().min(1, "কত টাকা ছাড় তা লিখুন"),
    // cash: z.string().min(1, "নগদ টাকা লিখুন"),
  }),
  // invoiceItems: z.object({
  //   items: z.array(
  //     z.object({
  //       productName: z.string({ error: "পণ্যের নাম লিখুন" }),
  //       quantity: z.number({ error: "পরিমাণ লিখুন" }).min(1, "পরিমাণ লিখুন"),
  //       rate: z.number({ error: "দর লিখুন" }),
  //       price: z.number({ error: "মোট লিখুন" }),
  //     })
  //   ),
  // }),
});

export default invoiceZodSchema;

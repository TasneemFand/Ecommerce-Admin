"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Product } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().nonempty(),
  images: z
    .object({
      url: z.string(),
    })
    .array(),
  price: z.coerce.number().positive(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Product" : "New Product";
  const description = initialData ? "Edit a Product" : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create product";

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
        }
      : {
          name: "",
          images: [],
          price: 0,
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params?.storeId}/products/${params?.productId}`,
          values
        );
      } else {
        await axios.post(`/api/${params?.storeId}/products`, values);
      }

      router.refresh();
      router.push(`/${params?.storeId}/products`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((image) => image.url)}
                      disabled={isLoading}
                      onChange={(url) => {
                        // Use form.getValues to ensure we have the latest array state
                        const currentImages = form.getValues("images") || [];
                        const updatedImages = [...currentImages, { url }];

                        // Update the form value directly with the new array
                        form.setValue("images", updatedImages, {
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                        console.log("Updated Images:", updatedImages); // Debugging check
                        // field.onChange((prevValue) => [...prevValue, { url }])
                      }}
                      onRemove={(url) =>
                        field.onChange([
                          ...field.value.filter((image) => image.url !== url),
                        ])
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="Product name"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      type="number"
                      placeholder="9.99"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will be displayed on the home page.
                    </FormDescription>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will be hidden from the store.
                    </FormDescription>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

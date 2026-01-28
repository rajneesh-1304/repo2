"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { addProductThunk } from "@/app/redux/features/products/productSlice";
import { Box, Button, FormControl, Snackbar, TextField } from "@mui/material";
import "./addproduct.css";
import { useState } from "react";

type AddProductModalProps = {
  onClose: () => void;
};

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive(),
  category: z.string().min(2, "Category must be at least 2 characters"),
  subcategory: z.string().min(2, "Subcategory must be at least 2 characters"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  images: z
    .any()
    .refine((files: FileList) => files?.length > 0 && files?.length <= 4, {
      message: "Please upload 1 to 4 images",
    }),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductModal({ onClose }: AddProductModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const user = useSelector((state: RootState) => state.users.currentUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const onSubmit = async (formData: ProductFormData) => {
    if (!user) return;
    
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price.toString());
    formDataToSend.append("category", formData.category);
    formDataToSend.append("subcategory", formData.subcategory);
    formDataToSend.append("quantity", formData.quantity.toString());
    formDataToSend.append("sellerId", String(user.id));

    Array.from(formData.images).forEach((file: any) => {
      formDataToSend.append("images", file);
    });

    try {
      await dispatch(addProductThunk(formDataToSend as any)).unwrap();
      setSnackbarMessage("Product added successfully!");
      setSnackbarOpen(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      setSnackbarMessage(error.message || "Error in adding product");
      setSnackbarOpen(true);
    }
    reset();
  };


  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };


  return (
    <div className="modal_overlay">
      <div className="modal">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="modal_form">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: 350,
              gap: 0.75,
            }}
          >
            <FormControl variant="standard">
              <TextField
                label="Title"
                variant="outlined"
                size="small"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </FormControl>

            <FormControl variant="standard">
              <TextField
                label="Description"
                variant="outlined"
                size="small"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </FormControl>

            <FormControl variant="standard">
              <TextField
                label="Price"
                type="number"
                size="small"
                variant="outlined"
                {...register("price", { valueAsNumber: true })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </FormControl>

            <FormControl variant="standard">
              <TextField
                label="Category"
                variant="outlined"
                size="small"
                {...register("category")}
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            </FormControl>

            <FormControl variant="standard">
              <TextField
                label="Subcategory"
                variant="outlined"
                size="small"
                {...register("subcategory")}
                error={!!errors.subcategory}
                helperText={errors.subcategory?.message}
              />
            </FormControl>

            <FormControl variant="standard">
              <TextField
                label="Quantity"
                type="number"
                variant="outlined"
                size="small"
                {...register("quantity", { valueAsNumber: true })}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
              />
            </FormControl>

            <FormControl variant="standard">
              <label style={{ fontSize: 14, marginBottom: 4 }}>
                Upload Images (1 to 4)
              </label>
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                )}
              />
              {errors.images && (
                <p style={{ color: "red", fontSize: 12 }}>
                  {errors.images.message as string}
                </p>
              )}
            </FormControl>

            <div className="modal_actions">
              <Button variant="contained" sx={{ mt: 1, width: 200 }} type="submit">
                Add
              </Button>
              <Button
                variant="outlined"
                sx={{ mt: 1, width: 200 }}
                onClick={() => onClose()}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </form>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message={snackbarMessage}
      />
    </div>
  );
}

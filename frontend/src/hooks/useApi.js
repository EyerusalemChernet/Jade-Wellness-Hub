import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api.js";
import { toast } from "react-toastify";

export const useApi = () => {
  const queryClient = useQueryClient();

  // Auth functions
  const useProfile = () => {
    return useQuery({
      queryKey: ["profile"],
      queryFn: async () => {
        const res = await api.get("/api/auth/profile");
        return res.data;
      },
    });
  };

  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: async (data) => {
        const res = await api.put("/api/auth/profile", data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["profile"]);
        toast.success("Profile updated successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to update profile");
      },
    });
  };

  // Doctors
  const useDoctors = (q) => {
    return useQuery({
      queryKey: ["doctors", q || ""],
      queryFn: async () => {
        const res = await api.get("/api/doctors", { params: q ? { q } : {} });
        return res.data;
      },
    });
  };

  const useAddDoctor = () => {
    return useMutation({
      mutationFn: async (data) => {
        const res = await api.post("/api/doctors", data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["doctors"]);
        toast.success("Doctor added successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to add doctor");
      },
    });
  };

  // Medicines
  const useMedicines = () => {
    return useQuery({
      queryKey: ["medicines"],
      queryFn: async () => {
        const res = await api.get("/api/medicines");
        return res.data;
      },
      staleTime: 30 * 60 * 1000, // 30 minutes for medicines (rarely change)
      cacheTime: 60 * 60 * 1000, // 1 hour cache
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });
  };

  const useAddMedicine = () => {
    return useMutation({
      mutationFn: async (data) => {
        const res = await api.post("/api/medicines", data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["medicines"]);
        toast.success("Medicine added successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to add medicine");
      },
    });
  };

  // Appointments
  const useAppointments = () => {
    return useQuery({
      queryKey: ["appointments"],
      queryFn: async () => {
        const res = await api.get("/api/appointments");
        return res.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes for appointments
      cacheTime: 15 * 60 * 1000, // 15 minutes cache
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });
  };

  const useBookAppointment = () => {
    return useMutation({
      mutationFn: async (data) => {
        const res = await api.post("/api/appointments", data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["appointments"]);
        toast.success("Appointment booked successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to book appointment");
      },
    });
  };

  const useDoctorAppointments = () => {
    return useQuery({
      queryKey: ["doctor-appointments"],
      queryFn: async () => {
        const res = await api.get("/api/appointments/doctor");
        return res.data;
      },
    });
  };

  const useUpdateAppointmentStatus = () => {
    return useMutation({
      mutationFn: async ({ id, status }) => {
        const res = await api.patch(`/api/appointments/${id}/status`, { status });
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["doctor-appointments"]);
      }
    });
  };

  const useAddDoctorNote = () => {
    return useMutation({
      mutationFn: async ({ id, content }) => {
        const res = await api.post(`/api/appointments/${id}/notes`, { content });
        return res.data;
      },
      onSuccess: () => queryClient.invalidateQueries(["doctor-appointments"]) 
    });
  };

  const useCreatePrescription = () => {
    return useMutation({
      mutationFn: async ({ id, medicine, dosage, instructions }) => {
        const res = await api.post(`/api/appointments/${id}/prescriptions`, { medicine, dosage, instructions });
        return res.data;
      },
      onSuccess: () => queryClient.invalidateQueries(["doctor-appointments"]) 
    });
  };

  // Blood Bank
  const useBloodBank = () => {
    return useQuery({
      queryKey: ["blood-bank"],
      queryFn: async () => {
        const res = await api.get("/api/blood-bank");
        return res.data;
      },
    });
  };

  const useDonateBlood = () => {
    return useMutation({
      mutationFn: async (data) => {
        const res = await api.post("/api/blood-bank/donate", data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["blood-bank"]);
        toast.success("Blood donation recorded successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to record blood donation");
      },
    });
  };

  // Users (Admin only)
  const useUsers = () => {
    return useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const res = await api.get("/api/admin/users");
        return res.data;
      },
    });
  };

  // Orders
  const useOrders = () => {
    return useQuery({
      queryKey: ["orders"],
      queryFn: async () => {
        const res = await api.get("/api/orders/mine");
        return res.data;
      },
    });
  };

  const useOrder = (orderId) => {
    return useQuery({
      queryKey: ["order", orderId],
      queryFn: async () => {
        const res = await api.get(`/api/orders/${orderId}`);
        return res.data;
      },
      enabled: !!orderId,
    });
  };

  return {
    useProfile,
    useUpdateProfile,
    useDoctors,
    useAddDoctor,
    useMedicines,
    useAddMedicine,
    useAppointments,
    useBookAppointment,
    useDoctorAppointments,
    useUpdateAppointmentStatus,
    useAddDoctorNote,
    useCreatePrescription,
    useBloodBank,
    useDonateBlood,
    useUsers,
    useOrders,
    useOrder,
  };
};
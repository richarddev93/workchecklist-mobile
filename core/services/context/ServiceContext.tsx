import { createExpoDbAdapter } from "@/core/config/storage/adapters/expo-adapter";
import { DatabaseAdapter } from "@/core/config/storage/database.interface";
import {
    createServiceRepository,
    ServiceRepository,
} from "@/core/services/repository/serviceRepository";
import { Service } from "@/types";
import { randomUUID } from "expo-crypto";
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

interface ServiceContextData {
  services: Service[];
  addService: (
    data: Omit<Service, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  updateService: (id: string, data: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  getServiceById: (id: string) => Service | undefined;
  loading: boolean;
}

const ServiceContext = createContext<ServiceContextData | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DatabaseAdapter | null>(null);
  const serviceRepositoryRef = useRef<ServiceRepository | null>(null);

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const dbInstance = await createExpoDbAdapter();
      serviceRepositoryRef.current = createServiceRepository(dbInstance);

      if (mounted) {
        setDb(dbInstance);
        await getAllServices();
        setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const getAllServices = async () => {
    try {
      console.log("Getting all services...");
      const servicesRes = await serviceRepositoryRef.current?.getAll();
      console.log("Services retrieved:", servicesRes);
      setServices(servicesRes ?? []);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }
  };

  const addService = async (
    data: Omit<Service, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      if (!serviceRepositoryRef.current) {
        throw new Error("Service repository not initialized");
      }
      const id = randomUUID();
      console.log("Adding service with data:", { id, ...data });
      await serviceRepositoryRef.current.save(data, id);
      console.log("Service saved successfully");
      await getAllServices();
    } catch (error) {
      console.error("Error adding service:", error);
      throw error;
    }
  };

  const updateService = async (id: string, data: Partial<Service>) => {
    try {
      console.log("ServiceContext.updateService called with id:", id, "data:", data);
      await serviceRepositoryRef.current?.update(id, data);
      console.log("ServiceContext.updateService - update successful, refreshing services...");
      await getAllServices();
      console.log("ServiceContext.updateService - services refreshed");
    } catch (error) {
      console.error("ServiceContext.updateService - Error updating service:", error);
      console.error("ServiceContext.updateService - Error details:", {
        id,
        data,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      console.log("ServiceContext.deleteService called with id:", id);
      await serviceRepositoryRef.current?.delete(id);
      console.log("ServiceContext.deleteService - delete successful, refreshing services...");
      await getAllServices();
      console.log("ServiceContext.deleteService - services refreshed");
    } catch (error) {
      console.error("ServiceContext.deleteService - Error deleting service:", error);
      console.error("ServiceContext.deleteService - Error details:", {
        id,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };

  function getServiceById(id: string) {
    console.log("getServiceById called with id:", id);
    console.log("Available services:", services.map(s => ({ id: s.id, clientName: s.client_name })));
    const found = services.find((s) => s.id === id);
    console.log("Service found:", !!found);
    return found;
  }

  return (
    <ServiceContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        getServiceById,
        loading,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within ServiceProvider");
  }
  return context;
}

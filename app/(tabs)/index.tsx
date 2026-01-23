import { FeedbackModal } from "@/components/feedback-modal";
import { useServices } from "@/core/services/context/ServiceContext";
import { DashboardServiceView } from "@/core/services/views/DashboardService.view";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import { useMemo } from "react";

export default function HomeScreen() {
  const { services } = useServices();
  const { showFeedbackModal, setShowFeedbackModal, submitFeedback } =
    useFeedbackModal();

  const servicesData = useMemo(() => {
    const total = services?.length || 0;
    const inProgress =
      services?.filter((s) => s.status === "in-progress").length || 0;
    const completed =
      services?.filter((s) => s.status === "completed").length || 0;

    return {
      data: services || [],
      totalServices: total,
      inProgressServices: inProgress,
      completedServices: completed,
    };
  }, [services]);

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
  };

  const handleFeedbackSubmit = async (feedback: string | null) => {
    await submitFeedback(feedback);
    setShowFeedbackModal(false);
  };

  return (
    <>
      <DashboardServiceView services={servicesData} />
      <FeedbackModal
        visible={showFeedbackModal}
        onClose={handleFeedbackClose}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  );
}

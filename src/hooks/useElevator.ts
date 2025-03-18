import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {elevatorService} from "../services/elevator.service.ts";
import {Elevator} from "../models/elevator.ts";

export const useElevator = (elevatorId: number) => {
  return useQuery<Elevator>({
    queryKey: ['elevator', elevatorId],
    queryFn: () => elevatorService.fetchElevator(elevatorId),
  })
}

export const useRequestElevator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ elevatorId, floor, direction }: { elevatorId: number, floor: number, direction: string }) =>
      elevatorService.requestElevator(elevatorId, floor, direction),
    onSuccess: (_, { elevatorId }) => {
      queryClient.invalidateQueries({ queryKey: ['elevator', elevatorId] });
    },
  });
};

export const useOpenDoor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (elevatorId: number) => elevatorService.openDoor(elevatorId),
    onSuccess: (_, elevatorId) => {
      queryClient.invalidateQueries({ queryKey: ['elevator', elevatorId] });
    },
  });
};

export const useCloseDoor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (elevatorId: number) => elevatorService.closeDoor(elevatorId),
    onSuccess: (_, elevatorId) => {
      queryClient.invalidateQueries({ queryKey: ['elevator', elevatorId] });
    },
  });
};

export const useElevatorMove = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (elevatorId: number) => elevatorService.moveElevator(elevatorId),
    onSuccess: (_, elevatorId) => {
      queryClient.invalidateQueries({ queryKey: ['elevator', elevatorId] });
    },
  });
};

export const useResetElevator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (elevatorId: number) => elevatorService.resetElevatorById(elevatorId),
    onSuccess: (_, elevatorId) => {
      queryClient.invalidateQueries({ queryKey: ['elevator', elevatorId] });
    },
  });
};

export const useNumberOfElevators = () => {
  return useQuery({
    queryKey: ["numberOfElevators"],
    queryFn: elevatorService.fetchNumberOfElevators,
  });
};
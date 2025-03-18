import axios from "axios";
import { Elevator } from "../models/elevator.ts";

// const API_URL = process.env.VITE_API_URL; // TODO update environment variable
const API_URL = "https://elevator-simulator-service-e77g.onrender.com/apis/elevators";

/**
 * Fetch the state of a specific elevator.
 * @param id - The ID of the elevator.
 * @returns The state of the elevator.
 */
const fetchElevator = async (id: number): Promise<Elevator> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

/**
 * Request an elevator to a specific floor with a direction.
 * @param id - The ID of the elevator.
 * @param floor - The floor number to request.
 * @param direction - The direction of the request (UP or DOWN).
 */
const requestElevator = async (id: number, floor: number, direction: string): Promise<void> => {
  await axios.post(`${API_URL}/${id}/request`, null, {
    params: { floor, direction },
  });
};

/**
 * Open the door of a specific elevator.
 * @param id - The ID of the elevator.
 */
const openDoor = async (id: number): Promise<void> => {
  await axios.post(`${API_URL}/${id}/open-door`);
};

/**
 * Close the door of a specific elevator.
 * @param id - The ID of the elevator.
 */
const closeDoor = async (id: number): Promise<void> => {
  await axios.post(`${API_URL}/${id}/close-door`);
};

/**
 * Move a specific elevator to the next floor in its queue.
 * @param id - The ID of the elevator.
 * @returns The updated state of the elevator.
 */
const moveElevator = async (id: number): Promise<Elevator> => {
  const response = await axios.post(`${API_URL}/${id}/move`);
  return response.data;
};

const resetElevatorById = async (id: number): Promise<Elevator> => {
  const response = await axios.post(`${API_URL}/${id}/reset`);
  return response.data;
};

/**
 * Fetch the number of elevators from the backend.
 * @returns The number of elevators.
 */
export const fetchNumberOfElevators = async (): Promise<number> => {
  const response = await axios.get(`${API_URL}/count`);
  return response.data;
};

export const elevatorService = {
  fetchElevator,
  requestElevator,
  openDoor,
  closeDoor,
  moveElevator,
  resetElevatorById,
  fetchNumberOfElevators,
};
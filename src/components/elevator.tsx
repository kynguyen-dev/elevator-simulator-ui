import {
  useCloseDoor,
  useElevator,
  useElevatorMove,
  useOpenDoor,
  useRequestElevator, useResetElevator,
} from "../hooks/useElevator.ts";
import { useEffect, useState } from "react";
import { ChevronsDown, ChevronsUp, RefreshCcw } from "react-feather";
import {DIRECTIONS, MAX_OF_FLOORS} from "../constants/appConstants.ts";
import { APP_MESSAGES, BUTTONS, ELEVATOR_DIRECTIONS } from "../constants/messages.ts";

const FLOORS = Array.from({ length: MAX_OF_FLOORS }, (_, i) => MAX_OF_FLOORS - i);

export const Elevator = ({ elevatorId }: { elevatorId: number }) => {
  const { data: elevator, isLoading, refetch } = useElevator(elevatorId);
  const requestElevatorMutation = useRequestElevator();
  const openDoorMutation = useOpenDoor();
  const closeDoorMutation = useCloseDoor();
  const moveElevatorMutation = useElevatorMove();
  const resetElevatorMutation = useResetElevator();

  const [simulatedFloor, setSimulatedFloor] = useState(elevator?.currentFloor || 1);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (!elevator || !isMoving || elevator.queue.length === 0) return;

    const interval = setInterval(async () => {
      const response = await moveElevatorMutation.mutateAsync(elevatorId);
      setSimulatedFloor(response.currentFloor);

      if (response.queue.length === 0) {
        setIsMoving(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isMoving, elevator?.queue, moveElevatorMutation]);

  const handleRequestElevator = async (floor: number, direction: string) => {
    await requestElevatorMutation.mutateAsync({ elevatorId, floor, direction });
    setIsMoving(true);
    refetch();
  };

  const handleOpenDoor = async () => {
    await openDoorMutation.mutateAsync(elevatorId);
    refetch();
  };

  const handleCloseDoor = async () => {
    await closeDoorMutation.mutateAsync(elevatorId);
    setIsMoving(true);
    refetch();
  };

  const handleResetElevatorById = async () => {
    await resetElevatorMutation.mutateAsync(elevatorId);
    refetch();
  };


  useEffect(() => {
    if (elevator) {
      setSimulatedFloor(elevator.currentFloor);
    }
  }, [elevator?.currentFloor]);

  if (isLoading) return <div>{APP_MESSAGES.LOADING}</div>;

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">{APP_MESSAGES.ELEVATOR} {elevator?.id}</h2>
      {FLOORS.map((floor) => (
        <div key={floor} className="flex flex-row w-full gap-4">
          <div className={"w-1/2 flex flex-row items-center justify-end gap-4"}>
            {floor === simulatedFloor && (
              <div className="text-sm font-bold whitespace-nowrap">
                {elevator?.doorOpen ? APP_MESSAGES.DOOR_OPEN : APP_MESSAGES.DOOR_CLOSED}
              </div>
            )}
            <button
              className={`!w-16 !h-16 border text-lg font-bold ${
                floor === simulatedFloor ? "border-red-500 bg-gray-300" : "border-black"
              }`}
            >
              {floor}
            </button>
          </div>
          <div className={"w-1/2 flex flex-row gap-4 items-center"}>
            <button
              className="h-fit flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
              onClick={() => handleRequestElevator(floor, DIRECTIONS.UP)}
            >
              <ChevronsUp size="20" />
              {ELEVATOR_DIRECTIONS.UP}
            </button>
            <button
              className="h-fit flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
              onClick={() => handleRequestElevator(floor, DIRECTIONS.DOWN)}
            >
              <ChevronsDown size="20" />
              {ELEVATOR_DIRECTIONS.DOWN}
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-row items-center gap-4 pt-4">
          <button
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
            onClick={handleOpenDoor}
          >
            {BUTTONS.DOOR_OPEN}
          </button>
          <button
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
            onClick={handleCloseDoor}
          >
            {BUTTONS.DOOR_CLOSE}
          </button>
        </div>
        <button
          className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer"
          onClick={handleResetElevatorById}
        >
          <RefreshCcw size="20" />
          {BUTTONS.RESET}
        </button>
      </div>
    </div>
  );
};
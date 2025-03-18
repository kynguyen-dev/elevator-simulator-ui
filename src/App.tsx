import { Elevator } from "./components/elevator.tsx";
import { APP_MESSAGES } from "./constants/messages.ts";
import {useNumberOfElevators} from "./hooks/useElevator.ts";
import {NUMBER_OF_ELEVATORS} from "./constants/appConstants.ts";


function App() {
  const { data: numberOfElevators, isLoading } = useNumberOfElevators();
  const elevatorIds = Array.from({ length: numberOfElevators || NUMBER_OF_ELEVATORS }, (_, index) => index + 1);

  if (isLoading) return <div className="flex flex-col items-center p-8 w-full">Loading...</div>;
  return (

      <div className="flex flex-col items-center p-4 w-full">
        <h1 className="text-2xl font-bold mb-8">{APP_MESSAGES.APP_NAME}</h1>
        <div className="flex flex-row md:flex-row gap-8 md:w-auto justify-between">
          {elevatorIds.map((id) => (
            <Elevator key={id} elevatorId={id} />
          ))}
        </div>
      </div>
  )
}

export default App

import Canvas from "./components/canvas/canvas";
import { CanvasProvider } from "./context/canvas-context";
import { HistoryProvider } from "./context/history-context";
import { ObjectProvider } from "./context/object-context";

function App() {
  return (
    <CanvasProvider>
      <ObjectProvider>
        <HistoryProvider>
          <div className="relative h-screen w-full flex items-center justify-center">
            <Canvas />
          </div>
        </HistoryProvider>{" "}
      </ObjectProvider>{" "}
    </CanvasProvider>
  );
}

export default App;

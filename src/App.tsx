import Canvas from "./components/canvas/canvas";
import { CanvasProvider } from "./context/canvas-context";
import { ObjectProvider } from "./context/object-context";

function App() {
  return (
    <CanvasProvider>
      <ObjectProvider>
        <div className="relative bg-black text-white overflow-hidden h-screen w-full flex items-center justify-center">
          <Canvas />
        </div>
      </ObjectProvider>
    </CanvasProvider>
  );
}

export default App;

import { QueryProvider } from "@presentation/providers/QueryProvider";
import { HomePage } from "@presentation/pages/HomePage";
import { getContainer } from "@infrastructure/di/container";

function App() {
  const container = getContainer();

  return (
    <QueryProvider>
      <HomePage container={container} />
    </QueryProvider>
  );
}

export default App;

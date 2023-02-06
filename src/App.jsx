import React from "react";
import TaskHome from "./view/TaskHome";
import { TaskProvider } from "./service/TaskManager";
import { SocketProvider } from "./service/SocketManager";

function App() {
  const FlattenedProviderTree = (providers) => {
    if (providers?.length === 1) {
      return providers[0][0];
    }
    const [A, paramsA] = providers.shift();
    const [B, paramsB] = providers.shift();

    return FlattenedProviderTree([
      [
        ({ children }) => (
          <A {...(paramsA || {})}>
            <B {...(paramsB || {})}>{children}</B>
          </A>
        ),
      ],
      ...providers,
    ]);
  };
  const Providers = FlattenedProviderTree([[TaskProvider], [SocketProvider]]);
  return (
    <Providers>
      <TaskHome />
    </Providers>
  );
}

export default App;

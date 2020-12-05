import * as React from "react";
import { render } from "react-dom";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { JoinGame } from "./src/components/JoinGame";
import { ChooseGame } from "./src/components/GameChooser";
import { useState } from "react";

import 'antd/dist/antd.css';
import { OfflineGame } from "./src/components/OfflineGame";

const el = document.getElementById("body");

const playerName = "Moonshot player " + Math.ceil(Math.random() * 100);


function App() {

    const [gameName, setGameName] = useState<string | null>(null);

    if (gameName !== null)
    {
        switch(gameName)
        {
            case "Offline":
                return <OfflineGame playerName={playerName} ></OfflineGame>;
            default:
                return <JoinGame gameName={gameName} playerName={playerName}></JoinGame>
        }
    }
    else {
        return <ChooseGame chooseGame={setGameName}></ChooseGame>
    }
}

class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
    constructor(props: {}) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError() {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error : {}, errorInfo: {}) {
      // You can also log the error to an error reporting service
      //logErrorToMyService(error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children; 
    }
  }

if (true)
{
    // const client = new ApolloClient({
    //         uri: 'http://localhost:5000/graphql',
    //         //headers: {"Authorization": "Bearer "},
    //         cache: new InMemoryCache()
    //       });

    const httpLink = new HttpLink({
        uri: 'http://localhost:5000/graphql'
    });

    const wsLink = new WebSocketLink({
        uri: `ws://localhost:5000/graphql`,
        options: {
            reconnect: true,
            connectionParams: {
            },
        },
    });

    // The split function takes three parameters:
    //
    // * A function that's called for each operation to execute
    // * The Link to use for an operation if the function returns a "truthy" value
    // * The Link to use for an operation if the function returns a "falsy" value
    const splitLink = split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            );
        },
        wsLink,
        httpLink,
    );

    const client = new ApolloClient({
        link: splitLink,
        cache: new InMemoryCache()
    });

    render(<ApolloProvider client={client}>
        <ErrorBoundary>
            <App></App>
        </ErrorBoundary>
   </ApolloProvider>,
el);
}
else
{   
    render(<ErrorBoundary><OfflineGame playerName={playerName}  /></ErrorBoundary>, el);
}
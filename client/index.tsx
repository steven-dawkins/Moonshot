import * as React from "react";
import { render } from "react-dom";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { JoinGame } from "./src/components/JoinGame";
import { ChooseGame } from "./src/components/GameChooser";
import { useState } from "react";

import 'antd/dist/antd.dark.css';

import { OfflineGame } from "./src/components/OfflineGame";

console.log("Starting Moonshot 1.4");

const el = document.getElementById("body");

function App() {

    const [gameInfo, setGameName] = useState<{gameName: string, gameText: string, playerName: string} | null>(null);

    if (gameInfo !== null)
    {
        switch(gameInfo.gameName)
        {
            case "Offline":
                return <OfflineGame playerName={gameInfo.playerName} ></OfflineGame>;
            default:
                return <JoinGame gameName={gameInfo.gameName} playerName={gameInfo.playerName} gameText={gameInfo.gameText}></JoinGame>
        }
    }
    else {
        return <ChooseGame chooseGame={(gameName, gameText, playerName) => setGameName({gameName, gameText, playerName})}></ChooseGame>
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

    const hostname = location.hostname;
    const protocol = window.location.protocol === "https:"
        ? "s"
        : "";
    
    const port = hostname == "localhost"
        ? 5000
        : protocol == "s"
        ? 443
        : 80;

    const httpLink = new HttpLink({
        uri: `http${protocol}://${hostname}:${port}/graphql`
    });

    const wsLink = new WebSocketLink({
        uri: `ws${protocol}://${hostname}:${port}/graphql`,
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
   </ApolloProvider>, el);
}
else
{   
    render(<ErrorBoundary><OfflineGame playerName={"Offline Player"}  /></ErrorBoundary>, el);
}
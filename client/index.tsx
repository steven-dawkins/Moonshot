import * as React from "react";
import { useEffect } from "react";
import { render } from "react-dom";
import { WebGlScene } from "./scene";
import { Typist } from "./src/typist";

import khanText from "./assets/khan.txt";
import { useJoinMutation } from "./src/generated/graphql";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const el = document.getElementById("body");

const texts = khanText.split("\n");

const typist = new Typist(texts[Math.floor(Math.random() * texts.length)]);

function App() {

        const [joinMutation, { data, loading, error }] = useJoinMutation({
                variables: {
                name: "Moonshot"
                },
                });

        useEffect(() => {
                console.log("join");
                joinMutation();
        }, []);

        if (error) {
                return <div>Error! {error}</div>
            }

        if (loading || !data || !data.join) {
            return <div>Loading...</div>;
        }

        console.log(data.join);

        return <div>
                <h1>Moonshot</h1>
                <WebGlScene typist={typist} name={data.join} ></WebGlScene>
       </div>;
}
const client = new ApolloClient({
        uri: 'http://localhost:5000/graphql',
        //headers: {"Authorization": "Bearer "},
        cache: new InMemoryCache()
      });

render(<ApolloProvider client={client}><App></App>
        </ApolloProvider>,
    el);
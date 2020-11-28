import * as React from "react";
import { useState } from "react";
import { useGetGamesQuery } from "../generated/graphql";

export function ChooseGame(props: { chooseGame: (gameName: string) => void }) {

    const { error: gameGetError, data, loading } = useGetGamesQuery({
        variables: {
        }
    });

    const [name, setName] = useState("");

    if (loading) {
        return <div>Loading...</div>;
    }

    if (gameGetError) {
        return <div>Error loading games...</div>;
    }

    console.log(data?.games);

    return <div>
        <button onClick={(evt) => { evt.preventDefault(); props.chooseGame("Offline"); }}>Offline</button>
        
        <fieldset>
            <legend>Create game</legend>
            <input id="gameName" type="text" value={name} onChange={e => setName(e.target.value)}></input>
            <button disabled={name.length === 0} onClick={(evt) => { evt.preventDefault(); props.chooseGame(name); }}>Create</button>
        </fieldset>
    
        <ul>
            {data?.games?.map(g =>
                <li key={g.name}>
                    {g.name} - {g.players.length} players <button onClick={() => props.chooseGame(g.name)}>Join</button>
                </li>
            )}
        </ul>
    </div>
}
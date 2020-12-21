import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type MoonshotQuery = {
  __typename?: 'MoonshotQuery';
  games?: Maybe<Array<Game>>;
};


export type MoonshotQueryGamesArgs = {
  gameName?: Maybe<Scalars['String']>;
  started?: Maybe<Scalars['Boolean']>;
};

export type Game = {
  __typename?: 'Game';
  gameText: Scalars['String'];
  name: Scalars['String'];
  players: Array<Player>;
  started: Scalars['Boolean'];
};

export type Player = {
  __typename?: 'Player';
  index: Scalars['Int'];
  keystrokes: Array<Maybe<Scalars['String']>>;
  name: Scalars['String'];
};

export type MoonshotMutation = {
  __typename?: 'MoonshotMutation';
  addGameKeystroke?: Maybe<PlayerKeystroke>;
  createGame: Game;
  joinGame: Game;
  startGame: Game;
};


export type MoonshotMutationAddGameKeystrokeArgs = {
  gameName: Scalars['String'];
  playerName: Scalars['String'];
  keystroke: Scalars['String'];
};


export type MoonshotMutationCreateGameArgs = {
  name: Scalars['String'];
  gameText: Scalars['String'];
  playerName: Scalars['String'];
};


export type MoonshotMutationJoinGameArgs = {
  gameName: Scalars['String'];
  gameText: Scalars['String'];
  playerName: Scalars['String'];
};


export type MoonshotMutationStartGameArgs = {
  name: Scalars['String'];
  state: GameState;
  countdown?: Maybe<Scalars['String']>;
};

export enum GameState {
  Lobby = 'LOBBY',
  Countdown = 'COUNTDOWN',
  Started = 'STARTED'
}

export type PlayerKeystroke = {
  __typename?: 'PlayerKeystroke';
  id?: Maybe<Scalars['String']>;
  keystroke?: Maybe<Scalars['String']>;
  playerName?: Maybe<Scalars['String']>;
};

export type ChatSubscriptions = {
  __typename?: 'ChatSubscriptions';
  gameStream?: Maybe<GameStream>;
};


export type ChatSubscriptionsGameStreamArgs = {
  gameName: Scalars['String'];
};

export type GameStream = {
  __typename?: 'GameStream';
  countdown?: Maybe<Scalars['String']>;
  gameState?: Maybe<GameState>;
  keystroke?: Maybe<Scalars['String']>;
  keystrokeId?: Maybe<Scalars['String']>;
  playerIndex?: Maybe<Scalars['Int']>;
  playerName?: Maybe<Scalars['String']>;
  type: EventType;
};

export enum EventType {
  PlayerJoined = 'PLAYER_JOINED',
  GameStateChanged = 'GAME_STATE_CHANGED',
  Keystroke = 'KEYSTROKE'
}

export type AddGameKeystrokeMutationVariables = Exact<{
  gameName: Scalars['String'];
  playerName: Scalars['String'];
  keystroke: Scalars['String'];
}>;


export type AddGameKeystrokeMutation = (
  { __typename?: 'MoonshotMutation' }
  & { addGameKeystroke?: Maybe<(
    { __typename?: 'PlayerKeystroke' }
    & Pick<PlayerKeystroke, 'keystroke' | 'playerName'>
  )> }
);

export type CreateGameMutationVariables = Exact<{
  gameName: Scalars['String'];
  playerName: Scalars['String'];
  gameText: Scalars['String'];
}>;


export type CreateGameMutation = (
  { __typename?: 'MoonshotMutation' }
  & { createGame: (
    { __typename?: 'Game' }
    & Pick<Game, 'name' | 'gameText'>
    & { players: Array<(
      { __typename?: 'Player' }
      & Pick<Player, 'name' | 'index'>
    )> }
  ) }
);

export type GetGamesQueryVariables = Exact<{
  gameName?: Maybe<Scalars['String']>;
  started?: Maybe<Scalars['Boolean']>;
}>;


export type GetGamesQuery = (
  { __typename?: 'MoonshotQuery' }
  & { games?: Maybe<Array<(
    { __typename?: 'Game' }
    & Pick<Game, 'name' | 'started'>
    & { players: Array<(
      { __typename?: 'Player' }
      & Pick<Player, 'name' | 'index'>
    )> }
  )>> }
);

export type JoinGameMutationVariables = Exact<{
  gameName: Scalars['String'];
  playerName: Scalars['String'];
  gameText: Scalars['String'];
}>;


export type JoinGameMutation = (
  { __typename?: 'MoonshotMutation' }
  & { joinGame: (
    { __typename?: 'Game' }
    & Pick<Game, 'gameText' | 'name'>
    & { players: Array<(
      { __typename?: 'Player' }
      & Pick<Player, 'name' | 'index'>
    )> }
  ) }
);

export type StartGameMutationVariables = Exact<{
  gameName: Scalars['String'];
  gameState: GameState;
  countdown?: Maybe<Scalars['String']>;
}>;


export type StartGameMutation = (
  { __typename?: 'MoonshotMutation' }
  & { startGame: (
    { __typename?: 'Game' }
    & Pick<Game, 'name'>
  ) }
);

export type GameStreamSubscriptionVariables = Exact<{
  gameName: Scalars['String'];
}>;


export type GameStreamSubscription = (
  { __typename?: 'ChatSubscriptions' }
  & { gameStream?: Maybe<(
    { __typename?: 'GameStream' }
    & Pick<GameStream, 'keystroke' | 'playerName' | 'type' | 'keystrokeId' | 'playerIndex' | 'gameState' | 'countdown'>
  )> }
);


export const AddGameKeystrokeDocument = gql`
    mutation addGameKeystroke($gameName: String!, $playerName: String!, $keystroke: String!) {
  addGameKeystroke(
    gameName: $gameName
    playerName: $playerName
    keystroke: $keystroke
  ) {
    keystroke
    playerName
  }
}
    `;
export type AddGameKeystrokeMutationFn = Apollo.MutationFunction<AddGameKeystrokeMutation, AddGameKeystrokeMutationVariables>;

/**
 * __useAddGameKeystrokeMutation__
 *
 * To run a mutation, you first call `useAddGameKeystrokeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddGameKeystrokeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addGameKeystrokeMutation, { data, loading, error }] = useAddGameKeystrokeMutation({
 *   variables: {
 *      gameName: // value for 'gameName'
 *      playerName: // value for 'playerName'
 *      keystroke: // value for 'keystroke'
 *   },
 * });
 */
export function useAddGameKeystrokeMutation(baseOptions?: Apollo.MutationHookOptions<AddGameKeystrokeMutation, AddGameKeystrokeMutationVariables>) {
        return Apollo.useMutation<AddGameKeystrokeMutation, AddGameKeystrokeMutationVariables>(AddGameKeystrokeDocument, baseOptions);
      }
export type AddGameKeystrokeMutationHookResult = ReturnType<typeof useAddGameKeystrokeMutation>;
export type AddGameKeystrokeMutationResult = Apollo.MutationResult<AddGameKeystrokeMutation>;
export type AddGameKeystrokeMutationOptions = Apollo.BaseMutationOptions<AddGameKeystrokeMutation, AddGameKeystrokeMutationVariables>;
export const CreateGameDocument = gql`
    mutation CreateGame($gameName: String!, $playerName: String!, $gameText: String!) {
  createGame(name: $gameName, playerName: $playerName, gameText: $gameText) {
    name
    gameText
    players {
      name
      index
    }
  }
}
    `;
export type CreateGameMutationFn = Apollo.MutationFunction<CreateGameMutation, CreateGameMutationVariables>;

/**
 * __useCreateGameMutation__
 *
 * To run a mutation, you first call `useCreateGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGameMutation, { data, loading, error }] = useCreateGameMutation({
 *   variables: {
 *      gameName: // value for 'gameName'
 *      playerName: // value for 'playerName'
 *      gameText: // value for 'gameText'
 *   },
 * });
 */
export function useCreateGameMutation(baseOptions?: Apollo.MutationHookOptions<CreateGameMutation, CreateGameMutationVariables>) {
        return Apollo.useMutation<CreateGameMutation, CreateGameMutationVariables>(CreateGameDocument, baseOptions);
      }
export type CreateGameMutationHookResult = ReturnType<typeof useCreateGameMutation>;
export type CreateGameMutationResult = Apollo.MutationResult<CreateGameMutation>;
export type CreateGameMutationOptions = Apollo.BaseMutationOptions<CreateGameMutation, CreateGameMutationVariables>;
export const GetGamesDocument = gql`
    query GetGames($gameName: String, $started: Boolean) {
  games(gameName: $gameName, started: $started) {
    name
    started
    players {
      name
      index
    }
  }
}
    `;

/**
 * __useGetGamesQuery__
 *
 * To run a query within a React component, call `useGetGamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGamesQuery({
 *   variables: {
 *      gameName: // value for 'gameName'
 *      started: // value for 'started'
 *   },
 * });
 */
export function useGetGamesQuery(baseOptions?: Apollo.QueryHookOptions<GetGamesQuery, GetGamesQueryVariables>) {
        return Apollo.useQuery<GetGamesQuery, GetGamesQueryVariables>(GetGamesDocument, baseOptions);
      }
export function useGetGamesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGamesQuery, GetGamesQueryVariables>) {
          return Apollo.useLazyQuery<GetGamesQuery, GetGamesQueryVariables>(GetGamesDocument, baseOptions);
        }
export type GetGamesQueryHookResult = ReturnType<typeof useGetGamesQuery>;
export type GetGamesLazyQueryHookResult = ReturnType<typeof useGetGamesLazyQuery>;
export type GetGamesQueryResult = Apollo.QueryResult<GetGamesQuery, GetGamesQueryVariables>;
export const JoinGameDocument = gql`
    mutation JoinGame($gameName: String!, $playerName: String!, $gameText: String!) {
  joinGame(gameName: $gameName, playerName: $playerName, gameText: $gameText) {
    gameText
    name
    players {
      name
      index
    }
  }
}
    `;
export type JoinGameMutationFn = Apollo.MutationFunction<JoinGameMutation, JoinGameMutationVariables>;

/**
 * __useJoinGameMutation__
 *
 * To run a mutation, you first call `useJoinGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinGameMutation, { data, loading, error }] = useJoinGameMutation({
 *   variables: {
 *      gameName: // value for 'gameName'
 *      playerName: // value for 'playerName'
 *      gameText: // value for 'gameText'
 *   },
 * });
 */
export function useJoinGameMutation(baseOptions?: Apollo.MutationHookOptions<JoinGameMutation, JoinGameMutationVariables>) {
        return Apollo.useMutation<JoinGameMutation, JoinGameMutationVariables>(JoinGameDocument, baseOptions);
      }
export type JoinGameMutationHookResult = ReturnType<typeof useJoinGameMutation>;
export type JoinGameMutationResult = Apollo.MutationResult<JoinGameMutation>;
export type JoinGameMutationOptions = Apollo.BaseMutationOptions<JoinGameMutation, JoinGameMutationVariables>;
export const StartGameDocument = gql`
    mutation startGame($gameName: String!, $gameState: GameState!, $countdown: String) {
  startGame(name: $gameName, state: $gameState, countdown: $countdown) {
    name
  }
}
    `;
export type StartGameMutationFn = Apollo.MutationFunction<StartGameMutation, StartGameMutationVariables>;

/**
 * __useStartGameMutation__
 *
 * To run a mutation, you first call `useStartGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startGameMutation, { data, loading, error }] = useStartGameMutation({
 *   variables: {
 *      gameName: // value for 'gameName'
 *      gameState: // value for 'gameState'
 *      countdown: // value for 'countdown'
 *   },
 * });
 */
export function useStartGameMutation(baseOptions?: Apollo.MutationHookOptions<StartGameMutation, StartGameMutationVariables>) {
        return Apollo.useMutation<StartGameMutation, StartGameMutationVariables>(StartGameDocument, baseOptions);
      }
export type StartGameMutationHookResult = ReturnType<typeof useStartGameMutation>;
export type StartGameMutationResult = Apollo.MutationResult<StartGameMutation>;
export type StartGameMutationOptions = Apollo.BaseMutationOptions<StartGameMutation, StartGameMutationVariables>;
export const GameStreamDocument = gql`
    subscription GameStream($gameName: String!) {
  gameStream(gameName: $gameName) {
    keystroke
    playerName
    type
    keystrokeId
    playerIndex
    gameState
    countdown
  }
}
    `;

/**
 * __useGameStreamSubscription__
 *
 * To run a query within a React component, call `useGameStreamSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGameStreamSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameStreamSubscription({
 *   variables: {
 *      gameName: // value for 'gameName'
 *   },
 * });
 */
export function useGameStreamSubscription(baseOptions: Apollo.SubscriptionHookOptions<GameStreamSubscription, GameStreamSubscriptionVariables>) {
        return Apollo.useSubscription<GameStreamSubscription, GameStreamSubscriptionVariables>(GameStreamDocument, baseOptions);
      }
export type GameStreamSubscriptionHookResult = ReturnType<typeof useGameStreamSubscription>;
export type GameStreamSubscriptionResult = Apollo.SubscriptionResult<GameStreamSubscription>;
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

export type GameQuery = {
  __typename?: 'GameQuery';
  games?: Maybe<Array<Game>>;
  keystrokes?: Maybe<Array<PlayerKeystroke>>;
  players?: Maybe<Array<Player>>;
};


export type GameQueryGamesArgs = {
  gameName?: Maybe<Scalars['String']>;
};

export type PlayerKeystroke = {
  __typename?: 'PlayerKeystroke';
  id?: Maybe<Scalars['String']>;
  keystroke?: Maybe<Scalars['String']>;
  playerName?: Maybe<Scalars['String']>;
};

export type Player = {
  __typename?: 'Player';
  index: Scalars['Int'];
  name: Scalars['String'];
};

export type Game = {
  __typename?: 'Game';
  keystrokes: Array<Maybe<PlayerKeystroke>>;
  name: Scalars['String'];
  players: Array<Maybe<Player>>;
};

export type MoonshotMutation = {
  __typename?: 'MoonshotMutation';
  addGameKeystroke?: Maybe<PlayerKeystroke>;
  addKeystroke?: Maybe<PlayerKeystroke>;
  createGame: Game;
  join: Player;
  joinGame: Player;
};


export type MoonshotMutationAddGameKeystrokeArgs = {
  gameName?: Maybe<Scalars['String']>;
  playerName?: Maybe<Scalars['String']>;
  keystroke?: Maybe<Scalars['String']>;
};


export type MoonshotMutationAddKeystrokeArgs = {
  playerName?: Maybe<Scalars['String']>;
  keystroke?: Maybe<Scalars['String']>;
};


export type MoonshotMutationCreateGameArgs = {
  name?: Maybe<Scalars['String']>;
};


export type MoonshotMutationJoinArgs = {
  name?: Maybe<Scalars['String']>;
};


export type MoonshotMutationJoinGameArgs = {
  gameName: Scalars['String'];
  playerName: Scalars['String'];
};

export type ChatSubscriptions = {
  __typename?: 'ChatSubscriptions';
  gameKeystroke?: Maybe<PlayerKeystroke>;
  keystrokeAdded?: Maybe<PlayerKeystroke>;
  playerJoined?: Maybe<Player>;
  playerJoinedGame?: Maybe<Player>;
};


export type ChatSubscriptionsGameKeystrokeArgs = {
  gameName: Scalars['String'];
};


export type ChatSubscriptionsPlayerJoinedGameArgs = {
  gameName: Scalars['String'];
};

export type CreateGameMutationVariables = Exact<{
  gameName: Scalars['String'];
}>;


export type CreateGameMutation = (
  { __typename?: 'MoonshotMutation' }
  & { createGame: (
    { __typename?: 'Game' }
    & Pick<Game, 'name'>
    & { players: Array<Maybe<(
      { __typename?: 'Player' }
      & Pick<Player, 'name' | 'index'>
    )>> }
  ) }
);

export type GetGamesQueryVariables = Exact<{
  gameName: Scalars['String'];
}>;


export type GetGamesQuery = (
  { __typename?: 'GameQuery' }
  & { games?: Maybe<Array<(
    { __typename?: 'Game' }
    & Pick<Game, 'name'>
    & { players: Array<Maybe<(
      { __typename?: 'Player' }
      & Pick<Player, 'name' | 'index'>
    )>> }
  )>> }
);

export type JoinMutationVariables = Exact<{
  name?: Maybe<Scalars['String']>;
}>;


export type JoinMutation = (
  { __typename?: 'MoonshotMutation' }
  & { join: (
    { __typename?: 'Player' }
    & Pick<Player, 'name' | 'index'>
  ) }
);

export type JoinGameMutationVariables = Exact<{
  gameName: Scalars['String'];
  playerName: Scalars['String'];
}>;


export type JoinGameMutation = (
  { __typename?: 'MoonshotMutation' }
  & { joinGame: (
    { __typename?: 'Player' }
    & Pick<Player, 'name' | 'index'>
  ) }
);

export type PlayersSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PlayersSubscription = (
  { __typename?: 'ChatSubscriptions' }
  & { playerJoined?: Maybe<(
    { __typename?: 'Player' }
    & Pick<Player, 'name' | 'index'>
  )> }
);

export type GetPlayersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPlayersQuery = (
  { __typename?: 'GameQuery' }
  & { players?: Maybe<Array<(
    { __typename?: 'Player' }
    & Pick<Player, 'name' | 'index'>
  )>> }
);

export type GameKeystrokesSubscriptionVariables = Exact<{
  gameName: Scalars['String'];
}>;


export type GameKeystrokesSubscription = (
  { __typename?: 'ChatSubscriptions' }
  & { gameKeystroke?: Maybe<(
    { __typename?: 'PlayerKeystroke' }
    & Pick<PlayerKeystroke, 'playerName' | 'keystroke' | 'id'>
  )> }
);

export type KeystrokesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type KeystrokesSubscription = (
  { __typename?: 'ChatSubscriptions' }
  & { keystrokeAdded?: Maybe<(
    { __typename?: 'PlayerKeystroke' }
    & Pick<PlayerKeystroke, 'playerName' | 'keystroke' | 'id'>
  )> }
);

export type GamePlayersSubscriptionVariables = Exact<{
  gameName: Scalars['String'];
}>;


export type GamePlayersSubscription = (
  { __typename?: 'ChatSubscriptions' }
  & { playerJoinedGame?: Maybe<(
    { __typename?: 'Player' }
    & Pick<Player, 'name' | 'index'>
  )> }
);


export const CreateGameDocument = gql`
    mutation CreateGame($gameName: String!) {
  createGame(name: $gameName) {
    name
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
    query GetGames($gameName: String!) {
  games(gameName: $gameName) {
    name
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
 *   },
 * });
 */
export function useGetGamesQuery(baseOptions: Apollo.QueryHookOptions<GetGamesQuery, GetGamesQueryVariables>) {
        return Apollo.useQuery<GetGamesQuery, GetGamesQueryVariables>(GetGamesDocument, baseOptions);
      }
export function useGetGamesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGamesQuery, GetGamesQueryVariables>) {
          return Apollo.useLazyQuery<GetGamesQuery, GetGamesQueryVariables>(GetGamesDocument, baseOptions);
        }
export type GetGamesQueryHookResult = ReturnType<typeof useGetGamesQuery>;
export type GetGamesLazyQueryHookResult = ReturnType<typeof useGetGamesLazyQuery>;
export type GetGamesQueryResult = Apollo.QueryResult<GetGamesQuery, GetGamesQueryVariables>;
export const JoinDocument = gql`
    mutation Join($name: String) {
  join(name: $name) {
    name
    index
  }
}
    `;
export type JoinMutationFn = Apollo.MutationFunction<JoinMutation, JoinMutationVariables>;

/**
 * __useJoinMutation__
 *
 * To run a mutation, you first call `useJoinMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinMutation, { data, loading, error }] = useJoinMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useJoinMutation(baseOptions?: Apollo.MutationHookOptions<JoinMutation, JoinMutationVariables>) {
        return Apollo.useMutation<JoinMutation, JoinMutationVariables>(JoinDocument, baseOptions);
      }
export type JoinMutationHookResult = ReturnType<typeof useJoinMutation>;
export type JoinMutationResult = Apollo.MutationResult<JoinMutation>;
export type JoinMutationOptions = Apollo.BaseMutationOptions<JoinMutation, JoinMutationVariables>;
export const JoinGameDocument = gql`
    mutation JoinGame($gameName: String!, $playerName: String!) {
  joinGame(gameName: $gameName, playerName: $playerName) {
    name
    index
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
 *   },
 * });
 */
export function useJoinGameMutation(baseOptions?: Apollo.MutationHookOptions<JoinGameMutation, JoinGameMutationVariables>) {
        return Apollo.useMutation<JoinGameMutation, JoinGameMutationVariables>(JoinGameDocument, baseOptions);
      }
export type JoinGameMutationHookResult = ReturnType<typeof useJoinGameMutation>;
export type JoinGameMutationResult = Apollo.MutationResult<JoinGameMutation>;
export type JoinGameMutationOptions = Apollo.BaseMutationOptions<JoinGameMutation, JoinGameMutationVariables>;
export const PlayersDocument = gql`
    subscription Players {
  playerJoined {
    name
    index
  }
}
    `;

/**
 * __usePlayersSubscription__
 *
 * To run a query within a React component, call `usePlayersSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePlayersSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayersSubscription({
 *   variables: {
 *   },
 * });
 */
export function usePlayersSubscription(baseOptions?: Apollo.SubscriptionHookOptions<PlayersSubscription, PlayersSubscriptionVariables>) {
        return Apollo.useSubscription<PlayersSubscription, PlayersSubscriptionVariables>(PlayersDocument, baseOptions);
      }
export type PlayersSubscriptionHookResult = ReturnType<typeof usePlayersSubscription>;
export type PlayersSubscriptionResult = Apollo.SubscriptionResult<PlayersSubscription>;
export const GetPlayersDocument = gql`
    query GetPlayers {
  players {
    name
    index
  }
}
    `;

/**
 * __useGetPlayersQuery__
 *
 * To run a query within a React component, call `useGetPlayersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlayersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlayersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPlayersQuery(baseOptions?: Apollo.QueryHookOptions<GetPlayersQuery, GetPlayersQueryVariables>) {
        return Apollo.useQuery<GetPlayersQuery, GetPlayersQueryVariables>(GetPlayersDocument, baseOptions);
      }
export function useGetPlayersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPlayersQuery, GetPlayersQueryVariables>) {
          return Apollo.useLazyQuery<GetPlayersQuery, GetPlayersQueryVariables>(GetPlayersDocument, baseOptions);
        }
export type GetPlayersQueryHookResult = ReturnType<typeof useGetPlayersQuery>;
export type GetPlayersLazyQueryHookResult = ReturnType<typeof useGetPlayersLazyQuery>;
export type GetPlayersQueryResult = Apollo.QueryResult<GetPlayersQuery, GetPlayersQueryVariables>;
export const GameKeystrokesDocument = gql`
    subscription GameKeystrokes($gameName: String!) {
  gameKeystroke(gameName: $gameName) {
    playerName
    keystroke
    id
  }
}
    `;

/**
 * __useGameKeystrokesSubscription__
 *
 * To run a query within a React component, call `useGameKeystrokesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGameKeystrokesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameKeystrokesSubscription({
 *   variables: {
 *      gameName: // value for 'gameName'
 *   },
 * });
 */
export function useGameKeystrokesSubscription(baseOptions: Apollo.SubscriptionHookOptions<GameKeystrokesSubscription, GameKeystrokesSubscriptionVariables>) {
        return Apollo.useSubscription<GameKeystrokesSubscription, GameKeystrokesSubscriptionVariables>(GameKeystrokesDocument, baseOptions);
      }
export type GameKeystrokesSubscriptionHookResult = ReturnType<typeof useGameKeystrokesSubscription>;
export type GameKeystrokesSubscriptionResult = Apollo.SubscriptionResult<GameKeystrokesSubscription>;
export const KeystrokesDocument = gql`
    subscription Keystrokes {
  keystrokeAdded {
    playerName
    keystroke
    id
  }
}
    `;

/**
 * __useKeystrokesSubscription__
 *
 * To run a query within a React component, call `useKeystrokesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useKeystrokesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useKeystrokesSubscription({
 *   variables: {
 *   },
 * });
 */
export function useKeystrokesSubscription(baseOptions?: Apollo.SubscriptionHookOptions<KeystrokesSubscription, KeystrokesSubscriptionVariables>) {
        return Apollo.useSubscription<KeystrokesSubscription, KeystrokesSubscriptionVariables>(KeystrokesDocument, baseOptions);
      }
export type KeystrokesSubscriptionHookResult = ReturnType<typeof useKeystrokesSubscription>;
export type KeystrokesSubscriptionResult = Apollo.SubscriptionResult<KeystrokesSubscription>;
export const GamePlayersDocument = gql`
    subscription GamePlayers($gameName: String!) {
  playerJoinedGame(gameName: $gameName) {
    name
    index
  }
}
    `;

/**
 * __useGamePlayersSubscription__
 *
 * To run a query within a React component, call `useGamePlayersSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGamePlayersSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGamePlayersSubscription({
 *   variables: {
 *      gameName: // value for 'gameName'
 *   },
 * });
 */
export function useGamePlayersSubscription(baseOptions: Apollo.SubscriptionHookOptions<GamePlayersSubscription, GamePlayersSubscriptionVariables>) {
        return Apollo.useSubscription<GamePlayersSubscription, GamePlayersSubscriptionVariables>(GamePlayersDocument, baseOptions);
      }
export type GamePlayersSubscriptionHookResult = ReturnType<typeof useGamePlayersSubscription>;
export type GamePlayersSubscriptionResult = Apollo.SubscriptionResult<GamePlayersSubscription>;
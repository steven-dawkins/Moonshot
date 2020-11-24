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

export type ChatQuery = {
  __typename?: 'ChatQuery';
  keystrokes?: Maybe<Array<Maybe<PlayerKeystroke>>>;
  players?: Maybe<Array<Maybe<Player>>>;
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

export type ChatMutation = {
  __typename?: 'ChatMutation';
  addKeystroke?: Maybe<PlayerKeystroke>;
  join: Player;
};


export type ChatMutationAddKeystrokeArgs = {
  playerName?: Maybe<Scalars['String']>;
  keystroke?: Maybe<Scalars['String']>;
};


export type ChatMutationJoinArgs = {
  name?: Maybe<Scalars['String']>;
};

export type ChatSubscriptions = {
  __typename?: 'ChatSubscriptions';
  keystrokeAdded?: Maybe<PlayerKeystroke>;
  playerJoined?: Maybe<Player>;
};

export type JoinMutationVariables = Exact<{
  name?: Maybe<Scalars['String']>;
}>;


export type JoinMutation = (
  { __typename?: 'ChatMutation' }
  & { join: (
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
  { __typename?: 'ChatQuery' }
  & { players?: Maybe<Array<Maybe<(
    { __typename?: 'Player' }
    & Pick<Player, 'name' | 'index'>
  )>>> }
);

export type KeystrokesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type KeystrokesSubscription = (
  { __typename?: 'ChatSubscriptions' }
  & { keystrokeAdded?: Maybe<(
    { __typename?: 'PlayerKeystroke' }
    & Pick<PlayerKeystroke, 'playerName' | 'keystroke' | 'id'>
  )> }
);


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
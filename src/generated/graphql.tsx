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
  messages?: Maybe<Array<Maybe<Scalars['String']>>>;
  players?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type ChatMutation = {
  __typename?: 'ChatMutation';
  addMessage?: Maybe<Scalars['String']>;
  join?: Maybe<Scalars['String']>;
};


export type ChatMutationAddMessageArgs = {
  message?: Maybe<Scalars['String']>;
};


export type ChatMutationJoinArgs = {
  name?: Maybe<Scalars['String']>;
};

export type ChatSubscriptions = {
  __typename?: 'ChatSubscriptions';
  messageAdded?: Maybe<Scalars['String']>;
};

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = (
  { __typename?: 'ChatQuery' }
  & Pick<ChatQuery, 'players'>
);


export const Document = gql`
    {
  players
}
    `;

/**
 * __useQuery__
 *
 * To run a query within a React component, call `useQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuery({
 *   variables: {
 *   },
 * });
 */
export function useQuery(baseOptions?: Apollo.QueryHookOptions<Query, QueryVariables>) {
        return Apollo.useQuery<Query, QueryVariables>(Document, baseOptions);
      }
export function useLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Query, QueryVariables>) {
          return Apollo.useLazyQuery<Query, QueryVariables>(Document, baseOptions);
        }
export type QueryHookResult = ReturnType<typeof useQuery>;
export type LazyQueryHookResult = ReturnType<typeof useLazyQuery>;
export type QueryResult = Apollo.QueryResult<Query, QueryVariables>;
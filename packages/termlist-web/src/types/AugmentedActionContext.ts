import type { ActionContext } from 'vuex'
import type { Actions, Mutations } from '../store'
import type { StateType } from './StateType'

export type AugmentedActionContext<
  M extends { [i: string]: (...args: any) => any },
  A extends { [i: string]: (...args: any) => any },
  S
> = {
  commit<K extends keyof M>(
    type: K,
    payload?: Parameters<M[K]>[1],
    options?: { silent?: boolean }
  ): ReturnType<M[K]>
  commit<K extends keyof Mutations>(
    type: string,
    payload: Parameters<Mutations[K]>[1],
    options: { silent?: boolean; root: true }
  ): void
  dispatch<K extends keyof A>(
    type: K,
    payload?: Parameters<A[K]>[1]
  ): ReturnType<A[K]>
  dispatch<K extends keyof Actions>(
    type: K,
    payload: Parameters<Actions[K]>[1],
    options: { root: true }
  ): ReturnType<Actions[K]>
} & Omit<ActionContext<S, StateType>, 'commit' | 'dispatch'>

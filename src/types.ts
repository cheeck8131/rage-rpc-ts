import System from "./system";

type IServices<T extends System.ServicesType> = {
  [K in keyof T]: { [L in keyof InstanceType<T[K]>]: InstanceType<T[K]>[L] };
};
type IForProxy<T extends System.ServicesInstanceType> = {
  [K in keyof T]: System.GetPrefixedAndRemovePrefixFromObject<
    T[K],
    System.PREF
  >;
};
type IForProxyPromised<T extends System.ServicesInstanceType> = {
  [K in keyof T]: {
    [N in keyof T[K]]: T[K][N] extends (...args: any) => any // type to verify
      ? System.ReplaceReturnType<
          T[K][N],
          ReturnType<T[K][N]> extends Promise<any>
            ? ReturnType<T[K][N]>
            : Promise<ReturnType<T[K][N]>>
        >
      : T[K][N] extends System.anyFunction
      ? (...args: Parameters<T[K][N]>) => ReturnType<T[K][N]>
      : never;
  };
};
type IProxySafeUncapitalized<T extends System.ServicesInstanceType> = {
  [K in System.Uncap<keyof T>]: System.UncapValue<T, K>;
};
type IProxySafeUncapEvents<T extends System.ServicesInstanceType> = {
  [K in keyof T]: {
    [N in System.Uncap<keyof T[K]>]: System.UncapValue<T[K], N>;
  };
};
type INoRet<T extends System.ServicesInstanceType> = {
  [K in keyof T]: {
    [N in keyof T[K]]: T[K][N] extends (...args: infer A) => infer R
      ? ((...args: A) => void) & { async(...args: A): R }
      : never;
  };
};

type IForProxyPlayerSafe<T extends System.ServicesInstanceType> = {
  [K in keyof T]: {
    [N in keyof T[K]]: T[K][N] extends System.anyFunction
      ? System.RemoveFirstArgument<T[K][N], PlayerMp>
      : never;
  };
};

type IForProxyJsonSafe<T extends System.ServicesInstanceType> = {
  [K in keyof T]: System.ReplaceReturnTypeInObject<
    System.ReplaceReturnTypeInObject<
      System.ReplaceReturnTypeInObject<
        T[K],
        Map<any, any>,
        System.UnsupportedNetworkType<Map<any, any>>
      >,
      Set<any>,
      System.UnsupportedNetworkType<Set<any>>
    >,
    Date,
    string
  >;
};

export type IProxy<T extends System.ServicesType> = INoRet<
  IProxySafeUncapEvents<
    IProxySafeUncapitalized<
      IForProxyJsonSafe<
        IForProxyPlayerSafe<IForProxyPromised<IForProxy<IServices<T>>>>
      >
    >
  >
>;

export type AllEvents<T extends System.ServicesType> = System.NoIntersection<
  System.UnionToIntersection<
    System.UnpackObjectEntries<{
      [K in keyof T]: System.AddPrefixToObject<
        IForProxyJsonSafe<
          IForProxyPlayerSafe<IForProxyPromised<IForProxy<IServices<T>>>>
        >[K],
        K extends string ? K : never
      >;
    }>
  >
>;
export type AllAsyncEvents<T extends System.ServicesType> =
  System.SelectFunctionsWhereReturnTypeIsNotNullable<
    AllEvents<T> extends { [K: string]: System.anyFunction }
      ? AllEvents<T>
      : never
  >;
export type AllSyncEvents<T extends System.ServicesType> =
  System.SelectFunctionsWhereReturnTypeIsNullable<
    AllEvents<T> extends { [K: string]: System.anyFunction }
      ? AllEvents<T>
      : never
  >;

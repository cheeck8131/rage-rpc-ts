declare global {
  interface PlayerMp {}
}

export declare namespace RuntimeTypes {
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

  export type AllProcedures<T extends System.ServicesType> =
    System.NoIntersection<
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
  export type AllAsyncProcedures<T extends System.ServicesType> =
    System.SelectFunctionsWhereReturnTypeIsNotNullable<
      AllProcedures<T> extends { [K: string]: System.anyFunction }
        ? AllProcedures<T>
        : never
    >;
  export type AllSyncProcedures<T extends System.ServicesType> =
    System.SelectFunctionsWhereReturnTypeIsNullable<
      AllProcedures<T> extends { [K: string]: System.anyFunction }
        ? AllProcedures<T>
        : never
    >;
}

export declare namespace System {
  namespace Service {
    type ServerToServerInvoker<T extends System.ServicesType> = <
      Procedures extends RuntimeTypes.AllProcedures<T>,
      ProcedureName extends keyof Procedures,
      Procedure extends Procedures[ProcedureName],
      ProcedureArguments extends System.FnParams<Procedure>,
      ProcedureReturn extends ReturnType<
        Procedure extends Function ? Procedure : never
      >
    >(
      name: ProcedureName,
      ..._: ProcedureArguments
    ) => ProcedureReturn;

    type ClientToServerInvoker<T extends System.ServicesType> = <
      Procedures extends RuntimeTypes.AllProcedures<T>,
      ProcedureName extends keyof Procedures,
      Procedure extends Procedures[ProcedureName],
      ProcedureArguments extends System.FnParams<Procedure>,
      ProcedureReturn extends ReturnType<
        Procedure extends Function ? Procedure : never
      >
    >(
      name: ProcedureName,
      ..._: ProcedureArguments
    ) => ProcedureReturn;

    type ServiceInstances<T extends System.ServicesType> = {
      [K in System.Uncap<keyof T>]: InstanceType<
        System.UncapValue<T, K> extends System.AbstractClass
          ? System.UncapValue<T, K>
          : never
      >;
    };
    type IServices<T extends System.ServicesType> = {
      [K in keyof T]: {
        [L in keyof InstanceType<T[K]>]: InstanceType<T[K]>[L];
      };
    };
    type IForProxy<T extends System.ServicesInstanceType> = {
      [K in keyof T]: System.GetPrefixedAndRemovePrefixFromObject<
        T[K],
        System.PREF
      >;
    };
    type IForProxyPromised<T extends System.ServicesInstanceType> = {
      [K in keyof T]: {
        [N in keyof T[K]]: T[K][N] extends (
          ...args: any
        ) => number | string | Promise<any>
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
    type ProxyConnect<T extends System.ServicesType> = System.Service.INoRet<
      System.Service.IProxySafeUncapEvents<
        System.Service.IProxySafeUncapitalized<
          System.Service.IForProxyPromised<
            System.Service.IForProxy<System.Service.IServices<T>>
          >
        >
      >
    >;
  }
  type anyFunction = (...args: any[]) => any;
  type UnionToIntersection<U> = (
    U extends any ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;
  type NoIntersection<I extends { [K in keyof I]: any }> = {
    [K in keyof I]: I[K];
  };
  type ReplaceReturnType<T extends (...a: any[]) => any, TNewReturn> = (
    ...a: Parameters<T>
  ) => TNewReturn;
  type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any }
    ? T[K]
    : undefined;
  type Subtract<A, C> = A extends C ? never : A;
  type CommonKeys<T extends object> = keyof T;
  type NonCommonKeys<T extends object> = Subtract<AllKeys<T>, CommonKeys<T>>;
  type PickTypeOf<T, K extends string | number | symbol> = K extends AllKeys<T>
    ? PickType<T, K>
    : never;
  export type PREF = "rpc";
  export type ServicesType = { [K: string]: System.AnyClass };
  export type ServicesInstanceType = {
    [K: string]: InstanceType<System.AnyClass>;
  };
  export type AnyClass = new (...args: any[]) => any;
  export type AbstractClass = abstract new (...args: any) => any;
  export type Merge<T extends object> = {
    [k in CommonKeys<T>]: PickTypeOf<T, k>;
  } & {
    [k in NonCommonKeys<T>]?: PickTypeOf<T, k>;
  };
  export type Uncap<T> = T extends string ? Uncapitalize<T> : never;
  export type UncapValue<Target, Key extends string> = Target extends {
    [K in Capitalize<Key>]: infer V;
  }
    ? V
    : never;
  export type UnsupportedNetworkType<T> = { [K in keyof T]: any };
  export type ArgumentMissed<T> = { [K in keyof T]: any };

  export type RemoveFirstArgument<
    T extends (arg: ArgType, ...args: any[]) => any,
    ArgType
  > = T extends (arg: ArgType, ...args: infer A) => infer R
    ? (...args: A) => R
    : T extends (...args: any) => infer R
    ? (_: ArgumentMissed<ArgType>) => R
    : never;
  export type RemoveFirstArgumentInObject<
    T extends { [K in keyof T]: System.anyFunction },
    ArgType
  > = { [K in keyof T]: RemoveFirstArgument<T[K], ArgType> };

  type DeepPartialAny<T> = {
    [P in keyof T]?: T[P] extends AnyObject ? DeepPartialAny<T[P]> : any;
  };
  type AnyObject = Record<string, any>;
  export type ModifyDeep<A extends AnyObject, B extends DeepPartialAny<A>> = {
    [K in keyof A]: B[K] extends never
      ? A[K]
      : B[K] extends AnyObject
      ? ModifyDeep<A[K], B[K]>
      : B[K];
  } & (A extends AnyObject ? Omit<B, keyof A> : A);

  export type UnpackObjectEntries<T extends { [K in keyof T]: any }> = {
    [K in keyof T]: { [N in keyof T[K]]: T[K][N] };
  }[keyof T];
  export type ReplaceReturnTypeInObject<
    T extends { [K in keyof T]: any },
    Trigger,
    Type
  > = {
    [K in keyof T]: System.ReplaceReturnType<
      T[K],
      System.PromiseResult<ReturnType<T[K]>> extends Trigger
        ? Promise<Type>
        : ReturnType<T[K]>
    >;
  };
  export type PromiseResult<T> = T extends PromiseLike<infer U> ? U : T;
  export type FnParams<T> = T extends (...arg: infer R) => any ? R : never;
  export type AllKeys<T> = T extends any ? keyof T : never;
  type AsyncFunctions<T extends { [K in keyof T]: anyFunction }> = {
    [K in keyof T]: ReturnType<T[K]> extends Promise<any> ? T[K] : void;
  };
  type SyncFunctions<T extends { [K in keyof T]: anyFunction }> = {
    [K in keyof T]: ReturnType<T[K]> extends Promise<any> ? void : T[K];
  };
  export type GetSyncFunctions<T extends { [K in keyof T]: anyFunction }> =
    SelectOnlyFunctions<SyncFunctions<T>>;
  export type GetAsyncFunctions<T extends { [K in keyof T]: anyFunction }> =
    SelectOnlyFunctions<AsyncFunctions<T>>;
  export type GetAllFunctions<T extends { [K in keyof T]: anyFunction }> =
    GetSyncFunctions<T> & GetAsyncFunctions<T>;
  export type Functions<T> = {
    [P in keyof T]: Exclude<T[P], undefined> extends anyFunction ? P : never;
  }[keyof T];
  export type Props<T> = {
    [P in keyof T]: Exclude<T[P], undefined> extends anyFunction ? never : P;
  }[keyof T];
  export type SelectFunctionsWhereReturnTypeIsNotNullable<
    T extends { [K in keyof T]: anyFunction }
  > = Pick<
    T,
    {
      [P in keyof T]: ReturnType<Exclude<T[P], undefined>> extends
        | void
        | undefined
        | null
        ? never
        : P;
    }[keyof T]
  >;
  export type SelectFunctionsWhereReturnTypeIsNullable<
    T extends { [K in keyof T]: anyFunction }
  > = Pick<
    T,
    {
      [P in keyof T]: ReturnType<Exclude<T[P], undefined>> extends
        | void
        | undefined
        | null
        ? P
        : never;
    }[keyof T]
  >;
  export type SelectOnlyFunctions<T> = Pick<T, Functions<T>>;
  export type SelectOnlyProps<T> = Pick<T, Props<T>>;
  export type DocumentClassToJObject<T> = SelectOnlyProps<T> & {
    _id: string;
    __v: number;
  };
  export type AddPrefix<TKey, TPrefix extends string> = TKey extends string
    ? `${TPrefix}${TKey}`
    : never;
  export type RemovePrefix<
    TPrefixedKey,
    TPrefix extends string
  > = TPrefixedKey extends AddPrefix<infer TKey, TPrefix> ? TKey : "";
  export type PrefixedValue<
    TObject extends object,
    TPrefixedKey extends string,
    TPrefix extends string
  > = TObject extends {
    [K in RemovePrefix<TPrefixedKey, TPrefix>]: infer TValue;
  }
    ? TValue
    : never;
  export type NonPrefixedValue<
    TObject extends object,
    TPrefixedKey extends string,
    TPrefix extends string
  > = TObject extends {
    [K in AddPrefix<TPrefixedKey, TPrefix>]: infer TValue;
  }
    ? TValue
    : never;
  export type AddPrefixToObject<
    TObject extends object,
    TPrefix extends string
  > = {
    [K in AddPrefix<keyof TObject, TPrefix>]: PrefixedValue<
      TObject,
      K,
      TPrefix
    >;
  };
  export type GetPrefixedValueFromObject<
    TObject extends object,
    TPrefix extends string
  > = AddPrefixToObject<
    Omit<
      {
        [K in RemovePrefix<keyof TObject, TPrefix>]: NonPrefixedValue<
          TObject,
          K,
          TPrefix
        >;
      },
      ""
    >,
    TPrefix
  >;
  export type GetPrefixedAndRemovePrefixFromObject<
    TObject extends object,
    TPrefix extends string
  > = Omit<
    {
      [K in RemovePrefix<keyof TObject, TPrefix>]: NonPrefixedValue<
        TObject,
        K,
        TPrefix
      >;
    },
    ""
  >;
}

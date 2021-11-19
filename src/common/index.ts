import "./tools";
import rpc from "rage-rpc";
import { System, RuntimeTypes } from "./types";

export abstract class Service<
  // @ts-ignore TODO: ServiceGenericType is user value
  T extends System.ServicesType = ServiceGenericType
> {
  private static namespaces = <{ [key: string]: any }>{};
  private static EV_PREFIX = /^rpc/;
  private static procedures = new Map<string, System.anyFunction>();

  public services = <System.Service.ServiceInstances<T>>Service.namespaces;

  public static Invoker = class Invoker<
    // @ts-ignore TODO: ServiceGenericType is user value
    T extends System.ServicesType = ServiceGenericType
  > {
    public call = <System.Service.ClientToServerInvoker<T>>((
      name: string,
      ...args: any[]
    ) => {
      const proc = Service.procedures.get(name);

      if (proc) {
        return proc(...args);
      } else {
        throw new Error(
          `Runtime error: remote procedure ${name} is not defined`
        );
      }
    });

    public services = <RuntimeTypes.IServices<T>>Service.namespaces;
  };

  public static combineServices<T extends System.ServicesType>(services: T) {
    let arr = Object.keys(Service.namespaces);
    for (const key in services) {
      // arr.splice(arr.indexOf(key), 1);
      arr.remove(key);
    }
    if (arr.length !== 0) {
      throw new Error(`Runtime error: ${arr} is missing to combineServices`);
    }

    return services;
  }

  public static namespace<TClass extends System.AnyClass>(Target: TClass) {
    if (Service.namespaces[Target.name]) {
      throw new Error(`Error: namespace '${Target.name}' is already defined`);
    }

    const single = new Target();
    Service.namespaces[Target.name] = single;

    let eventMethods = Object.getOwnPropertyNames(Target.prototype).filter(
      (name) => Service.EV_PREFIX.test(name)
    );

    for (const iterator of eventMethods) {
      const name = `${Target.name}${iterator.replace(Service.EV_PREFIX, "")}`;
      if (!Service.procedures.has(name)) {
        throw new Error(
          `Error: ${iterator} in ${Target.name} has no decorator @access`
        );
      } else {
        const f = Service.procedures.get(name);
        if (f) {
          Service.procedures.set(name, f.bind(single));
        } else {
          throw new Error(`Runtime error: ${name} is not registered`);
        }
      }
    }
  }

  public static access(Target: Object, propertyKey: string) {
    let prefix = Target.constructor.name;
    if (prefix === "Function") {
      prefix = Reflect.get(Target, "name");
    }

    if (!Service.EV_PREFIX.test(propertyKey)) {
      throw new Error(`Error: ${propertyKey} in ${prefix} no 'event' prefix`);
    }

    let name = `${prefix}${propertyKey.replace(Service.EV_PREFIX, "")}`;

    if (Service.procedures.has(name)) {
      throw new Error(`Error: event ${name} is already registered`);
    } else {
      let f: System.anyFunction = Reflect.get(Target, propertyKey);
      if (f instanceof Function) {
        // TODO: Remove 'reflect-metadata'from dependencies
        Service.procedures.set(name, f); // TODO: remove rage-rpc from dependencies
        rpc.register(name, f);
      } else {
        throw new Error(`Runtime error: ${name} is not a function`);
      }
    }
  }
}

import rpc from "rage-rpc";
import System from "./system";

type ServiceInstances<T extends System.ServicesType> = {
  [K in System.Uncap<keyof T>]: InstanceType<
    System.UncapValue<T, K> extends System.AbstractClass
      ? System.UncapValue<T, K>
      : never
  >;
};

export const namespaces = {} as any;
export const events = new Map<string, System.anyFunction>();

const EV_PREF = /^rpc/;

export abstract class Service<T extends System.ServicesType> {
  public services: ServiceInstances<T>;
  constructor() {
    this.services = namespaces;
  }
}

export function namespace<TClass extends System.AnyClass>(Target: TClass) {
  if (namespaces[Target.name]) {
    throw new Error(`Error: namespace '${Target.name}' is already defined`);
  }

  const single = new Target();
  namespaces[Target.name] = single;

  let eventMethods = Object.getOwnPropertyNames(Target.prototype).filter(
    (name) => EV_PREF.test(name)
  );

  for (const iterator of eventMethods) {
    const name = `${Target.name}${iterator.replace(EV_PREF, "")}`;
    if (!events.has(name)) {
      throw new Error(
        `Error: ${iterator} in ${Target.name} has no decorator @access`
      );
    } else {
      const f = events.get(name);
      if (f) {
        events.set(name, f.bind(single));
      } else {
        throw new Error(`Runtime error: ${name} is not registered`);
      }
    }
  }
}

export function access(Target: Object, propertyKey: string) {
  let prefix = Target.constructor.name;
  if (prefix === "Function") {
    prefix = Reflect.get(Target, "name");
  }

  if (!EV_PREF.test(propertyKey)) {
    throw new Error(`Error: ${propertyKey} in ${prefix} no 'event' prefix`);
  }

  let name = `${prefix}${propertyKey.replace(EV_PREF, "")}`;

  if (events.has(name)) {
    throw new Error(`Error: event ${name} is already registered`);
  } else {
    let f: System.anyFunction = Reflect.get(Target, propertyKey);
    if (f instanceof Function) {
      // TODO: Remove 'reflect-metadata'from dependencies
      events.set(name, f); // TODO: remove rage-rpc from dependencies
      rpc.register(name, f);
    } else {
      throw new Error(`Runtime error: ${name} is not a function`);
    }
  }
}

export function combineServices<T extends object>(services: T) {
  let arr = Object.keys(namespaces);
  for (const key in services) {
    arr.splice(arr.indexOf(key), 1);
    // arr.remove(key);
  }
  if (arr.length !== 0) {
    throw new Error(`Runtime error: ${arr} is missing to combineServices`);
  }

  return services;
}

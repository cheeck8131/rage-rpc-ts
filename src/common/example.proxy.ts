import rpc from "rage-rpc";
import { RuntimeTypes } from "./types";

const serverProxyCache = new Map<string, InstanceType<typeof Proxy>>();
export const server = new Proxy(
  {},
  {
    get(_, service: string) {
      if (serverProxyCache.has(service)) {
        return serverProxyCache.get(service);
      } else {
        const proxy = new Proxy(
          {},
          {
            get(_, event: string) {
              const call = (noRet: boolean, ...args: any[]) => {
                const eventName = `${service.capitalize()}${event}`;
                return rpc.callServer(eventName, args, { timeout: 60 * 1000, noRet });
              };

              call.bind(null, true);
              (call as any).noRet = (...args: any[]) => {
                call(false, ...args);
              };

              return call;
            },
          }
        );
        serverProxyCache.set(service, proxy);
        return proxy;
      }
    },
  }
) as RuntimeTypes.IProxy<ServiceGenericType>;

server.system.clientRequWDest

const clientProxyCache = new Map<string, InstanceType<typeof Proxy>>();
export const client = new Proxy(
  {},
  {
    get(_, service: string) {
      if (clientProxyCache.has(service)) {
        return clientProxyCache.get(service);
      } else {
        const proxy = new Proxy(
          {},
          {
            get(_, event: string) {
              const call = (noRet: boolean, ...args: any[]) => {
                const eventName = `${service.capitalize()}${event}`;
                return rpc.callServer(eventName, args, { timeout: 60 * 1000, noRet });
              };

              call.bind(null, true);
              (call as any).noRet = (...args: any[]) => {
                call(false, ...args);
              };

              return call;
            },
          }
        );
        clientProxyCache.set(service, proxy);
        return proxy;
      }
    },
  }
) as RuntimeTypes.IProxy<any>; // any to client type

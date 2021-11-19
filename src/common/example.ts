import { Service } from ".";

declare global {
  type ServiceGenericType = typeof aw;
}

@Service.namespace
class System extends Service {
  constructor() {
    super();
    this.services.system.rpcClientRequest;
  }

  some() {
    this.services.system.some();
  }

  private asfe() {
    this.services.system.some();
  }

  @Service.access
  rpcClientRequest(player: PlayerMp, awawd: Date) {}

  rpcClientRequWDest(player: PlayerMp, someNumber: number) {
    return [123];
  }
}

const aw = Service.combineServices({ System });

async function s() {
  const local = new Service.Invoker();
  local.services.System.rpcClientRequest(<PlayerMp>{}, new Date());
  const a = await local.call("SystemClientRequWDest", );
}

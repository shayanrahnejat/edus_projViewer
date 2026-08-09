export class IrancellMarketplaceGateway{constructor(options={}){this.options=options;this.name='marketplace';}request(operation,payload){const remote=new IrancellRemoteGateway(this.name,this.options);return remote.request(operation,payload);}}
export const IRANCELL_MARKETPLACE_GATEWAY=new IrancellMarketplaceGateway();

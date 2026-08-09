export class IrancellAnalyticsGateway{constructor(options={}){this.options=options;this.name='analytics';}request(operation,payload){const remote=new IrancellRemoteGateway(this.name,this.options);return remote.request(operation,payload);}}
export const IRANCELL_ANALYTICS_GATEWAY=new IrancellAnalyticsGateway();

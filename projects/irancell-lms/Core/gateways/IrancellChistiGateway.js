export class IrancellChistiGateway{constructor(options={}){this.options=options;this.name='chisti';}request(operation,payload){const remote=new IrancellRemoteGateway(this.name,this.options);return remote.request(operation,payload);}}
export const IRANCELL_CHISTI_GATEWAY=new IrancellChistiGateway();

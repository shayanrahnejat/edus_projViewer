export class IrancellBinaeiGateway{constructor(options={}){this.options=options;this.name='binaei';}request(operation,payload){const remote=new IrancellRemoteGateway(this.name,this.options);return remote.request(operation,payload);}}
export const IRANCELL_BINAEI_GATEWAY=new IrancellBinaeiGateway();

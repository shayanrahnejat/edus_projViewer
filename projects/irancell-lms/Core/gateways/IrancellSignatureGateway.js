export class IrancellSignatureGateway{constructor(options={}){this.options=options;this.name='signature';}request(operation,payload){const remote=new IrancellRemoteGateway(this.name,this.options);return remote.request(operation,payload);}}
export const IRANCELL_SIGNATURE_GATEWAY=new IrancellSignatureGateway();

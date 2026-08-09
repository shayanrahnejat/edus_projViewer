export class IrancellDialogiGateway{constructor(options={}){this.options=options;this.name='dialogi';}request(operation,payload){const remote=new IrancellRemoteGateway(this.name,this.options);return remote.request(operation,payload);}}
export const IRANCELL_DIALOGI_GATEWAY=new IrancellDialogiGateway();

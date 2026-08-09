export class IrancellIdentityGateway{constructor(options={}){this.options=options;this.name='identity';}request(operation,payload){const remote=new IrancellRemoteGateway(this.name,this.options);return remote.request(operation,payload);}}
export const IRANCELL_IDENTITY_GATEWAY=new IrancellIdentityGateway();

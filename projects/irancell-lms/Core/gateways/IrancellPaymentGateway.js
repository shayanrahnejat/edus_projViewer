export class IrancellPaymentGateway{constructor(options={}){this.options=options;this.name='payment';}request(operation,payload){const remote=new IrancellRemoteGateway(this.name,this.options);return remote.request(operation,payload);}}
export const IRANCELL_PAYMENT_GATEWAY=new IrancellPaymentGateway();

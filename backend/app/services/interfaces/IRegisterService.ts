export abstract class IRegisterService {
  abstract register(payload: any): Promise<any>
}

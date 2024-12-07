/**
 * Configuration accepted by the transport
 */
export type MailTrapConfig = {
  host: string
  port: number
  auth: {
    user: string
    pass: string
  }
}

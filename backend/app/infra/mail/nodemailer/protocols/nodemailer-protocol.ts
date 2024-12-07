import type {
  MailManagerTransportFactory as MailManagerTransportFactoryAdonis,
  MailTransportContract as MailTransportContractAdonis,
  NodeMailerMessage as NodeMailerMessageAdonis,
} from '@adonisjs/mail/types'

export interface MailTransportContract extends MailTransportContractAdonis {}
export interface MailManagerTransportFactory extends MailManagerTransportFactoryAdonis {}
export interface NodeMailerMessage extends NodeMailerMessageAdonis {}

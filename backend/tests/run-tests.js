import { execSync } from 'child_process'

// Rodar testes sem aceitar argumentos
execSync('node ace test', { stdio: 'inherit' })
